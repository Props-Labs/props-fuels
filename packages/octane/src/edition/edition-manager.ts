import { Provider, Wallet } from "fuels";
import { NFTMetadata, Edition as EditionType, EditionCreateConfigurationOptions } from "../common/types";
import { defaultEditionCreateConfigurationOptions } from "../common/defaults";
import EventEmitter from "events";
import { OctaneEvents } from "../core/events";

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
   * @param {string} name - The name of the edition to create.
   * @param {NFTMetadata} metadata - The metadata for the edition.
   * @param {EditionCreateConfigurationOptions} options - Additional configuration options for creating the edition.
   * @returns {Promise<string>} A promise that resolves to the ID of the created edition.
   */
  async create(
    name: string,
    metadata: NFTMetadata,
    options: EditionCreateConfigurationOptions
  ): Promise<string> {
    // Replace the following with the actual implementation to interact with the Fuel network
    this.emit(this.events.waiting, { name, metadata, options });
    console.log(
      `Creating edition: ${name} with options: ${JSON.stringify(options)}, metadata: ${JSON.stringify(metadata)}`
    );

    // const configurableConstants = Object.keys(options)
    //   .filter((key) =>
    //     SRC721EditionConfigurationConfigurables.includes(
    //       key as keyof SRC721EditionConfigurationOptions
    //     )
    //   )
    //   .reduce((obj, key) => {
    //     (obj as any)[key] =
    //       options[key as keyof SRC721EditionConfigurationOptions];
    //     return obj;
    //   }, {} as Partial<SRC721EditionConfigurationOptions>);

    // const contract = await SRC721EditionContractAbi__factory.deployContract(
    //   bytecode,
    //   wallet,
    //   {
    //     configurableConstants,
    //   }
    // );

    // const address = Address.fromDynamicInput(wallet.address);
    // const addressInput = { bits: address.toB256() };
    // const addressIdentityInput = { Address: addressInput };

    // await contract.functions
    //   .constructor(
    //     addressIdentityInput,
    //     options.name,
    //     options.symbol,
    //     Object.keys(options.metadata),
    //     Object.values(options.metadata).map((value) => {
    //       if (typeof value === "string") {
    //         return { String: value } as MetadataInput;
    //       } else if (typeof value === "number" || BN.isBN(value)) {
    //         return { Int: value } as MetadataInput;
    //       } else {
    //         throw new Error("Unsupported metadata value type");
    //       }
    //     }),
    //     options.price
    //   )
    //   .call();
    // return contract;

    this.emit(this.events.completed, { name, metadata, options, contract });
    console.log(`Edition created with contract address: ${contract.address}`);

    return "edition-id";
  }

  /**
   * Lists all available editions.
   * @returns {Promise<EditionType[]>} A promise that resolves to an array of edition objects.
   */
  async list(): Promise<EditionType[]> {
    // Replace the following with the actual implementation to interact with the Fuel network
    console.log("Listing all editions");
    return [];
  }

  /**
   * Gets the details of a specific edition.
   * @param {string} editionId - The ID of the edition to retrieve.
   * @returns {Promise<EditionType>} A promise that resolves to the edition object.
   */
  async get(editionId: string): Promise<EditionType> {
    // Replace the following with the actual implementation to interact with the Fuel network
    console.log(`Getting edition: ${editionId}`);
    return {} as EditionType;
  }

  /**
   * Mints a new token in a specific edition.
   * @param {string} editionId - The ID of the edition.
   * @param {string} recipient - The recipient address.
   * @returns {Promise<string>} A promise that resolves to the ID of the minted token.
   */
  async mint(editionId: string, recipient: string): Promise<string> {
    // Replace the following with the actual implementation to interact with the Fuel network
    console.log(
      `Minting token in edition: ${editionId} for recipient: ${recipient}`
    );
    return "token-id";
  }

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
