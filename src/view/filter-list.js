import {getRandomNumber, createElement} from '../mock/util.js';

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  _getFilterItemTemplate({name, count}) {
    return (
      `<div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${(getRandomNumber(0, 1)) ? 'checked' : ''}${count === 0 ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-${name}">${name} <span class="filter__${name}-count">${count}</span></label>
      </div>`
    );
  }

  getTemplate() {
    const filterItemsTemplate = this._filters.reduce((accumulator, filter) => accumulator + this._getFilterItemTemplate(filter), '');
    return (
      `<form class="trip-filters" action="#" method="get">
        ${filterItemsTemplate}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
