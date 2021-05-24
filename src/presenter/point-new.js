import {render, PositionOfRender, remove} from '../utils/render.js';
import EventFormView from '../view/event-form.js';
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

    this._eventEditComponent = new EventFormView(DEFAULT_EVENT, Mode.ADD);
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

  //метод, который будет получать необходимое состояние от презентера trip и передавать его формы. Это необходимо для реализации обратной связи на события сохранения и удаления
  setSaving() {
    this._eventEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  //В презентераз формы добавления задачи используем метод (качания головой) в случае отмены действия
  setAborting() {
    const resetFormState = () => {
      this._eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._eventEditComponent.shake(resetFormState);
  }

  _handleFormSubmit(event) {
    this._changeData(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      event,
    );
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
