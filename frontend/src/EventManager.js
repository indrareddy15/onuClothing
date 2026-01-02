// eventManager.js
import { EventEmitter } from 'events';

class EventManager extends EventEmitter {
  constructor() {
    super();
  }
}

const eventManager = new EventManager();
export default eventManager;
