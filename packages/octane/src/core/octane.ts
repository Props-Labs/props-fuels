import { EditionManager } from "../edition";

/**
 * @class Octane
 * @classdesc Octane is the core class for the Octane SDK, providing essential functionalities to interact with the Fuel network.
 */
export class Octane {
  public edition: EditionManager;

  /**
   * Creates an instance of Octane.
   * @constructor
   * @param {string} apiKey - The API key to authenticate requests.
   * @param {string} network - The network to connect to (e.g., 'beta-5', 'mainnet').
   */
  constructor(private apiKey: string, private network: string) {
    /**
     * @property {string} apiKey - The API key to authenticate requests.
     * @private
     */
    this.apiKey = apiKey;

    /**
     * @property {string} network - The network to connect to.
     * @private
     */
    this.network = network;

    /**
     * @property {EditionManager} edition - The edition manager instance.
     * @public
     */
    this.edition = new EditionManager();
  }
}
