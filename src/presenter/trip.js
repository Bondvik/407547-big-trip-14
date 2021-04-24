import {render, PositionOfRender} from '../mock/render.js';
import PointPresenter from '../presenter/point.js';
import EventsListView from '../view/events-list.js';
import ListEmptyView from '../view/list-empty.js';
import SortView from '../view/sort-list.js';

export default class Trip {
  constructor(tripEventsElement) {
    this._eventsListComponent = new EventsListView();
    this._listEmptyComponent = new ListEmptyView();
    this._sortComponent = new SortView();
    this._tripEventsContainer = tripEventsElement;
    this._tripEventsListContainer = null;
  }

  init(events) {
    this._events = events.slice();
    this._renderEventsList();
    this._tripEventsListContainer = document.querySelector('.trip-events__list');
    this._renderEvents();
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortComponent, PositionOfRender.AFTERBEGIN);
  }

  _renderEventsList() {
    this._renderSort();
    render(this._tripEventsContainer, this._eventsListComponent, PositionOfRender.BEFOREEND);
  }

  _renderEvent(event) {
    const pointPresenter = new PointPresenter();
    return pointPresenter.init(event);
  }

  _renderEvents() {
    const fragment = document.createDocumentFragment();
    if (this._events.length) {
      this._events.forEach((event) => {
        fragment.appendChild(this._renderEvent(event));
      });
    } else {
      this._renderNoEvents();
    }
    render(this._tripEventsContainer, this._tripEventsListContainer.appendChild(fragment), PositionOfRender.BEFOREEND);
  }

  _renderNoEvents() {
    render(this._tripEventsListContainer, this._listEmptyComponent, PositionOfRender.BEFOREEND);
  }
}
