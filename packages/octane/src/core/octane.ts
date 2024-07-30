import { EditionManager } from "../edition";
import { supportedNetworks } from "../common/constants";
import { Network, OctaneConfigurationOptions } from "../common/types";
import { OctaneEvents } from "./events";

/**
 * @class Octane
 * @classdesc Octane is the core class for the Octane SDK, providing essential functionalities to interact with the Fuel network.
 */
export class Octane {
  public editions: EditionManager;
  public events: OctaneEvents;
  private network: Network;
  private apiKey: string;

  /**
   * Creates an instance of Octane.
   * @constructor
   * @param {OctaneConfigurationOptions} options - The configuration options for Octane.
   * @param {string} options.apiKey - The API key to authenticate requests. If no apiKey is supplied, a default rate-limited key will be used.
   * @param {string} options.network - The network to connect to (e.g., 'beta-5', 'mainnet').
   */
  constructor(options: OctaneConfigurationOptions) {
    /**
     * @property {string} apiKey - The API key to authenticate requests. If no apiKey is supplied, a default rate-limited key will be used.
     * @private
     */
    this.apiKey = options.apiKey || 'default-rate-limited-key'; //TODO validate api key

    /**
     * @property {string} network - The network to connect to.
     * @private
     */
    const supportedNetwork = supportedNetworks.find(
      (net) => net.id === options.network
    );
    if (!supportedNetwork) {
      const supportedNetworkIds = supportedNetworks.map(net => net.id).join(', ');
      throw new Error(`Network ${options.network} is not supported. It must be one of: ${supportedNetworkIds}.`);
    }
    this.network = supportedNetwork;

    /**
     * @property {EditionManager} edition - The edition manager instance.
     * @public
     */
    this.editions = new EditionManager();

    /**
     * @property {OctaneEvents}
     * @public
     * @description The event manager instance.
     */
     this.events = OctaneEvents.getInstance();
  }

  /**
   * Returns the network configuration.
   * @returns {Network} The network configuration.
   */
  getNetwork(): Network {
    return this.network;
  }

  /**
   * Checks the health of the currently connected Fuel network API.
   * @returns {Promise<any>} A promise that resolves to the health status of the network.
   * @throws {Error} If the GraphQL URL is not available for the current network.
   */
  async getHealth(): Promise<any> {
    if (!this.network.graphqlUrl) {
      throw new Error('GraphQL URL is not available for this network');
    }
    const response = await fetch(this.network.graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query: '{ health }' }),
    });
    const data = await response.json();
    return data;
  }
}
