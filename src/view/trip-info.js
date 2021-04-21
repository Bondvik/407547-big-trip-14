import dayjs from 'dayjs';
import AbstractView from './abstract.js';

export default class TripInfo extends AbstractView{
  constructor(events) {
    super();
    this._events = events;
  }

  _getSortTripByDate() {
    //Сортирую получные данные по дате
    return this._events.sort((prev, next) => prev.eventStartTime.getTime() - next.eventStartTime.getTime());
  }

  _getTripCities(sortingTrip) {
    const cities = sortingTrip.map(({eventCity}) => eventCity);
    if (cities.length > 3) {
      return `${cities[0]} &mdash; ... &mdash; ${cities[[cities.length - 1]]}`;
    }
    return cities.join(' &mdash; ');
  }

  getTemplate() {
    const sortTripByDate = this._getSortTripByDate();
    const startDate = `${dayjs(sortTripByDate[0].eventStartTime).format('MMM DD')}`;
    const endDate = `${dayjs(sortTripByDate[sortTripByDate.length - 1].eventStartTime).format('MMM DD')}`;
    return (
      `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${this._getTripCities(sortTripByDate)}</h1>
          <p class="trip-info__dates">${startDate} &mdash; ${endDate}</p>
        </div>
      </section>`
    );
  }
}
