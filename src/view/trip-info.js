import dayjs from 'dayjs';

const createTripInfoTemplate = (events) => {
  //Сортирую получные данные по дате
  const sortTripByDate = events
    .sort((a, b) => a.eventStartTime.getTime() - b.eventStartTime.getTime());
  const getTripCities = () => {
    const cities = sortTripByDate
      .map((item) => (item.eventCity));
    if (cities.length > 3) {
      return `${cities[0]}&mdash; ... &mdash;${cities[[cities.length - 1]]}`;
    } else {
      return cities
        .map((item, index) => (index === cities.length - 1) ? `${item}` : `${item}&mdash;`)
        .join('');
    }
  };
  const getStartEndDateByTrip = () => {
    return `${dayjs(sortTripByDate[0].eventStartTime).format('MMM DD')}&nbsp;&mdash;&nbsp;
    ${dayjs(sortTripByDate[sortTripByDate.length - 1].eventStartTime).format('MMM DD')}`;
  };
  return (
    `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
            <h1 class="trip-info__title">${getTripCities()}</h1>
            <p class="trip-info__dates">${getStartEndDateByTrip()}</p>
        </div>
      </section>`
  );
};

export {createTripInfoTemplate};
