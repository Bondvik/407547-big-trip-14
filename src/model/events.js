import Observer from '../utils/observer.js';
import {getEventDuration} from '../utils/event.js';

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updatedType, events) {
    this._events = events.slice();
    this._notify(updatedType);
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

  static adaptToClient(event) {
    const {base_price, date_from, date_to, destination, id, is_favorite, offers, type} = event;
    const eventStartTime = date_from === null ? null : new Date(date_from);
    const eventEndTime = date_to === null ? null : new Date(date_to);
    offers.forEach((item) => item.isChecked = true);
    const adaptedEvent = Object.assign(
      {},
      {
        id: id,
        eventType: type,
        eventCity: destination.name,
        eventOffers: offers,
        eventDestination: destination.description,
        eventPhotos: destination.pictures,
        eventStartTime,
        eventEndTime,
        eventDuration: getEventDuration(eventStartTime, eventEndTime),
        eventTotal: base_price,
        isFavorite: is_favorite,
      },
    );
    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedEvent = Object.assign(
      {},
      {
        'base_price': event.eventTotal,
        'date_from': event.eventStartTime instanceof Date ? event.eventStartTime.toISOString() : null, // На сервере дата хранится в ISO формате
        'date_to': event.eventEndTime instanceof Date ? event.eventEndTime.toISOString() : null,
        'destination': {
          'description': event.eventDestination ? event.eventDestination : '',
          'pictures': event.eventPhotos ? event.eventPhotos : [],
          'name': event.eventCity ? event.eventCity : '',
        },
        'id': event.id,
        'is_favorite': event.isFavorite ? event.isFavorite : false,
        'offers': event.eventOffers ? event.eventOffers : [],
        'type': event.eventType ? event.eventType : 'bus',
      },
    );

    return adaptedEvent;
  }
}
