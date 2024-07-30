import { Account, Address, BN, BytesLike, ContractIdLike } from "fuels";
import crypto from "crypto";
import { NFTMetadata, Edition as EditionType, EditionCreateConfigurationOptions, Network } from "../common/types";
import EventEmitter from "events";
import { OctaneEvents } from "../core/events";
import { defaultNetwork, supportedOctane721EditionContractConfigurableOptions, supportedOctane721EditionContractConfigurableOptionsMapping } from "../common/defaults";
import { Octane721EditionContractAbi__factory } from "../sway-api/contracts";
import bytecode from "../sway-api/contracts/Octane721EditionContractAbi.hex";
import type { MetadataInput } from "../sway-api/contracts/Octane721EditionContractAbi";
import { executeGraphQLQuery } from "../core/fuels-api";
import { Edition } from "./edition";

/**
 * @class EditionManager
 * @classdesc Manages editions within the Octane SDK on the Fuel network.
 */
export class EditionManager extends EventEmitter {
  private events: OctaneEvents;

  /**
   * Creates a new instance of the EditionManager class.
   */
  constructor() {
    // Initialize the EditionManager class
    super();
    this.events = OctaneEvents.getInstance();
  }

  /**
   * Creates a new edition.
   * @param {string} name - The name of the edition to create. This is the name of the contract and cannot be changed.
   * @param {string} symbol - The short form of the contract name.
   * @param {NFTMetadata} metadata - The metadata for the edition.
   * @param {EditionCreateConfigurationOptions} options - Additional configuration options for creating the edition.
   * @returns {Promise<string>} A promise that resolves to the ID of the created edition.
   */
  async create(
    name: string,
    symbol: string,
    metadata: NFTMetadata,
    options: EditionCreateConfigurationOptions
  ): Promise<Edition> {
    // Replace the following with the actual implementation to interact with the Fuel network
    this.emit(this.events.waiting, { name, symbol, metadata, options });

    const { account } = options;

    const configurableConstants = Object.keys(options)
      .filter((key) =>
        supportedOctane721EditionContractConfigurableOptions.includes(key)
      )
      .reduce(
        (obj, key) => {
          const mappedKey =
            supportedOctane721EditionContractConfigurableOptionsMapping[key];
          (obj as any)[mappedKey] =
            options[key as keyof EditionCreateConfigurationOptions];
          return obj;
        },
        {} as Partial<Record<string, any>>
      );

    const salt: BytesLike = crypto.randomBytes(32);
    const contract = await Octane721EditionContractAbi__factory.deployContract(
      bytecode,
      account,
      {
        configurableConstants,
        salt,
      }
    );

    const address = Address.fromDynamicInput(account.address);
    const addressInput = { bits: address.toB256() };
    const addressIdentityInput = { Address: addressInput };

    await contract.functions
      .constructor(
        addressIdentityInput,
        name,
        symbol,
        Object.keys(metadata),
        Object.values(metadata).map((value) => {
          if (typeof value === "string") {
            return { String: value } as MetadataInput;
          } else if (typeof value === "number" || BN.isBN(value)) {
            return { Int: value } as MetadataInput;
          } else {
            throw new Error("Unsupported metadata value type");
          }
        }),
        0 // @dev TODO implement pricing and better function call optiolns
      )
      .call();

    return new Edition(contract.id.toString(), contract, account);
  }

  async list(
    owner: string,
    network: Network = defaultNetwork
  ): Promise<Array<string>> {
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

    const variables = { address: owner };

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
      let similarCount = 0;
      let dissimilarCount = 0;

      for (let i = 0; i < Math.min(contractBytecode.length, bytecode.length); i++) {
        if (contractBytecode[i] === bytecode[i]) {
          similarCount++;
        } else {
          dissimilarCount++;
        }
      }

      dissimilarCount += Math.abs(contractBytecode.length - bytecode.length);

      const similarityPercentage = (similarCount / Math.max(contractBytecode.length, bytecode.length)) * 100;

      if (similarityPercentage >= 99.98) {
        matchingContracts.push(contractId);
      }
    }

    return matchingContracts;
  }

  // /**
  //  * Gets the details of a specific edition.
  //  * @param {string} editionId - The ID of the edition to retrieve.
  //  * @returns {Promise<EditionType>} A promise that resolves to the edition object.
  //  */
  // async get(editionId: string): Promise<Edition> {
  //   // TODO
  // }
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
