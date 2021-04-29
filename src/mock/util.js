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

const sortEventDown = (prevEvent, nextEvent) => (nextEvent.eventEndTime - nextEvent.eventStartTime) - (prevEvent.eventEndTime - prevEvent.eventStartTime);

export {getRandomNumber, updateItem, SortType, sortEventDown, compareEventPrice};
