import dayjs from 'dayjs';

const createTripInfoTemplate = (events) => {
  //Сортирую получные данные по дате
  const sortTripByDate = events.sort((prev, next) => prev.eventStartTime.getTime() - next.eventStartTime.getTime());
  const getTripCities = () => {
    const cities = sortTripByDate.map(({eventCity}) => eventCity);
    if (cities.length > 3) {
      return `${cities[0]} &mdash; ... &mdash; ${cities[[cities.length - 1]]}`;
    }
    return cities.join(' &mdash; ');
  };
  const startDate = `${dayjs(sortTripByDate[0].eventStartTime).format('MMM DD')}`;
  const endDate = `${dayjs(sortTripByDate[sortTripByDate.length - 1].eventStartTime).format('MMM DD')}`;
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${getTripCities()}</h1>
        <p class="trip-info__dates">${startDate} &mdash; ${endDate}</p>
      </div>
    </section>`
  );
};

export {createTripInfoTemplate};
