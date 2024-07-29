/**
 * @class OctaneEvents
 * @classdesc Singleton class to manage event states within the application.
 */
class OctaneEvents {
  /**
   * The single instance of the OctaneEvents class.
   * @private
   * @static
   * @type {OctaneEvents}
   */
  private static instance: OctaneEvents;

  /**
   * Event state indicating a waiting status.
   * @type {string}
   * @public
   */
  public waiting: string = 'waiting';

  /**
   * Event state indicating a completed status.
   * @type {string}
   * @public
   */
  public completed: string = 'completed';

  /**
   * Event state indicating an error status.
   * @type {string}
   * @public
   */
  public error: string = 'error';

  /**
   * Event state indicating an initialized status.
   * @type {string}
   * @public
   */
  public initialized: string = 'initialized';

  /**
   * Event state indicating a paused status.
   * @type {string}
   * @public
   */
  public paused: string = 'paused';

  /**
   * Event state indicating an unpaused status.
   * @type {string}
   * @public
   */
  public unpaused: string = 'unpaused';

  /**
   * Private constructor to prevent direct instantiation.
   * @private
   */
  private constructor() {
    // Private constructor to prevent instantiation
  }

  /**
   * Retrieves the single instance of the OctaneEvents class.
   * @returns {OctaneEvents} The singleton instance of the OctaneEvents class.
   * @public
   * @static
   */
  public static getInstance(): OctaneEvents {
    if (!OctaneEvents.instance) {
      OctaneEvents.instance = new OctaneEvents();
    }
    return OctaneEvents.instance;
  }
}