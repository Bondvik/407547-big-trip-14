import {render, PositionOfRender, replace} from '../mock/render.js';
import EventView from '../view/event.js';
import EventFormEditView from '../view/event-form-edit.js';
import EventsListView from '../view/events-list.js';
import ListEmptyView from '../view/list-empty.js';

export default class Trip {
  constructor(tripEventsElement) {
    this._eventsListComponent = new EventsListView();
    this._listEmptyComponent = new ListEmptyView();
    this._tripEventsContainer = tripEventsElement;
    this._tripEventsListContainer = null;
  }

  init(events) {
    this._events = events.slice();
    this._renderEventsList();
    this._tripEventsListContainer = document.querySelector('.trip-events__list');
    this._renderEvents();
  }

  _renderEventsList() {
    return render(this._tripEventsContainer, this._eventsListComponent, PositionOfRender.BEFOREEND);
  }

  _renderEvent(event) {
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
  }

  _renderEvents() {
    const fragment = document.createDocumentFragment();
    if (this._events.length) {
      this._events.forEach((event) => {
        fragment.appendChild(this._renderEvent(event));
      });
    } else {
      this._renderNoEvents();
    }
    render(this._tripEventsContainer, this._tripEventsListContainer.appendChild(fragment), PositionOfRender.BEFOREEND);
  }

  _renderNoEvents() {
    render(this._tripEventsListContainer, this._listEmptyComponent, PositionOfRender.BEFOREEND);
  }
}
