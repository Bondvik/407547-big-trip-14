import {createTripInfoTemplate} from './view/trip-info.js';
import {createPageNavigationTemplate} from './view/page-navigation.js';
import {createTripCostTemplate} from './view/trip-cost.js';
import {createFilterListTemplate} from './view/filter-list.js';
import {createSortListTemplate} from './view/sort-list.js';
import {createEventsListTemplate} from './view/events-list.js';
import {createEventTemplate} from './view/event.js';
import {createEventFormEditTemplate} from './view/event-form-edit.js';
import {createEventFormAddTemplate} from './view/event-form-add.js';

const EVENT_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

//Инфо о маршруте
const tripMainElement = document.querySelector('.trip-main');
render(tripMainElement, createTripInfoTemplate(), 'afterbegin');

//Стоимость маршрута
const tripInfoElement = tripMainElement.querySelector('.trip-info');
render(tripInfoElement, createTripCostTemplate(), 'beforeend');

//Навигация
const pageNavigationElement = document.querySelector('.trip-controls__navigation');
render(pageNavigationElement, createPageNavigationTemplate(), 'beforeend');

//Фильтры
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
render(tripControlsFiltersElement, createFilterListTemplate(), 'beforeend');

//Сортировка
const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');
render(tripEventsElement, createSortListTemplate(), 'afterbegin');

//Точки маршрута и формы добавления/редактирования маршрута
render(tripEventsElement, createEventsListTemplate(), 'beforeend');
const tripEventsListElement = pageMainElement.querySelector('.trip-events__list');
render(tripEventsListElement, createEventFormEditTemplate(), 'beforeend');
render(tripEventsListElement, createEventFormAddTemplate(), 'beforeend');
for (let i = 0; i < EVENT_COUNT; i++) {
  render(tripEventsListElement, createEventTemplate(), 'beforeend');
}
