import {replace} from '../mock/render.js';
import EventView from '../view/event.js';
import EventFormEditView from '../view/event-form-edit.js';

export default class Point {
  constructor() {
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(event) {
    this._event = event;
    this._eventComponent = new EventView(this._event);
    this._eventEditComponent = new EventFormEditView(this._event);
    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setFormClicktHandler(this._handleFormSubmit);
    return this._eventComponent.getElement();
  }

  _replaceCardToForm() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _replaceFormToCard() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
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

  _handleFormSubmit() {
    this._replaceFormToCard();
  }
}
