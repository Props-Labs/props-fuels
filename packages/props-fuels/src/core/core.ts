import { EditionManager } from "../edition";
import { supportedNetworks } from "../common/constants";
import { Network, PropsConfigurationOptions } from "../common/types";
import { PropsEvents } from "./events";
import { CollectionManager } from "../collection";
import { PropsUtilities } from "../utils";

/**
 * @class Props
 * @classdesc Props is the core class for the Props SDK, providing essential functionalities to interact with the Fuel network.
 */
export class PropsSDK {
  public editions: EditionManager;
  public collections: CollectionManager;
  public events: PropsEvents;
  public utils: PropsUtilities;
  private network: Network;
  private apiKey: string;

  /**
   * Creates an instance of Props SDK.
   * @constructor
   * @param {PropsConfigurationOptions} options - The configuration options for Props SDK.
   */
  constructor(options: PropsConfigurationOptions) {
    /**
     * @property {string} apiKey - The API key to authenticate requests. If no apiKey is supplied, a default rate-limited key will be used.
     * @private
     */
    this.apiKey = options.apiKey || "default-rate-limited-key"; //TODO validate api key

    /**
     * @property {string} network - The network to connect to.
     * @private
     */
    const supportedNetwork = supportedNetworks.find(
      (net) => net.id === options.network
    );
    if (!supportedNetwork) {
      const supportedNetworkIds = supportedNetworks
        .map((net) => net.id)
        .join(", ");
      throw new Error(
        `Network ${options.network} is not supported. It must be one of: ${supportedNetworkIds}.`
      );
    }
    this.network = supportedNetwork;

    /**
     * @property {EditionManager} edition - The edition manager instance.
     * @public
     */
    this.editions = new EditionManager();

    /**
     * @property {CollectionManager} collections - The collection manager instance.
     * @public
     */
    this.collections = new CollectionManager();

    /**
     * @property {PropsEvents}
     * @public
     * @description The event manager instance.
     */
    this.events = PropsEvents.getInstance();

    /**
     * @property {PropsUtilities} utils - The utilities instance.
     * @public
     */
    this.utils = new PropsUtilities();
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
      throw new Error("GraphQL URL is not available for this network");
    }
    const response = await fetch(this.network.graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query: "{ health }" }),
    });
    const data = await response.json();
    return data;
  }
}
