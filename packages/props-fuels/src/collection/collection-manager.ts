import { Account, Address, DateTime, BytesLike, TransactionStatus } from "fuels";
import { CollectionCreateConfigurationOptions, Network, CollectionCreateOptions } from "../common/types";
import { defaultEndDate, defaultNetwork, defaultStartDate, registryContractAddress } from "../common/defaults";
import { configurableOptionsTypeMapping, supportedProps721CollectionContractConfigurableOptions, supportedProps721CollectionContractConfigurableOptionsMapping } from "../common/constants";
import {
  Props721CollectionContractFactory,
  PropsRegistryContract,
} from "../sway-api/contracts";
import { executeGraphQLQuery } from "../core/fuels-api";
import { Collection } from "../collection/collection";
import { randomBytes } from "fuels";
import { PropsContractManager } from "../contract/contract-manager";

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

    console.log("configurableConstants", configurableConstants);

    const salt: BytesLike = randomBytes(32);
    const { waitForResult } =
      await Props721CollectionContractFactory.deploy(
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

    const registryContract = new PropsRegistryContract(
      registryContractAddress,
      owner
    );

    const { waitForResult: waitForResultConstructor } =
      await registryContract.functions.init_collection(
          { bits: contract.id.toB256() },
          addressIdentityInput,
          name,
          symbol,
          baseUri,
          price ?? 0,
          startDateTai,
          endDateTai
        )
        .addContracts([contract])
        .call();

    this.emit(this.events.pending, {
      params: { name, symbol, baseUri, options },
      message: "Waiting for transaction to clear...",
      transactionIndex: 2,
      transactionCount: 2,
    });

    const { transactionResult } = await waitForResultConstructor();

    if (transactionResult?.status === TransactionStatus.success) {
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

      // Convert contractBytecode hex string to Uint8Array
      const contractBytecodeArray = new Uint8Array(
        contractBytecode.slice(2).match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16))
      );

      let similarCount = 0;
      let totalBytes = Math.max(
        contractBytecodeArray.length,
        Props721CollectionContractFactory.bytecode.length
      );

      for (let i = 0; i < totalBytes; i++) {
        if (
          contractBytecodeArray[i] === Props721CollectionContractFactory.bytecode[i]
        ) {
          similarCount++;
        }
      }

      const similarityPercentage = (similarCount / totalBytes) * 100;

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

  /**
   * Gets the details of a specific collection.
   * @param {string} collectionId - The ID of the collection to retrieve.
   * @param {Account} owner - The account that owns the collection.
   * @returns {Promise<Collection>} A promise that resolves to the collection object.
   */
  async get(
    collectionId: string,
    owner: Account
  ): Promise<Collection> {
    const collection = await Collection.fromContractIdAndWallet(
      collectionId,
      owner
    );
    return collection;
  }
}