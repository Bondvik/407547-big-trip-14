import {render, PositionOfRender, remove} from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filters.js';
import TripInfoView from './view/trip-info.js';
import PageNavigationView from './view/page-navigation.js';
import TripCostView from './view/trip-cost.js';
import StatisticsView from './view/statistics.js';
import {createEvent} from './mock/event.js';
import {MenuItem, UpdateType, FilterType} from './const.js';

let statisticsComponent = null;

const EVENT_COUNT = 4;
const events = new Array(EVENT_COUNT).fill().map(createEvent);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

//Инфо о маршруте
const tripMainElement = document.querySelector('.trip-main');
const TripInfoComponent = new TripInfoView(events);
render(tripMainElement, TripInfoComponent.getElement(), PositionOfRender.AFTERBEGIN);

//Стоимость маршрута
const tripInfoElement = tripMainElement.querySelector('.trip-info');
const TripCostComponent = new TripCostView(events);
render(tripInfoElement, TripCostComponent, PositionOfRender.BEFOREEND);

//Навигация
const pageNavigationElement = document.querySelector('.trip-controls__navigation');
const pageNavigationComponent = new PageNavigationView();
render(pageNavigationElement, pageNavigationComponent, PositionOfRender.BEFOREEND);

//Фильтры
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, eventsModel);

//Сортировка
const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

//Точки маршрута и формы добавления/редактирования маршрута
const tripPresenter = new TripPresenter(tripEventsElement, eventsModel, filterModel);

filterPresenter.init();
tripPresenter.init();

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
      render(pageMainElement, statisticsComponent, PositionOfRender.BEFOREEND);
      pageNavigationComponent.setMenuItem(MenuItem.STATS);
      break;
  }
};

const handleEventNewFormClose = () => {
  remove(statisticsComponent);
  pageNavigationComponent.setMenuItem(MenuItem.TABLE);
};

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.init();
  tripPresenter.createPoint(handleEventNewFormClose);
});

pageNavigationComponent.setMenuClickHandler(handlePageMenuClick);
