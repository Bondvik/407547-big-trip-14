import Observer from '../utils/observer.js';

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(events) {
    this._events = events.slice();
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, updatePoint) {
    const index = this._events.findIndex((event) => event.id === updatePoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    this._events.splice(index, 1, updatePoint);

    this._notify(updateType, updatePoint);
  }

  addEvent(updateType, updatePoint) {
    this._events.unshift(updatePoint);

    this._notify(updateType, updatePoint);
  }

  deleteEvent(updateType, updatePoint) {
    const index = this._events.findIndex((event) => event.id === updatePoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    this._events.splice(index, 1);

    this._notify(updateType);
  }
}
