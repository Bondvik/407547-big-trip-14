import AbstractView from './abstract.js';
import {SortType} from '../const.js';

export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._checkedSortType = SortType.DEFAULT;
  }
  getTemplate() {
    return (
      `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        <div class="trip-sort__item  trip-sort__item--day">
          <input
            id="sort-day" class="trip-sort__input  visually-hidden"
            type="radio" name="trip-sort"
            value="sort-day" data-sort-type="${SortType.DEFAULT}"
            ${this._currentSortType === SortType.DEFAULT ? 'checked' : ''}
          />
          <label class="trip-sort__btn" for="sort-day" data-sort-type="${SortType.DEFAULT}">Day</label>
        </div>
        <div class="trip-sort__item  trip-sort__item--event">
          <input
            id="sort-event"
            class="trip-sort__input  visually-hidden"
            type="radio" name="trip-sort"
            value="sort-event" disabled
          />
          <label class="trip-sort__btn" for="sort-event">Event</label>
        </div>
        <div class="trip-sort__item  trip-sort__item--time">
          <input
            id="sort-time"
            class="trip-sort__input  visually-hidden"
            type="radio"
            name="trip-sort"
            value="sort-time"
            data-sort-type="${SortType.TIME}"
            ${this._currentSortType === SortType.TIME ? 'checked' : ''}
          />
          <label class="trip-sort__btn" for="sort-time" data-sort-type="${SortType.TIME}">Time</label>
        </div>
        <div class="trip-sort__item  trip-sort__item--price">
          <input
            id="sort-price"
            class="trip-sort__input  visually-hidden"
            type="radio" name="trip-sort"
            value="sort-price"
            data-sort-type="${SortType.PRICE}"
            ${this._currentSortType === SortType.PRICE ? 'checked' : ''}
          />
          <label class="trip-sort__btn" for="sort-price" data-sort-type="${SortType.PRICE}">Price</label>
        </div>
        <div class="trip-sort__item  trip-sort__item--offer">
          <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
          <label class="trip-sort__btn" for="sort-offer">Offers</label>
        </div>
      </form>`
    );
  }
  //?????? ?????????????????????? ???????????????????? checked ???????????? ????????????????????
  _getCheckSortType (sortType) {
    const tripsSort = document.querySelectorAll('.trip-sort__input');
    for (const trip of tripsSort) {
      trip.checked = false;
      if (trip.dataset.sortType === sortType && !trip.disabled) {
        trip.checked = true;
      }
    }
  }

  _sortTypeChangeHandler(evt) {
    if (!evt.target.classList.contains('trip-sort__input') && !evt.target.classList.contains('trip-sort__btn')) {
      return;
    }
    this._getCheckSortType(evt.target.dataset.sortType);
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
