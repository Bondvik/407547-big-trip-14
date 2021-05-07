import dayjs from 'dayjs';

const BAR_HEIGHT = 55;

const getDuration = (startTime, endTime) => {
  return dayjs(endTime).diff(dayjs(startTime));
};

const getPriceByTripType = (events, type) => {
  const eventsByType = events.filter((item) => item.eventType.type === type);
  return eventsByType.reduce((accumulator, item) => accumulator + item.eventTotal, 0);
};

const getCountByTripType = (events, type) => {
  return events.filter((item) => item.eventType.type === type).length;
};

const getDurationByTripType = (events, type) => {
  const eventsByType = events.filter((item) => item.eventType.type === type);
  const duration = eventsByType.reduce((accumulator, item) => {
    return accumulator + getDuration(item.eventStartTime, item.eventEndTime);
  }, 0 );
  return duration;
};

const humanizeDuration = (duration) => {
  const days = dayjs.duration(duration).days();
  const hours = dayjs.duration(duration).hours();
  const minutes = dayjs.duration(duration).minutes();

  if (days === 0 && hours === 0) {
    return dayjs().minute(minutes).format('mm[M]');
  } else if (days === 0) {
    return dayjs().hour(hours).minute(minutes).format('HH[H] mm[M]');
  } else {
    return dayjs().date(days).hour(hours).minute(minutes).format('DD[D] HH[H] mm[M]');
  }
};

export {BAR_HEIGHT, getPriceByTripType, getCountByTripType, getDurationByTripType, humanizeDuration};
