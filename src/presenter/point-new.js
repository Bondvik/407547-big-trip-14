import {render, PositionOfRender, remove} from '../utils/render.js';
import {nanoid} from 'nanoid';
import EventFormEditView from '../view/event-form-edit.js';
import {UserAction, UpdateType, Mode, DEFAULT_EVENT} from '../const.js';

export default class PointNew {
  constructor(eventsListElement, changeData) {
    this._eventsListContainer = eventsListElement;
    this._changeData = changeData;

    this._eventEditComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._eventEditComponent !== null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    this._eventEditComponent = new EventFormEditView(DEFAULT_EVENT, Mode.ADD);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._eventsListContainer, this._eventEditComponent, PositionOfRender.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    remove(this._eventEditComponent);
    this._eventEditComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(event) {
    this._changeData(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      event,
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (['Escape', 'Esc'].includes(evt.key)) {
      evt.preventDefault();
      this.destroy();
    }
  }

}
