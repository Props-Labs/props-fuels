import { Account, Address, DateTime, BytesLike } from "fuels";
import { NFTMetadata, CollectionCreateConfigurationOptions, Network, CollectionCreateOptions } from "../common/types";
import { defaultEndDate, defaultNetwork, defaultStartDate, registryContractAddress } from "../common/defaults";
import { configurableOptionsTypeMapping, supportedProps721CollectionContractConfigurableOptions, supportedProps721CollectionContractConfigurableOptionsMapping } from "../common/constants";
import { Props721CollectionContractAbi__factory } from "../sway-api/contracts";
import bytecode from "../sway-api/contracts/Props721CollectionContractAbi.hex";
import type { MetadataInput } from "../sway-api/contracts/Props721CollectionContractAbi";
import { executeGraphQLQuery } from "../core/fuels-api";
import { Collection } from "../collection/collection";
import { randomBytes } from "fuels";
import { encodeMetadataValues } from "../utils/metadata";
import { PropsContractManager } from "../contract/contract-manager";
import { PropsRegistryContractAbi__factory } from "../sway-api/contracts";

/**
 * @class CollectionManager
 * @classdesc Manages collections within the Props SDK on the Fuel network.
 */
export class CollectionManager extends PropsContractManager {

  /**
   * Creates a new instance of the CollectionManager class.
   */
  constructor() {
    // Initialize the CollectionManager class
    super();
  }

  /**
   * Creates a new collection.
   * @param {CollectionCreateOptions} params - Additional configuration options for creating the collection.
   * @returns {Promise<string>} A promise that resolves to the ID of the created collection.
   */
  async create(params: CollectionCreateOptions): Promise<Collection> {
    const { name, symbol, baseUri, price, startDate, endDate, options } =
      params;
    // Replace the following with the actual implementation to interact with the Fuel network
    this.emit(this.events.transaction, {
      params: { name, symbol, baseUri, options },
      message: "Awaiting transaction approval...",
      transactionIndex: 1,
      transactionCount: 2,
    });

    const { owner } = options;

    const configurableConstants = Object.keys(options)
      .filter((key) =>
        supportedProps721CollectionContractConfigurableOptions.includes(key)
      )
      .reduce(
        (obj, key) => {
          const mappedKey =
            supportedProps721CollectionContractConfigurableOptionsMapping[key];
          (obj as any)[mappedKey] = configurableOptionsTypeMapping[key](
            options[key as keyof CollectionCreateConfigurationOptions]
          );
          return obj;
        },
        {} as Partial<Record<string, any>>
      );

    const salt: BytesLike = randomBytes(32);
    const { waitForResult } =
      await Props721CollectionContractAbi__factory.deployContract(
        bytecode,
        owner,
        {
          configurableConstants,
          salt,
        }
      );

    this.emit(this.events.pending, {
      params: { name, symbol, baseUri, options },
      message: "Waiting for transaction to clear...",
      transactionIndex: 1,
      transactionCount: 2,
    });

    const { contract } = await waitForResult();

    const address = Address.fromDynamicInput(owner.address);
    const addressInput = { bits: address.toB256() };
    const addressIdentityInput = { Address: addressInput };

    this.emit(this.events.transaction, {
      params: { name, symbol, baseUri, options },
      message: "Awaiting transaction approval...",
      transactionIndex: 2,
      transactionCount: 2,
    });

    const startDateTai = startDate
      ? DateTime.fromUnixMilliseconds(startDate).toTai64()
      : defaultStartDate;
    const endDateTai = endDate
      ? DateTime.fromUnixMilliseconds(endDate).toTai64()
      : defaultEndDate;

    const registryContract = PropsRegistryContractAbi__factory.connect(
      registryContractAddress,
      owner
    );

    const { waitForResult: waitForResultConstructor } = await contract.functions
      .constructor(
        addressIdentityInput,
        name,
        symbol,
        baseUri,
        price ?? 0,
        startDateTai,
        endDateTai
      )
      .addContracts([registryContract])
      .call();

    this.emit(this.events.pending, {
      params: { name, symbol, baseUri, options },
      message: "Waiting for transaction to clear...",
      transactionIndex: 2,
      transactionCount: 2,
    });

    const { transactionResult } = await waitForResultConstructor();

    if (transactionResult?.gqlTransaction?.status?.type === "SuccessStatus") {
      return new Collection(contract.id.toString(), contract, owner, baseUri);
    } else {
      throw new Error(
        "Failed to create collection: Transaction was not successful"
      );
    }
  }

  async list(
    owner: Account,
    network: Network = defaultNetwork
  ): Promise<Array<Collection>> {
    const queryTransactions = `
      query Transactions($address: Address) {
        transactionsByOwner(owner: $address, first: 100) {
          nodes {
            id
            outputs {
              __typename
              ... on ContractCreated {
                contract
                stateRoot
              }
            }
          }
        }
      }
    `;

    const variables = { address: owner.address.toB256() };

    if (!network.graphqlUrl) {
      throw new Error("GraphQL URL is not available for this network");
    }

    // Execute the GraphQL query to get transactions
    const transactionData = await executeGraphQLQuery(
      network.graphqlUrl,
      queryTransactions,
      variables
    );

    // console.log("transactionData", transactionData);

    const contractIds = transactionData.data.transactionsByOwner.nodes.flatMap(
      (node: any) =>
        node.outputs
          .filter((output: any) => output.__typename === "ContractCreated")
          .map((output: any) => output.contract)
    );

    // console.log("contractIds", contractIds);

    const matchingContracts: Array<string> = [];

    // Fetch bytecode for each contract and compare
    for (const contractId of contractIds) {
      const queryContractBytecode = `
        query Contract($contractId: ContractId!) {
          contract(id: $contractId) {
            bytecode
          }
        }
      `;

      const bytecodeData = await executeGraphQLQuery(
        network.graphqlUrl,
        queryContractBytecode,
        { contractId }
      );

      const contractBytecode = bytecodeData.data.contract.bytecode;
      let similarCount = 0;
      let dissimilarCount = 0;

      for (
        let i = 0;
        i < Math.min(contractBytecode.length, bytecode.length);
        i++
      ) {
        if (contractBytecode[i] === bytecode[i]) {
          similarCount++;
        } else {
          dissimilarCount++;
        }
      }

      dissimilarCount += Math.abs(contractBytecode.length - bytecode.length);

      const similarityPercentage =
        (similarCount / Math.max(contractBytecode.length, bytecode.length)) *
        100;

      if (similarityPercentage >= 99.98) {
        matchingContracts.push(contractId);
      }
    }

    const collections = await Promise.all(
      matchingContracts.map(async (contractId) => {
        return await Collection.fromContractIdAndWallet(contractId, owner);
      })
    );

    return collections;
  }
}