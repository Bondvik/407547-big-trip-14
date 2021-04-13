import {getRandomNumber} from '../mock/util.js';

const createFilterItemTemplate = ({name, count}) => (
  `<div class="trip-filters__filter">
    <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${(getRandomNumber(0, 1)) ? 'checked' : ''}${count === 0 ? 'disabled' : ''}>
    <label class="trip-filters__filter-label" for="filter-${name}">${name} <span class="filter__${name}-count">${count}</span></label>
  </div>`
);

const createFilterListTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems.reduce((accumulator, filter) => accumulator + createFilterItemTemplate(filter), '');
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export {createFilterListTemplate};
