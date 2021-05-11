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

  updateEvent(updatedType, updatedPoint) {
    const index = this._events.findIndex(({id}) => id === updatedPoint.id);

    if (index === -1) {
      // eslint-disable-next-line quotes
      throw new Error(`Can't update unexisting event`);
    }

    this._events.splice(index, 1, updatedPoint);

    this._notify(updatedType, updatedPoint);
  }

  addEvent(updatedType, updatedPoint) {
    this._events.unshift(updatedPoint);

    this._notify(updatedType, updatedPoint);
  }

  deleteEvent(updatedType, updatedPoint) {
    const index = this._events.findIndex(({id}) => id === updatedPoint.id);

    if (index === -1) {
      // eslint-disable-next-line quotes
      throw new Error(`Can't delete unexisting event`);
    }

    this._events.splice(index, 1);

    this._notify(updatedType);
  }
}
