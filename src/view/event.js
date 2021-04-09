import dayjs from 'dayjs';
import {getEventDuration} from '../mock/event.js';
import {getRandomNumber} from '../mock/util.js';

const createEventTemplate = (event) => {
  const getOffers = () => {
    return event.eventOffers.reduce((accumulator, item) => {
      accumulator += `<li class="event__offer">
        <span class="event__offer-title">${item.eventOfferName}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${item.evantOfferPrice}</span>
        </li>`;
      return accumulator;
    }, '');
  };
  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">${dayjs(event.eventStartTime).format('MMM DD')}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${event.eventType.icon}" alt="Event type icon">
        </div>
        <h3 class="event__title">${event.eventType.name} ${event.eventCity}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${dayjs(event.eventStartTime).format('HH:mm')}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${dayjs(event.eventEndTime).format('HH:mm')}</time>
          </p>
          <p class="event__duration">${getEventDuration(event.eventStartTime, event.eventEndTime)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${event.eventTotal}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${getOffers()}
        </ul>
        <button class="event__favorite-btn ${(getRandomNumber(0, 1)) ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export {createEventTemplate};
