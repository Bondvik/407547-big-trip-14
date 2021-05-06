import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  ADD: 'ADD',
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
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const DEFAULT_EVENT = {
  id: nanoid(),
  eventType: {
    type:'bus',
    name: 'Bus',
    icon: 'bus.png',
  },
  eventCity: '',
  eventOffers: [],
  eventDestination: '',
  eventPhotos: '',
  eventStartTime: dayjs(),
  eventEndTime: dayjs(),
  eventDuration: '',
  eventTotal: 0,
  isFavorite: 0,
};

export {
  Mode,
  SortType,
  UserAction,
  UpdateType,
  FilterType,
  DEFAULT_EVENT
};
