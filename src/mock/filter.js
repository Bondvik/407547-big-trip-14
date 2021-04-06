import dayjs from 'dayjs';
// eslint-disable-next-line no-undef
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
// eslint-disable-next-line no-undef
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');

const eventToFilterMap = {
  everything: (events) => events.length,
  future: (events) => events
    .filter((event) => {
      dayjs.extend(isSameOrAfter);
      return dayjs(event.eventStartTime).isAfter(dayjs(), 'minute') || dayjs(event.eventStartTime).isSame(dayjs(), 'minute');
    }).length,
  past: (events) => events
    .filter((event) => {
      dayjs.extend(isSameOrBefore);
      return dayjs(event.eventEndtTime).isBefore(dayjs(), 'minute');
    }).length,
};

const createFilter = (events) => {
  return Object.entries(eventToFilterMap).map(([filterName, countEvents]) => {
    return {
      name: filterName,
      count: countEvents(events),
    };
  });
};

export {createFilter};
