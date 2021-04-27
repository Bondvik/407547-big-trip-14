import dayjs from 'dayjs';
import {eventProposition, eventTypes} from '../mock/event.js';
import AbstractView from './abstract.js';

export default class EventFormEdit extends AbstractView {
  constructor(event) {
    super();
    this._event = event;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formClickHandler = this._formClickHandler.bind(this);
  }

  _getEventOfferSelector() {
    const offers = this._event.eventOffers.map(({eventOfferName}) => eventOfferName);
    return eventProposition.reduce((accumulator, item) => accumulator + this._getEventOfferView(offers, item), '');
  }

  _getEventOfferView(offers, item) {
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${item.type}-1" type="checkbox" name="event-offer-${item.type}" ${(offers.includes(item.name)) ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-luggage-1">
          <span class="event__offer-title">${item.name}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${item.price}</span>
        </label>
      </div>`
    );
  }

  _getPhotos() {
    const eventListPhotos = this._event.eventPhotos.reduce((accumulator, item) => accumulator + `<img class="event__photo" src="${item}" alt="Event photo">`, '');
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
  }

  getTemplate() {
    return (
      `<li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-1">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${this._event.eventType.icon}" alt="Event type icon">
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
                ${this._event.eventType.name}
              </label>
              <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._event.eventCity}" list="destination-list-1">
              <datalist id="destination-list-1">
                <option value="Amsterdam"></option>
                <option value="Geneva"></option>
                <option value="Chamonix"></option>
              </datalist>
            </div>

            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(this._event.eventStartTime).format('DD/MM/YY HH:mm')}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(this._event.eventEndTime).format('DD/MM/YY HH:mm')}">
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._event.eventTotal}">
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
                ${this._getEventOfferSelector()}
              </div>
            </section>

            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${this._event.eventDestination}</p>
              ${this._getPhotos()}
            </section>
          </section>
        </form>
      </li>`
    );
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._event);
  }

  _formClickHandler(evt) {
    evt.preventDefault();
    this._callback.formClick();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setFormClicktHandler(callback) {
    this._callback.formClick = callback;
    this.getElement().querySelector('form .event__rollup-btn').addEventListener('click', this._formClickHandler);
  }
}
