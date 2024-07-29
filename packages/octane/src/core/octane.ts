import { EditionManager } from "../edition";
import { supportedNetworks } from "../common/constants";
import { Network } from "../common/types";

/**
 * @class Octane
 * @classdesc Octane is the core class for the Octane SDK, providing essential functionalities to interact with the Fuel network.
 */
export class Octane {
  public edition: EditionManager;
  private network: Network;

  /**
   * Creates an instance of Octane.
   * @constructor
   * @param {string} apiKey - The API key to authenticate requests.
   * @param {string} network - The network to connect to (e.g., 'beta-5', 'mainnet').
   */
  constructor(private apiKey: string, _network: string) {
    /**
     * @property {string} apiKey - The API key to authenticate requests.
     * @private
     */
    this.apiKey = apiKey; //TODO validate api key

    /**
     * @property {string} network - The network to connect to.
     * @private
     */
    const supportedNetwork = supportedNetworks.find(
      (net) => net.id === _network
    );
    if (!supportedNetwork) {
      throw new Error(`Network ${_network} is not supported.`);
    }
    this.network = supportedNetwork;

    /**
     * @property {EditionManager} edition - The edition manager instance.
     * @public
     */
    this.edition = new EditionManager();
  }
}
