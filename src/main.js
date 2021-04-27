import {render, PositionOfRender} from './mock/render.js';
import TripPresenter from './presenter/trip.js';
import TripInfoView from './view/trip-info.js';
import PageNavigationView from './view/page-navigation.js';
import TripCostView from './view/trip-cost.js';
import FilterView from './view/filter-list.js';
//TODO: расскоментировать, когда добавлять новые точки маршрута
//import EventFormAddView from './view/event-form-add.js';
import {createEvent} from './mock/event.js';
import {createFilter} from './mock/filter.js';

const EVENT_COUNT = 15;
const events = new Array(EVENT_COUNT).fill().map(createEvent);
const filters = createFilter(events);

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
const filterListComponent = new FilterView(filters);
render(tripControlsFiltersElement, filterListComponent, PositionOfRender.BEFOREEND);

//Сортировка
const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

//Точки маршрута и формы добавления/редактирования маршрута
const tripPresenter = new TripPresenter(tripEventsElement);
tripPresenter.init(events);
