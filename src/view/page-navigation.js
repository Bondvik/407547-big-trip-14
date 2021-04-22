import AbstractView from './abstract.js';

export default class PageNavigation extends AbstractView{
  getTemplate() {
    return (
      `<nav class="trip-controls__trip-tabs  trip-tabs">
        <a class="trip-tabs__btn" href="#">Table</a>
        <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Stats</a>
      </nav>`
    );
  }
}
