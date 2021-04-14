import {RenderPosition, render} from './mock/util.js';
import TripInfoView from './view/trip-info.js';
import PageNavigationView from './view/page-navigation.js';
import TripCostView from './view/trip-cost.js';
import FilterView from './view/filter-list.js';
import SortView from './view/sort-list.js';
import EventsListView from './view/events-list.js';
import EventView from './view/event.js';
import EventFormEditView from './view/event-form-edit.js';
import EventFormAddView from './view/event-form-add.js';
import {createEvent} from './mock/event.js';
import {createFilter} from './mock/filter.js';

const EVENT_COUNT = 15;
const events = new Array(EVENT_COUNT).fill().map(createEvent);
const filters = createFilter(events);

const renderEvent = (tripEventsElement, event) => {
  const eventComponent = new EventView(event);
  const eventEditComponent = new EventFormEditView(event);
  const replaceCardToForm = () => {
    tripEventsElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };
  const replaceFormToCard = () => {
    tripEventsElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };
  eventComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceCardToForm();
  });
  eventEditComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToCard();
  });
  render(tripEventsElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

//Инфо о маршруте
const tripMainElement = document.querySelector('.trip-main');
const TripInfoComponent = new TripInfoView(events);
render(tripMainElement, TripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);

//Стоимость маршрута
const tripInfoElement = tripMainElement.querySelector('.trip-info');
const TripCostComponent = new TripCostView(events);
render(tripInfoElement, TripCostComponent.getElement(), RenderPosition.BEFOREEND);

//Навигация
const pageNavigationElement = document.querySelector('.trip-controls__navigation');
const pageNavigationComponent = new PageNavigationView();
render(pageNavigationElement, pageNavigationComponent.getElement(), RenderPosition.BEFOREEND);

//Фильтры
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const filterListComponent = new FilterView(filters);
render(tripControlsFiltersElement, filterListComponent.getElement(), RenderPosition.BEFOREEND);

//Сортировка
const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');
const sortComponent = new SortView();
render(tripEventsElement, sortComponent.getElement(), RenderPosition.AFTERBEGIN);

//Точки маршрута и формы добавления/редактирования маршрута
const eventsListComponent = new EventsListView();
render(tripEventsElement, eventsListComponent.getElement(), RenderPosition.BEFOREEND);
const tripEventsListElement = pageMainElement.querySelector('.trip-events__list');

events.forEach((event) => {
  renderEvent(tripEventsListElement, event);
});
