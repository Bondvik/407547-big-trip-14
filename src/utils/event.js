import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';

let destinations = [];
let offers = [];

const getEventDuration = (from, end) => {
  dayjs.extend(durationPlugin);
  const fromEventTime = dayjs(from);
  const toEventTime = dayjs(end);
  const diff = toEventTime.diff(fromEventTime);
  const days = dayjs.duration(diff).days();
  const hours = dayjs.duration(diff).hours();
  const minutes = dayjs.duration(diff).minutes();

  if (days === 0 && hours === 0) {
    return dayjs().minute(minutes).format('mm[M]');
  }

  if (days === 0) {
    return dayjs().hour(hours).minute(minutes).format('HH[H] mm[M]');
  }

  return dayjs().date(days).hour(hours).minute(minutes).format('DD[D] HH[H] mm[M]');
};

const saveDestinations = (data) => {
  destinations = data;
};

const getCityDescription = (cityName) => {
  const isCity = destinations.filter(({name}) => name === cityName);
  return isCity.length > 0 ? isCity[0] : {name: null, description: null, pictures: []};
};

const getCities = () => {
  return destinations.map(({name}) => name);
};

const saveOffers = (data) => {
  offers = data.map((item) => item);
};

const getOffer = (offerType) => {
  const offer = offers.filter(({type}) => type === offerType);
  return offer;
};

const getOffers = () => {
  return offers.map(({type}) => type);
};

const getCloneData = (data) => {
  let cloneData = null;
  cloneData = JSON.parse(JSON.stringify(data));
  cloneData.eventStartTime = data.eventStartTime;
  cloneData.eventEndTime = data.eventEndTime;
  return cloneData;
};

export {
  getEventDuration,
  getCityDescription,
  saveDestinations,
  getCities,
  saveOffers,
  getOffer,
  getOffers,
  getCloneData
};
