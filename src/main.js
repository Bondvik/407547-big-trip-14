import {render, PositionOfRender, remove} from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filters.js';
import TripInfoView from './view/trip-info.js';
import PageNavigationView from './view/page-navigation.js';
import TripCostView from './view/trip-cost.js';
import StatisticsView from './view/statistics.js';
import {MenuItem, UpdateType, FilterType} from './const.js';
import {saveDestinations, saveOffers} from './utils/event.js';
import Api from './api.js';

const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const AUTHORIZATION = 'Basic 7vgb34kDYU-RqmYwvYyh0';

const api = new Api(END_POINT, AUTHORIZATION);

const eventsModel = new EventsModel();
const filterModel = new FilterModel();

//Навигация
const pageNavigationElement = document.querySelector('.trip-controls__navigation');
const pageNavigationComponent = new PageNavigationView();

//Фильтры
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, eventsModel);

//Сортировка
const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

//Точки маршрута и формы добавления/редактирования маршрута
const tripPresenter = new TripPresenter(tripEventsElement, eventsModel, filterModel, api);

const handleEventNewFormClose = () => {
  remove(statisticsComponent);
  pageNavigationComponent.setMenuItem(MenuItem.TABLE);
};

let statisticsComponent = null;

const handlePageMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      // Скрыть статистику
      remove(statisticsComponent);
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      // Показать список точек маршрутов
      tripPresenter.destroy();
      tripPresenter.init();
      pageNavigationComponent.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.STATS:
      // Скрыть список точек маршрутов
      tripPresenter.destroy();
      // Показать статистику
      statisticsComponent = new StatisticsView(eventsModel.getEvents());
      render(pageMainElement, statisticsComponent, PositionOfRender.AFTERBEGIN);
      pageNavigationComponent.setMenuItem(MenuItem.STATS);
      break;
  }
};

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.destroy();
  tripPresenter.init();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.createPoint(handleEventNewFormClose);
});

filterPresenter.init();
tripPresenter.init();

api.getDestinations()
  .then((destinations) => {
    saveDestinations(destinations);
    return api.getOffers();
  })
  .then((offers) => {
    saveOffers(offers);
    return api.getPoints();
  })
  .then((points) => {
    eventsModel.setEvents(UpdateType.INIT, points);

    const tripMainElement = document.querySelector('.trip-main');
    render(tripMainElement, new TripInfoView(points).getElement(), PositionOfRender.AFTERBEGIN);

    const tripInfoElement = tripMainElement.querySelector('.trip-info');
    render(tripInfoElement, new TripCostView(points), PositionOfRender.BEFOREEND);

    render(pageNavigationElement, pageNavigationComponent, PositionOfRender.BEFOREEND);
    pageNavigationComponent.setMenuClickHandler(handlePageMenuClick);

  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
    render(pageNavigationElement, pageNavigationComponent, PositionOfRender.BEFOREEND);
    pageNavigationComponent.setMenuClickHandler(handlePageMenuClick);
  });


