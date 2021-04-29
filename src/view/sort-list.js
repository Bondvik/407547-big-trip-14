import AbstractView from './abstract.js';
import {SortType} from '../mock/util.js';

export default class Sort extends AbstractView {
  constructor() {
    super();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._checkedSortType = SortType.DEFAULT;
  }
  getTemplate() {
    return (
      `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
          <div class="trip-sort__item  trip-sort__item--day">
            <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" data-sort-type="${SortType.DEFAULT}">
            <label class="trip-sort__btn" for="sort-day">Day</label>
          </div>
          <div class="trip-sort__item  trip-sort__item--event">
            <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
            <label class="trip-sort__btn" for="sort-event">Event</label>
          </div>
          <div class="trip-sort__item  trip-sort__item--time">
            <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" data-sort-type="${SortType.TIME}">
            <label class="trip-sort__btn" for="sort-time">Time</label>
          </div>
          <div class="trip-sort__item  trip-sort__item--price">
            <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" data-sort-type="${SortType.PRICE}">
            <label class="trip-sort__btn" for="sort-price">Price</label>
          </div>
          <div class="trip-sort__item  trip-sort__item--offer">
            <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
            <label class="trip-sort__btn" for="sort-offer">Offers</label>
          </div>
      </form>`
    );
  }
  //Для визуального оформления checked кнопок сортировки
  _getCheckSortType (evt) {
    if (evt.target.previousElementSibling) {
      const tripsSort = document.querySelectorAll('.trip-sort__input');
      for (const trip of tripsSort) {
        trip.checked = false;
        if (trip.dataset.sortType === this._checkedSortType && !trip.disabled) {
          trip.checked = true;
        }
      }
    }
  }

  _sortTypeChangeHandler(evt) {
    if (!evt.target.classList.contains('trip-sort__btn')) {
      return;
    }
    this._checkedSortType = evt.target.previousElementSibling.dataset.sortType;
    this._getCheckSortType(evt);
    evt.preventDefault();
    this._callback.sortTypeChange(this._checkedSortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
