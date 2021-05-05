import dayjs from 'dayjs';
import {FilterType} from '../const';

const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) =>
    dayjs().isBefore(dayjs(event.eventStartTime), 'd')
    || dayjs().isSame(dayjs(event.eventStartTime), 'd')),
  [FilterType.PAST]: (events) => events.filter((event) => dayjs().isAfter(dayjs(event.eventStartTime), 'd')),
};

export {filter};
