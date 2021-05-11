import Observer from '../utils/observer.js';
import {FilterType} from '../const.js';

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.EVERYTHING;
  }

  setFilter(updatedType, filter) {
    this._activeFilter = filter;
    this._notify(updatedType, filter);
  }

  get filter() {
    return this._activeFilter;
  }
}
