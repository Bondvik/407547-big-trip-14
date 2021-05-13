import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

export default class PageNavigation extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return (
      `<nav class="trip-controls__trip-tabs  trip-tabs">
        <a class="trip-tabs__btn trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
        <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATS}">Stats</a>
      </nav>`
    );
  }

  setMenuItem(menuItem) {
    const items = this.getElement().querySelectorAll('.trip-tabs__btn');
    for (const item of items) {
      item.classList.remove('trip-tabs__btn--active');
      if (item.dataset.menuItem === menuItem) {
        item.classList.add('trip-tabs__btn--active');
      }
    }
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }
}
