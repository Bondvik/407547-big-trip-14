import {render, PositionOfRender, remove} from '../utils/render.js';
import {sortEventDown, compareEventPrice, sortEventDay} from '../mock/util.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import PointPresenter from './point.js';
import PointNewPresenter from './point-new.js';
import EventsListView from '../view/events-list.js';
import ListEmptyView from '../view/list-empty.js';
import SortView from '../view/sort-list.js';
import {filter} from '../utils/filter.js';

export default class Trip {
  constructor(tripEventsElement, eventsModel, filterModel) {
    this._tripEventsContainer = tripEventsElement;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;

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
    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._eventsListComponent, this._handleViewAction);
  }

  init() {
    this._renderEventsList();
    this._tripEventsListContainer = document.querySelector('.trip-events__list');
    this._renderEvents();
  }

  createPoint() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
  }

  get events() {
    const filterType = this._filterModel.filter;
    const events = this._eventsModel.getEvents();
    const filtredEvents = filter[filterType](events);
    switch (this._currentSortType) {
      case SortType.TIME:
        return filtredEvents.sort(sortEventDown);
      case SortType.PRICE:
        return filtredEvents.sort(compareEventPrice);
      default:
        return filtredEvents.sort(sortEventDay);
    }
  }

  _handleViewAction(actionType, updatedType, updatedPoint) {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // updatePoint - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updatedType, updatedPoint);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updatedType, updatedPoint);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updatedType, updatedPoint);
        break;
    }
  }

  _handleModelEvent(updatedType, data) {
    // В зависимости от типа изменений решаем, что делать:
    switch (updatedType) {
      case UpdateType.PATCH:
        // - обновить изменения в описании точки
        this._eventPresenter[data.id].init(data);
        break;
      // - обновить весь список точек маршрутов (например, при переключении фильтра)
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
        this._clearEventList({resetSortType: true});
        this._renderEventsList();
        this._renderEvents();
        break;
    }
  }

  _handleEventChange(updatedPoint) {
    this._eventPresenter[updatedPoint.id].init(updatedPoint);
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
    if (this.events && this.events.length) {
      this.events.forEach((event) => {
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

  _clearEventList({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
    remove(this._listEmptyComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
      remove(this._sortComponent);
    }
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }
}
