import {replace, render, PositionOfRender, remove} from '../mock/render.js';
import EventView from '../view/event.js';
import EventFormEditView from '../view/event-form-edit.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Point {
  constructor(tripEventsListElement, changeData, changeMode) {
    this._tripEventsListContainer = tripEventsListElement;
    this._changeData = changeData;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventView(this._event);
    this._eventEditComponent = new EventFormEditView(this._event);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setFormClicktHandler(this._handleFormSubmit);

    if ([prevEventComponent, prevEventEditComponent].includes(null)) {
      render(this._tripEventsListContainer, this._eventComponent, PositionOfRender.BEFOREEND);
      return;
    }

    if (this._tripEventsListContainer.contains(prevEventComponent.getElement())) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._tripEventsListContainer.contains(prevEventEditComponent.getElement())) {
      replace(this._eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._event,
        {
          isFavorite: !this._event.isFavorite,
        },
      ),
    );
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }

  _replaceCardToForm() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (['Escape', 'Esc'].includes(evt.key)) {
      evt.preventDefault();
      this._replaceFormToCard();
      document.removeEventListener('keydown', this.__escKeyDownHandler);
    }
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFormSubmit(point) {
    this._changeData(point);
    this._replaceFormToCard();
  }

  resetView() {
    if(this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }
}
