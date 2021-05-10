import dayjs from 'dayjs';
import {FilterType} from '../const';

const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter(({eventStartTime}) =>
    dayjs().isBefore(dayjs(eventStartTime), 'd')
    || dayjs().isSame(dayjs(eventStartTime), 'd')),
  [FilterType.PAST]: (events) => events.filter(({eventStartTime}) => dayjs().isAfter(dayjs(eventStartTime), 'd')),
};

export {filter};
