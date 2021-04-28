import {render, PositionOfRender} from '../mock/render.js';
import {updateItem} from '../mock/util.js';
import PointPresenter from '../presenter/point.js';
import EventsListView from '../view/events-list.js';
import ListEmptyView from '../view/list-empty.js';
import SortView from '../view/sort-list.js';

export default class Trip {
  constructor(tripEventsElement) {
    this._tripEventsContainer = tripEventsElement;
    this._eventsListComponent = new EventsListView();
    this._listEmptyComponent = new ListEmptyView();
    this._sortComponent = new SortView();
    this._tripEventsListContainer = null;
    this._eventPresenter = {};
    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._renderEventsList();
    this._tripEventsListContainer = document.querySelector('.trip-events__list');
    this._renderEvents();
  }

  _handleEventChange(updatedTask) {
    this._events = updateItem(this._events, updatedTask);
    this._eventPresenter[updatedTask.id].init(updatedTask);
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortComponent, PositionOfRender.AFTERBEGIN);
  }

  _renderEventsList() {
    this._renderSort();
    render(this._tripEventsContainer, this._eventsListComponent, PositionOfRender.BEFOREEND);
  }

  _renderEvent(event) {
    const pointPresenter = new PointPresenter(this._tripEventsListContainer, this._handleEventChange, this._handleModeChange);
    pointPresenter.init(event);
    this._eventPresenter[event.id] = pointPresenter;
  }

  _renderEvents() {
    if (this._events.length) {
      this._events.forEach((event) => {
        this._renderEvent(event);
      });
    } else {
      this._renderNoEvents();
    }
    render(this._tripEventsContainer, this._tripEventsListContainer, PositionOfRender.BEFOREEND);
  }

  _renderNoEvents() {
    render(this._tripEventsListContainer, this._listEmptyComponent, PositionOfRender.BEFOREEND);
  }

  _clearTaskList() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }
}
