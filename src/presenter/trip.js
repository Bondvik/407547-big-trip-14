import {render, PositionOfRender} from '../mock/render.js';
import {sortEventDown, compareEventPrice} from '../mock/util.js';
import {SortType, UpdateType, UserAction} from '../const.js';
import PointPresenter from '../presenter/point.js';
import EventsListView from '../view/events-list.js';
import ListEmptyView from '../view/list-empty.js';
import SortView from '../view/sort-list.js';

export default class Trip {
  constructor(tripEventsElement, eventsModel) {
    this._tripEventsContainer = tripEventsElement;
    this._eventsModel = eventsModel;

    this._eventsListComponent = new EventsListView();
    this._listEmptyComponent = new ListEmptyView();

    this._tripEventsListContainer = null;
    this._sortComponent = null;
    this._eventPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderEventsList();
    this._tripEventsListContainer = document.querySelector('.trip-events__list');
    this._renderEvents();
  }

  _getEvents() {
    switch (this._currentSortType) {
      case SortType.TIME:
        return this._eventsModel.getEvents().slice().sort(sortEventDown);
      case SortType.PRICE:
        return this._eventsModel.getEvents().slice().sort(compareEventPrice);
    }
    return this._eventsModel.getEvents();
  }

  _handleViewAction(actionType, updateType, updatePoint) {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // updatePoint - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, updatePoint);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, updatePoint);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, updatePoint);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить изменения в описании точки
        this._eventPresenter[data.id].init(data);
        break;
      // - обновить весь список точек маршрутов (например, при переключении фильтра)
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
        this._clearEventList();
        this._renderEvents();
        break;
    }
  }

  _handleEventChange(updatedTask) {
    this._eventPresenter[updatedTask.id].init(updatedTask);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    // - Очищаем список
    this._clearEventList();
    // - Рендерим список заново
    this._renderEvents();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripEventsContainer, this._sortComponent, PositionOfRender.AFTERBEGIN);
  }

  _renderEventsList() {
    this._renderSort();
    render(this._tripEventsContainer, this._eventsListComponent, PositionOfRender.BEFOREEND);
  }

  _renderEvent(event) {
    const pointPresenter = new PointPresenter(this._tripEventsListContainer, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(event);
    this._eventPresenter[event.id] = pointPresenter;
  }

  _renderEvents() {
    const events = this._getEvents();
    if (events.length) {
      events.forEach((event) => {
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
