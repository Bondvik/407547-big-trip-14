import Abstract from './abstract';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  //изменяет состояние
  updateData(update, justDataUpdating) {
    //если никакого update (объекта с изменениями) не пришло, то ничего не делать
    if (!update) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    if (justDataUpdating) {
      return;
    }
    //на основе нового состояния будет перерисовка
    this.updateElement();
  }

  //перерисовка event
  updateElement() {
    //запоминаем предыдущий
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    //удалить старый DOM-элемент компонента
    this.removeElement();
    //создать новый DOM-элемент;
    const newElement = this.getElement();
    //поместить новый элемент вместо старого;
    parent.replaceChild(newElement, prevElement);
    //восстановить обработчики событий
    this.restoreHandlers();
  }

  //восстанавливать обработчики событий после перерисовки
  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
