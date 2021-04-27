import dayjs from 'dayjs';

const SortType = {
  DEFAULT: 'default',
  TIME: 'time',
  PRICE: 'price',
};

//Источник: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomNumber = function(min, max) {
  let minValue =  Math.ceil(min);
  let maxValue = Math.floor(max);
  if (min < 0 || max < 0) {
    return;
  }
  if (min === max) {
    return min;
  }
  if (min > max) {
    minValue = Math.ceil(max);
    maxValue = Math.floor(min);
  }
  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
};

const updateItem = (items, updatedPoint) => {
  const index = items.findIndex((item) => item.id === updatedPoint.id);
  if (index >= 0) {
    items.splice(index, 1, updatedPoint);
  }
  return items;
};

const compareEventPrice = (prevEvent, nextEvent) => nextEvent.eventTotal - prevEvent.eventTotal;

// Функция помещает задачи без даты в конце списка,
// возвращая нужный вес для колбэка sort
const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortEventDown = (prevEvent, nextEvent) => {
  const weight = getWeightForNullDate(prevEvent.eventDuration, nextEvent.eventDuration);

  if (weight !== null) {
    return weight;
  }
  console.log(dayjs(nextEvent.eventDuration).diff(dayjs(prevEvent.eventDuration)))
  return dayjs(nextEvent.eventDuration).diff(dayjs(prevEvent.eventDuration));
};

export {getRandomNumber, updateItem, SortType, sortEventDown, compareEventPrice};
