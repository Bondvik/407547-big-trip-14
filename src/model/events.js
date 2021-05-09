import Observer from '../utils/observer.js';
import {getEventDuration} from '../utils/event.js';

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();
    this._notify(updateType);
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

  static adaptToClient(event) {
    const eventStartTime =event.date_from !== null ? new Date(event.date_from) : event.date_from;
    const eventEndTime = event.date_to !== null ? new Date(event.date_to) : event.date_to;
    const adaptedEvent = Object.assign(
      {},
      {
        id: event.id,
        eventType: event.type,
        eventCity: event.destination.name,
        eventOffers: event.offers,
        eventDestination: event.destination.description,
        eventPhotos: event.destination.pictures,
        eventStartTime,
        eventEndTime,
        eventDuration: getEventDuration(eventStartTime, eventEndTime),
        eventTotal: event.base_price,
        isFavorite: event.is_favorite,
      },
    );
    //console.log(adaptedEvent)
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
