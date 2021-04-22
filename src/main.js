import {render, PositionOfRender, replace} from './mock/render.js';
import TripInfoView from './view/trip-info.js';
import PageNavigationView from './view/page-navigation.js';
import TripCostView from './view/trip-cost.js';
import FilterView from './view/filter-list.js';
import SortView from './view/sort-list.js';
import EventsListView from './view/events-list.js';
import EventView from './view/event.js';
import EventFormEditView from './view/event-form-edit.js';
import ListEmptyView from './view/list-empty.js';
//TODO: расскоментировать, когда добавлять новые точки маршрута
//import EventFormAddView from './view/event-form-add.js';
import {createEvent} from './mock/event.js';
import {createFilter} from './mock/filter.js';

const EVENT_COUNT = 15;
const events = new Array(EVENT_COUNT).fill().map(createEvent);
const filters = createFilter(events);
const fragment = document.createDocumentFragment();

const renderEvent = (event) => {
  const eventComponent = new EventView(event);
  const eventEditComponent = new EventFormEditView(event);
  const replaceCardToForm = () => {
    replace(eventEditComponent, eventComponent);
  };
  const replaceFormToCard = () => {
    replace(eventComponent, eventEditComponent);
  };
  const onEscKeyDown = (evt) => {
    if (['Escape', 'Esc'].includes(evt.key)) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };
  eventComponent.setEditClickHandler(() => {
    replaceCardToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });
  eventEditComponent.setFormSubmitHandler(() => {
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
  });
  eventEditComponent.setFormClicktHandler(() => {
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
  });
  return eventComponent.getElement();
};

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
const sortComponent = new SortView();
render(tripEventsElement, sortComponent, PositionOfRender.AFTERBEGIN);

//Точки маршрута и формы добавления/редактирования маршрута
const eventsListComponent = new EventsListView();
render(tripEventsElement, eventsListComponent, PositionOfRender.BEFOREEND);
const tripEventsListElement = pageMainElement.querySelector('.trip-events__list');

//Если нет точек маршрута, то отрисовать заглушку
const listEmptyComponent = new ListEmptyView();
if (events.length) {
  events.forEach((event) => {
    fragment.appendChild(renderEvent(event));
  });
} else {
  render(tripEventsListElement, listEmptyComponent, PositionOfRender.BEFOREEND);
}
render(tripEventsElement, tripEventsListElement.appendChild(fragment), PositionOfRender.BEFOREEND);
