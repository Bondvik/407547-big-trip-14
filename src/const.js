const SortType = {
  DEFAULT: 'day',
  TIME: 'time',
  PRICE: 'price',
};

//Действия пользователя
const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

//Тип обновления данных
const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export {SortType, UserAction, UpdateType, FilterType};
