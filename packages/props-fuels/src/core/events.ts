/**
 * @class PropsEvents
 * @classdesc Singleton class to manage event states within the application.
 */
export class PropsEvents {
  /**
   * The single instance of the PropsEvents class.
   * @private
   * @static
   * @type {PropsEvents}
   */
  private static instance: PropsEvents;

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
   * Retrieves the single instance of the PropsEvents class.
   * @returns {PropsEvents} The singleton instance of the PropsEvents class.
   * @public
   * @static
   */
  public static getInstance(): PropsEvents {
    if (!PropsEvents.instance) {
      PropsEvents.instance = new PropsEvents();
    }
    return PropsEvents.instance;
  }
}

export class PropsEventEmitter {
  private _eventListeners: { [key: string]: Array<(...args: any[]) => void> } =
    {};

  on(event: string, listener: (...args: any[]) => void) {
    if (!this._eventListeners[event]) {
      this._eventListeners[event] = [];
    }
    this._eventListeners[event].push(listener);
  }

  emit(event: string, ...args: any[]) {
    if (this._eventListeners[event]) {
      this._eventListeners[event].forEach((listener) => listener(...args));
    }
  }
}