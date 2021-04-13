import dayjs from 'dayjs';
import {eventProposition, eventTypes} from '../mock/event.js';

const createEventFormEditTemplate = (event = {}) => {
  const {
    eventType = eventType[1],
    eventOffers = [],
    eventDestination = '',
    eventPhotos = [],
    eventStartTime = dayjs(),
    eventEndTime = dayjs(eventStartTime).add(1, 'hour'),
    eventTotal = null,
  } = event;
  const createEventOfferSelector = () => {
    const offers = eventOffers.map(({eventOfferName}) => eventOfferName);
    return eventProposition.reduce((accumulator, item) => accumulator + getEventOfferView(offers, item), '');
  };
  const getEventOfferView = (offers, item) => (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${item.type}-1" type="checkbox" name="event-offer-${item.type}" ${(offers.includes(item.name)) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-luggage-1">
        <span class="event__offer-title">${item.name}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${item.price}</span>
      </label>
    </div>`
  );
  const getPhotos = () => {
    const eventListPhotos = eventPhotos.reduce((accumulator, item) => accumulator + `<img class="event__photo" src="${item}" alt="Event photo">`, '');
    if (eventListPhotos.lenght) {
      return (
        `<div class="event__photos-container">
          <div class="event__photos-tape">
            ${eventListPhotos}
          </div>
        </div>`
      );
    }
    return '';
  };
  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType.icon}" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                <div class="event__type-item">
                  <input id="event-type-${eventTypes.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventTypes.type}">
                  <label class="event__type-label  event__type-label--${eventTypes.type}" for="event-type-taxi-1">${eventTypes.name}</label>
                </div>
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${eventType.name}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${event.eventCity}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(eventStartTime).format('DD/MM/YY HH:mm')}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(eventEndTime).format('DD/MM/YY HH:mm')}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${eventTotal}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${createEventOfferSelector()}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${eventDestination}</p>
            ${getPhotos()}
          </section>
        </section>
      </form>
    </li>`
  );
};

export {createEventFormEditTemplate};
