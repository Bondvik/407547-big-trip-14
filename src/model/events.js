import Observer from '../utils/observer.js';
import {getEventDuration} from '../utils/event.js';

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updatedType, events) {
    this._events = events.slice();
    this.notify(updatedType);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updatedType, updatedPoint) {
    const index = this._events.findIndex(({id}) => id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    this._events.splice(index, 1, updatedPoint);

    this.notify(updatedType, updatedPoint);
  }

  addEvent(updatedType, updatedPoint) {
    this._events.unshift(updatedPoint);

    this.notify(updatedType, updatedPoint);
  }

  deleteEvent(updatedType, updatedPoint) {
    const index = this._events.findIndex(({id}) => id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    this._events.splice(index, 1);

    this.notify(updatedType);
  }

  static adaptToClient(event) {
    const {
      base_price: basePrice,
      date_from: dateFrom,
      date_to: dateTo,
      is_favorite: isFavorite,
      destination,
      id,
      offers,
      type,
    } = event;
    const {name, description, pictures} = destination;
    const eventStartTime = dateFrom === null ? null : new Date(dateFrom);
    const eventEndTime = dateTo === null ? null : new Date(dateTo);
    offers.forEach((item) => item.isChecked = true);
    const adaptedEvent = Object.assign(
      {},
      {
        id,
        eventType: type,
        eventCity: name,
        eventOffers: offers,
        eventDestination: description,
        eventPhotos: pictures,
        eventDuration: getEventDuration(eventStartTime, eventEndTime),
        eventTotal: basePrice,
        eventStartTime,
        eventEndTime,
        isFavorite,
      },
    );
    return adaptedEvent;
  }

  static adaptToServer(event) {
    const {
      eventTotal,
      eventStartTime,
      eventEndTime,
      eventDestination,
      eventPhotos,
      eventCity,
      id,
      isFavorite,
      eventOffers,
      eventType,
    } = event;
    const adaptedEvent = Object.assign(
      {},
      {
        'base_price': eventTotal,
        'date_from': eventStartTime instanceof Date ? eventStartTime.toISOString() : null, // ???? ?????????????? ???????? ???????????????? ?? ISO ??????????????
        'date_to': eventEndTime instanceof Date ? eventEndTime.toISOString() : null,
        'destination': {
          'description': eventDestination ? eventDestination : '',
          'pictures': eventPhotos ? eventPhotos : [],
          'name': eventCity ? eventCity : '',
        },
        'id': id,
        'is_favorite': isFavorite ? isFavorite : false,
        'offers': eventOffers ? eventOffers : [],
        'type': eventType ? eventType : 'bus',
      },
    );

    return adaptedEvent;
  }
}
