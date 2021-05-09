import dayjs from 'dayjs';
// eslint-disable-next-line no-undef
const duration = require('dayjs/plugin/duration');

const getEventDuration = (from, end) => {
  dayjs.extend(duration);
  const fromEventTime = dayjs(from);
  const toEventTime = dayjs(end);
  const diff = toEventTime.diff(fromEventTime);
  const days = dayjs.duration(diff).days();
  const hours = dayjs.duration(diff).hours();
  const minutes = dayjs.duration(diff).minutes();

  if (days === 0 && hours === 0) {
    return dayjs().minute(minutes).format('mm[M]');
  } else if (days === 0) {
    return dayjs().hour(hours).minute(minutes).format('HH[H] mm[M]');
  } else {
    return dayjs().date(days).hour(hours).minute(minutes).format('DD[D] HH[H] mm[M]');
  }
};

const eventTypes = [
  {
    type:'taxi',
    name: 'Taxi',
  },
  {
    type:'bus',
    name: 'Bus',
  },
  {
    type:'train',
    name: 'Train',
  },
  {
    type:'ship',
    name: 'Ship',
  },
  {
    type:'transport',
    name: 'Transport',
  },
  {
    type:'drive',
    name: 'Drive',
  },
  {
    type:'flight',
    name: 'Flight',
  },
  {
    type:'check-in',
    name: 'Check-in',
  },
  {
    type:'sightseeing',
    name: 'Sightseeing',
  },
  {
    type:'restaurant',
    name: 'Restaurant',
  },
];

export {getEventDuration, eventTypes};
