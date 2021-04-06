import dayjs from 'dayjs';
import {getRandomNumber} from './util.js';
// eslint-disable-next-line no-undef
const duration = require('dayjs/plugin/duration');

const HOURS = 23;
const MINUTES = 59;
const DAYS = 6;


const cities = [
  'Amsterdam',
  'London',
  'Prague',
  'Paris',
  'Berlin',
  'St. Petersburg',
  'Barcelona',
  'Rome',
  'Budapest',
  'Florence',
  'Copenhagen',
  'Vein',
];

const eventTypes = new Map(
  [
    [1, {type:'taxi', name: 'Taxi', icon: 'taxi.png'}],
    [2, {type:'bus', name: 'Bus', icon: 'bus.png'}],
    [3, {type:'train', name: 'Train', icon: 'train.png'}],
    [4, {type:'ship', name: 'Ship', icon: 'ship.png'}],
    [5, {type:'transport', name: 'Transport', icon: 'transport.png'}],
    [6, {type:'drive', name: 'Drive', icon: 'drive.png'}],
    [7, {type:'flight', name: 'Flight', icon: 'flight.png'}],
    [8, {type:'check-in', name: 'Check-in', icon: 'check-in.png'}],
    [9, {type:'sightseeing', name: 'Sightseeing', icon: 'sightseeing.png'}],
    [10, {type:'restaurant', name: 'Restaurant', icon: 'restaurant.png'}],
  ],
);

const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'.split('.');

const eventProposition = new Map(
  [
    [1, {type: 'luggage', name: 'Add luggage', price: 30}],
    [2, {type: 'comfort', name: 'Switch to comfort', price: 100}],
    [3, {type: 'meal', name: 'Add meal', price: 15}],
    [4, {type: 'seats', name: 'Choose seats', price: 5}],
    [5, {type: 'train', name: 'Travel by train', price: 40}],
  ],
);

const createEventTime = (date = dayjs()) => {
  return dayjs(date)
    .add(getRandomNumber(0, DAYS), 'day')
    .add(getRandomNumber(0, HOURS), 'hour')
    .add(getRandomNumber(0, MINUTES), 'minute')
    .toDate();
};

const createEventStartTime = () => {
  return createEventTime();
};

const createEventEndTime = (date) => {
  return createEventTime(date);
};

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

const createEventOffers = () => {
  const offers = [];
  const index = getRandomNumber(0, eventProposition.size);
  for (let i = index; i > 0; i--) {
    offers.push({eventOfferName: eventProposition.get(i).name, evantOfferPrice: eventProposition.get(i).price});
  }
  return offers;
};

const getEventDestination = () => {
  const index = getRandomNumber(0, text.length - 1);
  let destination = '';
  for (let i = index; i > 0; i--) {
    destination += `${text[i]}.`;
  }
  return destination;
};

const getEventPhotos = () => {
  return new Array(getRandomNumber(0, 5)).fill().map(() => `http://picsum.photos/248/152?=${getRandomNumber(10, 1000)}`);
};

const createEvent = () => {
  const eventStartTime = createEventStartTime();
  const eventEndTime = createEventEndTime(eventStartTime);
  return {
    eventType: eventTypes.get(getRandomNumber(0, eventTypes.size)),
    eventCity: cities[getRandomNumber(0, cities.length - 1)],
    eventOffers: createEventOffers(),
    eventDestination: getEventDestination(),
    eventPhotos: getEventPhotos(),
    eventStartTime,
    eventEndTime,
    eventDuration: getEventDuration(eventStartTime, eventEndTime),
    eventTotal: getRandomNumber(1, 10000),
  };
};

export {createEvent, eventProposition, eventTypes, getEventDuration};
