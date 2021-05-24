import dayjs from 'dayjs';

const BAR_HEIGHT = 55;
const TextChart = {
  MONEY: 'MONEY',
  TYPE: 'TYPE',
  TIME: 'TIME-SPEND',
};

const getDuration = (startTime, endTime) => {
  return dayjs(endTime).diff(dayjs(startTime));
};

const getPriceByTripType = (events, type) => {
  const eventsByType = events.filter(({eventType}) => eventType === type);
  return eventsByType.reduce((accumulator, item) => accumulator + item.eventTotal, 0);
};

const getCountByTripType = (events, type) => {
  return events.filter(({eventType}) => eventType === type).length;
};

const getDurationByTripType = (events, type) => {
  const eventsByType = events.filter(({eventType}) => eventType === type);
  const duration = eventsByType.reduce((accumulator, item) => {
    return accumulator + getDuration(item.eventStartTime, item.eventEndTime);
  }, 0 );
  return duration;
};

const humanizeDuration = (duration) => {
  const date = dayjs.duration(duration);

  const days = date.days();
  const hours = date.hours();
  const minutes = date.minutes();

  if (days === 0 && hours === 0) {
    return dayjs().minute(minutes).format('mm[M]');
  } else if (days === 0) {
    return dayjs().hour(hours).minute(minutes).format('HH[H] mm[M]');
  }
  return dayjs().date(days).hour(hours).minute(minutes).format('DD[D] HH[H] mm[M]');
};

const getTypesUniq = (events) => {
  const eventsTypes = events.map(({eventType}) => eventType);
  return [...new Set(eventsTypes)];
};

export {
  BAR_HEIGHT,
  TextChart,
  getPriceByTripType,
  getCountByTripType,
  getDurationByTripType,
  humanizeDuration,
  getTypesUniq
};
