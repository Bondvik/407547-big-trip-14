import {render, PositionOfRender, remove} from '../utils/render.js';
import {sortEventDown, compareEventPrice, sortEventDay} from '../mock/util.js';
import {SortType, UpdateType, UserAction, FilterType, State} from '../const.js';
import PointPresenter from './point.js';
import PointNewPresenter from './point-new.js';
import EventsListView from '../view/events-list.js';
import ListEmptyView from '../view/list-empty.js';
import SortView from '../view/sort-list.js';
import LoadingView from '../view/loading.js';
import {filter} from '../utils/filter.js';

export default class Trip {
  constructor(tripEventsElement, eventsModel, filterModel, api) {
    this._tripEventsContainer = tripEventsElement;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;

    this._eventsListComponent = new EventsListView();
    this._listEmptyComponent = new ListEmptyView();
    this._loadingComponent = new LoadingView();

    this._tripEventsListContainer = null;
    this._sortComponent = null;
    this._eventPresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._api = api;

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._eventsListComponent, this._handleViewAction);
  }

  init() {
    this._renderEventsList();
    this._tripEventsListContainer = document.querySelector('.trip-events__list');

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderEvents();
    this._renderSort();
  }

  createPoint(callback) {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(callback);
  }

  destroy() {
    this._clearEventList({resetSortType: true});
    remove(this._sortComponent);
    remove(this._eventsListComponent);

    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
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

  _handleViewAction(actionType, updateType, updatePoint) {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // updatePoint - обновленные данные
    //Перед отправкой запроса на сервер просим презентеры точек или формы добавления точки заблокировать форму и установить состояние "Удаляется/добавляется".
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventPresenter[updatePoint.id].setViewState(State.SAVING);
        this._api.updatePoint(updatePoint)
          .then((response) => {
            this._eventsModel.updateEvent(updateType, response);
          })
          .catch(() => {
            //на случай ошибки сетевого запроса вызовем метод (качания головой) дочерних презентеров
            this._eventPresenter[updatePoint.id].setViewState(State.ABORTING);
          });
        break;
      case UserAction.ADD_EVENT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(updatePoint)
          .then((response) => {
            this._eventsModel.addEvent(updateType, response);
          })
          .catch(() => {
            //на случай ошибки сетевого запроса вызовем метод (качания головой) дочерних презентеров
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_EVENT:
        this._eventPresenter[updatePoint.id].setViewState(State.DELETING);
        this._api.deletePoint(updatePoint)
          .then(() => {
            // Обратите внимание, метод удаления задачи на сервере
            // ничего не возвращает. Это и верно,
            // ведь что можно вернуть при удалении задачи?
            // Поэтому в модель мы всё также передаем update
            this._eventsModel.deleteEvent(updateType, updatePoint);
          })
          .catch(() => {
            this._eventPresenter[updatePoint.id].setViewState(State.ABORTING);
          });
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
        this._clearEventList({resetSortType: true});
        this._renderSort();
        this._renderEventsList();
        this._renderEvents();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderEventsList();
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
    render(this._tripEventsContainer, this._eventsListComponent, PositionOfRender.BEFOREEND);
  }

  _renderEvent(event) {
    const pointPresenter = new PointPresenter(this._tripEventsListContainer, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(event);
    this._eventPresenter[event.id] = pointPresenter;
  }

  _renderEvents() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const events = this._getEvents();
    if (events && events.length) {
      events.forEach((event) => {
        this._renderEvent(event);
      });
    } else {
      this._renderNoEvents();
    }
    render(this._tripEventsContainer, this._tripEventsListContainer, PositionOfRender.BEFOREEND);
  }

  _renderLoading() {
    render(this._eventsListComponent, this._loadingComponent, PositionOfRender.AFTERBEGIN);
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
    remove(this._loadingComponent);

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
