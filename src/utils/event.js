import dayjs from 'dayjs';
// eslint-disable-next-line no-undef
const duration = require('dayjs/plugin/duration');

let destinations = [];
let offers = [];

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

const saveDestinations = (data) => {
  destinations = data;
};

const getCityDescription = (cityName) => {
  const isCity = destinations.filter((item) => item.name === cityName);
  return isCity.length > 0 ? isCity[0] : {name: null, description: null, pictures: []};
};

const getCities = () => {
  return destinations.map((item) => item.name);
};

const saveOffers = (data) => {
  offers = data.map((item) => item);
};

const getOffer = (offerType) => {
  const offer = offers.filter((offer) => offer.type === offerType);
  return offer;
};

const getOffers = () => {
  return offers.map((offer) => offer.type);
};

export {
  getEventDuration,
  getCityDescription,
  saveDestinations,
  getCities,
  saveOffers,
  getOffer,
  getOffers
};
