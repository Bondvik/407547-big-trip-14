import dayjs from 'dayjs';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  ADD: 'ADD',
};

const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

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
  INIT: 'INIT',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const DEFAULT_EVENT = {
  id: null,
  eventType: 'bus',
  eventCity: '',
  eventOffers: [],
  eventDestination: '',
  eventPhotos: [],
  eventStartTime: dayjs().toDate(),
  eventEndTime: dayjs().toDate(),
  eventDuration: '',
  eventTotal: 0,
  isFavorite: 0,
  isDisabled: false,
  isSaving: false,
  isDeleting: false,
};

const MenuItem = {
  ADD_NEW_EVENT: 'ADD_NEW_EVENT',
  TABLE: 'TABLE',
  STATS: 'STATS',
};

export {
  Mode,
  State,
  SortType,
  UserAction,
  UpdateType,
  FilterType,
  DEFAULT_EVENT,
  MenuItem
};
