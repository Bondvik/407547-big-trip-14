import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import he from 'he';
import {getCityDescription, getCities, getOffer, getOffers, getCloneData} from '../utils/event.js';
import {Mode, DEFAULT_EVENT} from '../const.js';
import SmartView from './smart.js';
import 'flatpickr/dist/flatpickr.min.css';

export default class EventForm extends SmartView {
  constructor(event = DEFAULT_EVENT, mode = Mode.EDITING) {
    super();
    this._offers = null;
    this._cloneData = null;
    this._mode = mode;
    this._data = EventForm.parseEventToData(event);

    this._datepicker = null;
    this._startDatePicker = null;
    this._endDatePicker = null;
    this._datePickerConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      'time_24hr': true,
    };

    //клонируем объект (для возврата карточки точки маршрута в состояние до изменений)
    this._cloneData = getCloneData(this._data);

    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formClickHandler = this._formClickHandler.bind(this);
    this._typeClickHandler = this._typeClickHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);

    this._startTimeChangeHandler = this._startTimeChangeHandler.bind(this);
    this._endTimeChangeHandler = this._endTimeChangeHandler.bind(this);
    this._offerClickHandler = this._offerClickHandler.bind(this);

    this._setInnerHandlers();
    this._setStartTime();
    this._setEndTime();
  }

  get _eventOfferSelector() {
    const offers = getOffer(this._data.eventType);
    this._offers = offers.slice();
    return offers[0].offers.reduce((accumulator, item) => accumulator + this._getEventOfferView(item), '');
  }

  get _photos() {
    const eventListPhotos = this._data.eventPhotos.reduce((accumulator, item) => (
      `${accumulator}<img class="event__photo" src="${item.src}" alt="${item.description}">`
    ), '');

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

  get _types() {
    return getOffers().reduce((accumulator, item) =>
      `${accumulator}
      <div class="event__type-item">
        <input
          id="event-type-${item}-${this._data.id}"
          class="event__type-input  visually-hidden"
          type="radio" name="event-type"
          value="${item}"
          ${this._data.isDisabled ? 'disabled' : ''}>
        <label
          class="event__type-label  event__type-label--${item}"
          for="event-type-${item}-${this._data.id}"
          data-type=${item}>${item}
        </label>
      </div>`, '');
  }

  _cities() {
    return getCities().reduce((accumulator, item) => `${accumulator}<option value=${item}></option>`, '');
  }

  _getEventOfferView({title, price, isDisabled}) {
    let isChecked = false;
    if (this._data.eventOffers.find((offer) => offer.title === title)) {
      isChecked = true;
    }
    return (
      `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="event-offer-${title}-1"
          data-offer-name="${title}"
          type="checkbox" name="event-offer-${title}"
          ${isChecked ? 'checked' : ''}
          ${isDisabled ? 'disabled' : ''}>
        <label
          class="event__offer-label"
          for="event-offer-${title}-1">
            <span class="event__offer-title">${title}</span>
              &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  }

  _createRollUpButtonTemplate(mode) {
    return mode === Mode.EDITING ? `<button class="event__rollup-btn" type="button">
                                  <span class="visually-hidden">Open event</span>
                                 </button>`: '';
  }

  getTemplate() {
    return (
      `<li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-1">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${this._data.eventType}.png" alt="Event type icon">
              </label>
              <input
                class="event__type-toggle  visually-hidden"
                id="event-type-toggle-1"
                type="checkbox"
                ${this._data.isDisabled ? 'disabled' : ''}
              />

              <div class="event__type-list">
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Event type</legend>
                  ${this._types}
                </fieldset>
              </div>
            </div>

            <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-1">
                ${this._data.eventType}
              </label>
              <input
                class="event__input  event__input--destination"
                id="event-destination-1" type="text"
                name="event-destination"
                value="${he.encode(this._data.eventCity)}"
                list="destination-list-1"
                ${this._data.isDisabled ? 'disabled' : ''}
              />
              <datalist id="destination-list-1">
                ${this._cities()}
              </datalist>
            </div>

            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input
                class="event__input  event__input--time"
                id="event-start-time-1"
                type="text"
                name="event-start-time"
                value="${dayjs(this._data.eventStartTime).format('DD/MM/YY HH:mm')}"
                ${this._data.isDisabled ? 'disabled' : ''}
              />
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input
                class="event__input  event__input--time"
                id="event-end-time-1"
                type="text"
                name="event-end-time"
                value="${dayjs(this._data.eventEndTime).format('DD/MM/YY HH:mm')}"
                ${this._data.isDisabled ? 'disabled' : ''}
              />
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input
                class="event__input  event__input--price"
                id="event-price-1"
                type="number"
                min="1"
                step="1"
                name="event-price"
                value="${he.encode(String(this._data.eventTotal))}"
                ${this._data.isDisabled ? 'disabled' : ''}
              />
            </div>

            <button
              class="event__save-btn  btn  btn--blue"
              type="submit">
              ${this._data.isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              class="event__reset-btn"
              type="reset">${this._mode === Mode.EDITING ? `${this._data.isDeleting ? 'Deleting...' : 'Delete'}` : 'Cancel'}
            </button>
            ${this._createRollUpButtonTemplate(this._mode)}
          </header>
          <section class="event__details">
            <section class="event__section  event__section--offers ${this._eventOfferSelector ? '' : 'visually-hidden'}">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
                ${this._eventOfferSelector}
              </div>
            </section>

            <section class="event__section  event__section--destination ${this._data.eventDestination ? '' : 'visually-hidden'}">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${this._data.eventDestination}</p>
              ${this._photos}
            </section>
          </section>
        </form>
      </li>`
    );
  }

  // Перегружаем метод родителя removeElement,
  // чтобы при удалении удалялся более ненужный календарь
  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  reset(event) {
    this.updateData(EventForm.parseEventToData(event));
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setStartTime() {
    if (this._startDatePicker) {
      // В случае обновления компонента удаляем вспомогательные DOM-элементы,
      // которые создает flatpickr при инициализации
      this._startDatePicker.destroy();
      this._startDatePicker = null;
    }
    this._startDatePicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      Object.assign(this._datePickerConfig, {
        minDate: this._data.eventStartTime,
        defaultDate: this._data.eventStartTime,
        onChange: this._startTimeChangeHandler,
      }));
  }

  _setEndTime() {
    if (this._endDatePicker) {
      // В случае обновления компонента удаляем вспомогательные DOM-элементы,
      // которые создает flatpickr при инициализации
      this._endDatePicker.destroy();
      this._endDatePicker = null;
    }
    this._endDatePicker = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      Object.assign(this._datePickerConfig, {
        defaultDate: this._data.eventEndTime,
        onChange: this._endTimeChangeHandler,
      }));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setFormClicktHandler(callback) {
    if (this._mode === Mode.EDITING) {
      this._callback.formClick = callback;
      this.getElement().querySelector('form .event__rollup-btn').addEventListener('click', this._formClickHandler);
    }
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setStartTime();
    this._setEndTime();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormClicktHandler(this._callback.formClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EventForm.parseDataToEvent(this._data));
  }

  _formClickHandler(evt) {
    evt.preventDefault();
    //здесь возвращаем карточку в состояние до редактирования
    const cloneData = getCloneData(this._cloneData);
    this.updateData(cloneData);
    this._callback.formClick(this._cloneData);
  }

  _setInnerHandlers() {
    const selectTypes = this.getElement().querySelectorAll('.event__type-label');
    const changePrice = this.getElement().querySelector('.event__input--price');
    const changeDestination = this.getElement().querySelector('.event__input--destination');
    changePrice.addEventListener('change', this._priceChangeHandler);
    changeDestination.addEventListener('change', this._destinationChangeHandler);
    selectTypes.forEach((item) => item.addEventListener('click', this._typeClickHandler));

    const availableOffers = this.getElement().querySelector('.event__available-offers');
    availableOffers.addEventListener('click', this._offerClickHandler);
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      eventTotal: Number(evt.target.value),
    }, true);
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    const distinationDescription = getCityDescription(evt.target.value);
    this.updateData({
      eventDestination: distinationDescription.description,
      eventCity: evt.target.value,
      eventPhotos: distinationDescription.pictures,
    });
  }

  _typeClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      eventType: evt.target.dataset.type,
      eventOffers: [],
    });
  }

  _startTimeChangeHandler([userDate]) {
    this.updateData({
      eventStartTime: userDate,
    }, true);
  }

  _endTimeChangeHandler([userDate]) {
    this.updateData({
      eventEndTime: userDate,
    }, true);
  }

  _offerClickHandler(evt) {
    if (evt.target.classList.contains('event__offer-checkbox')) {
      const index = this._data.eventOffers.findIndex((item) => item.title === evt.target.dataset.offerName);
      if (index > -1) {
        this._data.eventOffers.splice(index, 1);
      } else {
        const offer = this._offers[0].offers.filter((item) => item.title === evt.target.dataset.offerName);
        this._data.eventOffers.push({ title: offer[0].title, price: offer[0].price });
      }
    }
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EventForm.parseDataToEvent(this._data));
  }

  //превращение данных - в состояние
  //на основе данных об event создаём новый объект
  static parseEventToData(event) {
    return Object.assign(
      {},
      event,
      {
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign(
      {},
      data,
    );

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
