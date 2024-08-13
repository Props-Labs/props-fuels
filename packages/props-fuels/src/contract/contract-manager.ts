import { PropsEventEmitter, PropsEvents } from "../core/events";

/**
 * Class representing a Props Contract Manager.
 * @extends {PropsEventEmitter}
 */
export class PropsContractManager extends PropsEventEmitter {
  public events: PropsEvents;
  /**
   * Creates an instance of PropsContractManager.
   */
  constructor() {
    super();
    /**
     * @property {PropsEvents} events - The event manager instance.
     * @public
     */
    this.events = PropsEvents.getInstance();
  }
}
