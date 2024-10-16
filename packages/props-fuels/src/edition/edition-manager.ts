import { Account, Address, BN, BytesLike, DateTime, TransactionStatus } from "fuels";
import { NFTMetadata, EditionCreateConfigurationOptions, Network, EditionCreateOptions } from "../common/types";
import { defaultEndDate, defaultNetwork, defaultStartDate } from "../common/defaults";
import { configurableOptionsTypeMapping, supportedProps721EditionContractConfigurableOptions, supportedProps721EditionContractConfigurableOptionsMapping } from "../common/constants";
import { Props721EditionContractFactory } from "../sway-api/contracts";
import type { MetadataInput } from "../sway-api/contracts/PropsRegistryContract";
import { executeGraphQLQuery } from "../core/fuels-api";
import { Edition } from "./edition";
import { randomBytes } from "fuels";
import { encodeMetadataValues } from "../utils/metadata";
import { PropsContractManager } from "../contract/contract-manager";
import { PropsRegistryContractFactory } from "../sway-api/contracts";
import { registryContractAddress } from "../common/defaults";
import { PropsRegistryContract } from "../sway-api";
import { Vec } from "../sway-api/contracts/common";

/**
 * @class EditionManager
 * @classdesc Manages editions within the Props SDK on the Fuel network.
 */
export class EditionManager extends PropsContractManager {
  /**
   * Creates a new instance of the EditionManager class.
   */
  constructor() {
    // Initialize the EditionManager class
    super();
  }

  /**
   * Creates a new edition.
   * @param {EditionCreateOptions} params - Additional configuration options for creating the edition.
   * @returns {Promise<string>} A promise that resolves to the ID of the created edition.
   */
  async create(params: EditionCreateOptions): Promise<Edition> {
    const { name, symbol, metadata, price, startDate, endDate, options } =
      params;
    // Replace the following with the actual implementation to interact with the Fuel network
    this.emit(this.events.transaction, {
      params: { name, symbol, metadata, options },
      message: "Awaiting transaction approval...",
      transactionIndex: 1,
      transactionCount: 2,
    });

    const { owner } = options;

    const configurableConstants = Object.keys(options)
      .filter((key) =>
        supportedProps721EditionContractConfigurableOptions.includes(key)
      )
      .reduce(
        (obj, key) => {
          const mappedKey =
            supportedProps721EditionContractConfigurableOptionsMapping[key];
          (obj as any)[mappedKey] = configurableOptionsTypeMapping[key](
            options[key as keyof EditionCreateConfigurationOptions]
          );
          return obj;
        },
        {} as Partial<Record<string, any>>
      );

    // console.log("configurableConstants", configurableConstants);

    const salt: BytesLike = randomBytes(32);
    const { waitForResult } =
      await Props721EditionContractFactory.deploy(
        owner,
        {
          configurableConstants,
          salt,
        }
      );

    this.emit(this.events.pending, {
      params: { name, symbol, metadata, options },
      message: "Waiting for transaction to clear...",
      transactionIndex: 1,
      transactionCount: 2,
    });

    const { contract } = await waitForResult();

    const address = Address.fromDynamicInput(owner.address);
    const addressInput = { bits: address.toB256() };
    const addressIdentityInput = { Address: addressInput };

    this.emit(this.events.transaction, {
      params: { name, symbol, metadata, options },
      message: "Awaiting transaction approval...",
      transactionIndex: 2,
      transactionCount: 2,
    });

    // console.log("metadata in sdk: ", metadata, encodeMetadataValues(metadata));

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
      await registryContract.functions
        .init_edition(
          { bits: contract.id.toB256() },
          addressIdentityInput,
          name,
          symbol,
          Object.keys(metadata),
          encodeMetadataValues(metadata) as Vec<MetadataInput>,
          price ?? 0,
          startDateTai,
          endDateTai
        )
        .addContracts([contract])
        .call();

    this.emit(this.events.pending, {
      params: { name, symbol, metadata, options },
      message: "Waiting for transaction to clear...",
      transactionIndex: 2,
      transactionCount: 2,
    });

    const { transactionResult } = await waitForResultConstructor();

    if (transactionResult?.status === TransactionStatus.success) {
      return new Edition(contract.id.toString(), contract, owner, metadata);
    } else {
      throw new Error(
        "Failed to create edition: Transaction was not successful"
      );
    }
  }

  async list(
    owner: Account,
    network: Network = defaultNetwork
  ): Promise<Array<Edition>> {
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

    const contractIds = transactionData.data.transactionsByOwner.nodes.flatMap(
      (node: any) =>
        node.outputs
          .filter((output: any) => output.__typename === "ContractCreated")
          .map((output: any) => output.contract)
    );

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
        Props721EditionContractFactory.bytecode.length
      );

      for (let i = 0; i < totalBytes; i++) {
        if (
          contractBytecodeArray[i] === Props721EditionContractFactory.bytecode[i]
        ) {
          similarCount++;
        }
      }

      const similarityPercentage = (similarCount / totalBytes) * 100;

      if (similarityPercentage >= 99.98) {
        matchingContracts.push(contractId);
      }
    }

    const editions = await Promise.all(
      matchingContracts.map(async (contractId) => {
        return await Edition.fromContractIdAndWallet(contractId, owner);
      })
    );

    return editions;
  }

  /**
   * Gets the details of a specific edition.
   * @param {string} editionId - The ID of the edition to retrieve.
   * @returns {Promise<EditionType>} A promise that resolves to the edition object.
   */
  async get(
    editionId: string,
    owner: Account
  ): Promise<Edition> {
    const edition = await Edition.fromContractIdAndWallet(
      editionId,
      owner,
      false
    );
    return edition;
  }

  // /**
  //  * Mints a new token in a specific edition.
  //  * @param {string} editionId - The ID of the edition.
  //  * @param {string} recipient - The recipient address.
  //  * @returns {Promise<Edition>} A promise that resolves to the ID of the minted token.
  //  */
  // async mint(editionId: string, recipient: string): Promise<string> {
  //   // Replace the following with the actual implementation to interact with the Fuel network
  //   console.log(
  //     `Minting token in edition: ${editionId} for recipient: ${recipient}`
  //   );
  //   return "token-id";
  // }

  /**
   * Updates the metadata of a specific edition.
   * @param {string} editionId - The ID of the edition.
   * @param {NFTMetadata} metadata - The new metadata for the edition.
   * @returns {Promise<void>} A promise that resolves when the metadata has been updated.
   */
  async updateMetadata(
    editionId: string,
    metadata: NFTMetadata
  ): Promise<void> {
    // Replace the following with the actual implementation to interact with the Fuel network
    console.log(`Updating metadata for edition: ${editionId}`);
  }
}