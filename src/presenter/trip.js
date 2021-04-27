import {render, PositionOfRender} from '../mock/render.js';
import {updateItem, SortType, sortEventDown, compareEventPrice} from '../mock/util.js';
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
    this._currentSortType = SortType.DEFAULT;
    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(events) {
    this._events = events.slice();
    // 1. В отличии от сортировки по любому параметру,
    // исходный порядок можно сохранить только одним способом -
    // сохранив исходный массив:
    this._sourcedEvents = events.slice();
    this._renderEventsList();
    this._tripEventsListContainer = document.querySelector('.trip-events__list');
    this._renderEvents();
  }

  _handleEventChange(updatedTask) {
    this._events = updateItem(this._events, updatedTask);
    this._sourcedEvents = updateItem(this._sourcedEvents, updatedTask);
    this._eventPresenter[updatedTask.id].init(updatedTask);
  }

  _sortEvents(sortType) {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardTasks
    switch (sortType) {
      case SortType.PRICE:
        this._events.sort(compareEventPrice);
        break;
      case SortType.TIME:
        this._events.sort(sortEventDown);
        break;

      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        this._events =  this._sourcedEvents;
    }
    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    // - Сортируем задачи
    this._sortEvents(sortType);
    // - Очищаем список
    this._clearEventList();
    // - Рендерим список заново
    this._renderEvents();
  }

  _renderSort() {
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
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

  _clearEventList() {
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
