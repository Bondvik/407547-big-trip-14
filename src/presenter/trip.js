import {render, PositionOfRender, remove} from '../utils/render.js';
import {sortEventDown, compareEventPrice, sortEventDay} from '../utils/sort.js';
import {SortType, UpdateType, UserAction, FilterType, State} from '../const.js';
import PointPresenter from './point.js';
import PointNewPresenter from './point-new.js';
import EventsListView from '../view/events-list.js';
import ListEmptyView from '../view/list-empty.js';
import SortView from '../view/sort-list.js';
import LoadingView from '../view/loading.js';
import TripCostView from '../view/trip-cost.js';
import TripInfoView from '../view/trip-info.js';
import {filter} from '../utils/filter.js';

export default class Trip {
  constructor(tripEventsElement, eventsModel, filterModel, api) {
    this._tripEventsContainer = tripEventsElement;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;

    this._eventsListComponent = new EventsListView();
    this._listEmptyComponent = new ListEmptyView();
    this._loadingComponent = new LoadingView();
    this._tripInfoComponent = null;
    this._tripCostComponent = null;

    this._tripEventsListContainer = null;
    this._sortComponent = null;
    this._tripInfoContainer = null;
    this._eventPresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._api = api;

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleEventViewChange = this._handleEventViewChange.bind(this);
    this._handleEventModelChange = this._handleEventModelChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._eventsListComponent, this._handleEventViewChange);
  }

  init() {
    this._renderEventsList();
    this._tripEventsListContainer = document.querySelector('.trip-events__list');
    
    this._eventsModel.addObserver(this._handleEventModelChange);
    this._filterModel.addObserver(this._handleEventModelChange);
    
    this._renderEvents();
    this._renderSort();

    //this._renderCost();
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

    this._eventsModel.removeObserver(this._handleEventModelChange);
    this._filterModel.removeObserver(this._handleEventModelChange);
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

  _renderConstInfo() {
    remove(this._tripInfoComponent);
    remove(this._tripCostComponent);
    this._renderInfo();
    this._renderCost();
  }

  _handleEventViewChange(actionType, updatedType, updatedPoint) {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // updatePoint - обновленные данные
    //Перед отправкой запроса на сервер просим презентеры точек или формы добавления точки заблокировать форму и установить состояние "Удаляется/добавляется".
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventPresenter[updatedPoint.id].setViewState(State.SAVING);
        this._api.updatePoint(updatedPoint)
          .then((response) => {
            this._eventsModel.updateEvent(updatedType, response);
            this._renderConstInfo();
          })
          .catch(() => {
            //на случай ошибки сетевого запроса вызовем метод (качания головой) дочерних презентеров
            this._eventPresenter[updatedPoint.id].setViewState(State.ABORTING);
          });
        break;
      case UserAction.ADD_EVENT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(updatedPoint)
          .then((response) => {
            this._eventsModel.addEvent(updatedType, response);
            this._renderConstInfo();
          })
          .catch(() => {
            //на случай ошибки сетевого запроса вызовем метод (качания головой) дочерних презентеров
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_EVENT:
        this._eventPresenter[updatedPoint.id].setViewState(State.DELETING);
        this._api.deletePoint(updatedPoint)
          .then(() => {
            // Обратите внимание, метод удаления задачи на сервере
            // ничего не возвращает. Это и верно,
            // ведь что можно вернуть при удалении задачи?
            // Поэтому в модель мы всё также передаем update
            this._eventsModel.deleteEvent(updatedType, updatedPoint);
            this._renderConstInfo();
          })
          .catch(() => {
            this._eventPresenter[updatedPoint.id].setViewState(State.ABORTING);
          });
        break;
    }
  }

  _handleEventModelChange(updatedType, data) {
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
        this._renderSort();
        this._renderEventsList();
        this._renderEvents();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderEventsList();
        this._renderEvents();
        this._renderInfo();
        this._renderCost();
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
    const pointPresenter = new PointPresenter(this._tripEventsListContainer, this._handleEventViewChange, this._handleModeChange);
    pointPresenter.init(event);
    this._eventPresenter[event.id] = pointPresenter;
  }

  _renderEvents() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const events = this.events;
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

  _renderCost() {
    if (this._tripCostComponent !== null) {
      this._tripCostComponent = null;
    }
    this._tripInfoContainer = document.querySelector('.trip-info');
    this._tripCostComponent = new TripCostView(this._eventsModel.getEvents());
    render(this._tripInfoContainer, this._tripCostComponent, PositionOfRender.BEFOREEND);
  }

  _renderInfo() {
    if (this._tripInfoComponent !== null) {
      this._tripInfoComponent = null;
    }
    const tripMainElement = document.querySelector('.trip-main');
    this._tripInfoComponent = new TripInfoView(this._eventsModel.getEvents());
    render(tripMainElement, this._tripInfoComponent.getElement(), PositionOfRender.AFTERBEGIN);
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
