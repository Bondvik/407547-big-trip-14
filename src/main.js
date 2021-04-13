import {RenderPosition, renderElement, renderTemplate} from './mock/util.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createPageNavigationTemplate} from './view/page-navigation.js';
import {createTripCostTemplate} from './view/trip-cost.js';
import {createFilterListTemplate} from './view/filter-list.js';
import {createSortListTemplate} from './view/sort-list.js';
import EventsListView from './view/events-list.js';
import {createEventTemplate} from './view/event.js';
import {createEventFormEditTemplate} from './view/event-form-edit.js';
import {createEventFormAddTemplate} from './view/event-form-add.js';
import {createEvent} from './mock/event.js';
import {createFilter} from './mock/filter.js';

const EVENT_COUNT = 15;
const events = new Array(EVENT_COUNT).fill().map(createEvent);
const filters = createFilter(events);

//Инфо о маршруте
const tripMainElement = document.querySelector('.trip-main');
renderTemplate(tripMainElement, createTripInfoTemplate(events), 'afterbegin');

//Стоимость маршрута
const tripInfoElement = tripMainElement.querySelector('.trip-info');
renderTemplate(tripInfoElement, createTripCostTemplate(events), 'beforeend');

//Навигация
const pageNavigationElement = document.querySelector('.trip-controls__navigation');
renderTemplate(pageNavigationElement, createPageNavigationTemplate(), 'beforeend');

//Фильтры
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
renderTemplate(tripControlsFiltersElement, createFilterListTemplate(filters), 'beforeend');

//Сортировка
const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');
renderTemplate(tripEventsElement, createSortListTemplate(), 'afterbegin');

//Точки маршрута и формы добавления/редактирования маршрута
renderElement(tripEventsElement, new EventsListView().getElement(), RenderPosition.BEFOREEND);
const tripEventsListElement = pageMainElement.querySelector('.trip-events__list');
renderTemplate(tripEventsListElement, createEventFormEditTemplate(events[0]), 'beforeend');
renderTemplate(tripEventsListElement, createEventFormAddTemplate(), 'beforeend');
events.forEach((event) => {
  renderTemplate(tripEventsListElement, createEventTemplate(event), 'beforeend');
});
