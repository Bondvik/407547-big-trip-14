import {getRandomNumber} from '../mock/util.js';
import AbstractView from './abstract.js';

export default class Filter extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
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
}
