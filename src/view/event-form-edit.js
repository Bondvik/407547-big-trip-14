import dayjs from 'dayjs';
import {eventTypes, cities, getEventDestination, getEventPhotos, createEventOffers} from '../mock/event.js';
import SmartView from './smart.js';

export default class EventFormEdit extends SmartView {
  constructor(event) {
    super();
    this._data = EventFormEdit.parseEventToData(event);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formClickHandler = this._formClickHandler.bind(this);
    this._typeClickHandler = this._typeClickHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._setInnerHandlers();
  }

  _getEventOfferSelector() {
    const offers = this._data.eventOffers.map((item) => item);
    return offers.reduce((accumulator, item) => accumulator + this._getEventOfferView(item), '');
  }

  _getEventOfferView(item) {
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${item.eventOfferType}-1" type="checkbox" name="event-offer-${item.type}">
        <label class="event__offer-label" for="event-offer-${item.eventOfferType}-1">
          <span class="event__offer-title">${item.eventOfferName}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${item.evantOfferPrice}</span>
        </label>
      </div>`
    );
  }

  _getPhotos() {
    const eventListPhotos = this._data.eventPhotos.reduce((accumulator, item) => accumulator + `<img class="event__photo" src="${item}" alt="Event photo">`, '');
    if (!eventListPhotos.length) {
      return '';
    }
    return (
      `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${eventListPhotos}
        </div>
      </div>`
    );
  }

  _getTypes() {
    const eventsType = eventTypes.reduce((accumulator, item) => accumulator +
    `<div class="event__type-item">
      <input id="event-type-${item.type}-${this._data.id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item.type}">
      <label class="event__type-label  event__type-label--${item.type}" for="event-type-${item.type}-${this._data.id}" data-type=${item.type}>${item.name}</label>
    </div>`, '');
    return eventsType;
  }

  _getCities() {
    const selectedCities = cities.reduce((accumulator, item) => accumulator + `<option value=${item}></option>`, '');
    return selectedCities;
  }

  getTemplate() {
    return (
      `<li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-1">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${this._data.eventType.icon}" alt="Event type icon">
              </label>
              <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

              <div class="event__type-list">
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Event type</legend>
                  ${this._getTypes()}
                </fieldset>
              </div>
            </div>

            <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-1">
                ${this._data.eventType.name}
              </label>
              <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._data.eventCity}" list="destination-list-1">
              <datalist id="destination-list-1">
                ${this._getCities()}
              </datalist>
            </div>

            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(this._data.eventStartTime).format('DD/MM/YY HH:mm')}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(this._data.eventEndTime).format('DD/MM/YY HH:mm')}">
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._data.eventTotal}">
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
              <p class="event__destination-description">${this._data.eventDestination}</p>
              ${this._getPhotos()}
            </section>
          </section>
        </form>
      </li>`
    );
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EventFormEdit.parseDataToEvent(this._data));
  }

  _formClickHandler(evt) {
    evt.preventDefault();
    this._callback.formClick(this._data);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setFormClicktHandler(callback) {
    this._callback.formClick = callback;
    this.getElement().querySelector('form .event__rollup-btn').addEventListener('click', this._formClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormClicktHandler(this._callback.formClickHandler);
    this.setFormSubmitHandler(this._callback.formSubmitHandler);
  }

  _setInnerHandlers() {
    const selectTypes = this.getElement().querySelectorAll('.event__type-label');
    const changeDestination = this.getElement().querySelector('.event__input--destination');
    changeDestination.addEventListener('change', this._destinationChangeHandler);
    selectTypes.forEach((item) => item.addEventListener('click', this._typeClickHandler));
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      eventDestination: getEventDestination(),
      eventCity: evt.target.value,
      eventPhotos: getEventPhotos(),
    });
  }

  //превращение данных - в состояние
  //на основе данных об event создаём новый объект
  static parseEventToData(event) {
    return Object.assign(
      {},
      event,
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign(
      {},
      data,
    );
    return data;
  }

  _typeClickHandler(evt) {
    const eventType = evt.target.dataset.type;
    const type = eventTypes.find((item) => item.type === eventType);
    evt.preventDefault();
    this.updateData({
      eventType: type,
      eventOffers: createEventOffers(),
    });
  }

  reset(event) {
    this.updateData(EventFormEdit.parseEventToData(event));
  }
}
