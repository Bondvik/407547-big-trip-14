const createTripCostTemplate = (events) => {

  // const tripPriceOutOffers = events
  //   .reduce((accumulator, currentValue) => accumulator + currentValue.eventTotal, 0);

  //вытянуть вложенные подмассивы
  const offersPrice = events.reduce((accumulator, item) => {
    const offers = item.eventOffers;
    accumulator.offer += calculateAllEvantOfferPrice(offers);
    accumulator.trip += item.eventTotal;
    return accumulator;
  }, { trip: 0, offer: 0 });

  // const getCheckOffers = events.map((item) => item.eventOffers).flat();

  // const offersPrice = getCheckOffers
  //   .reduce((accumulator, item) => accumulator + item.evantOfferPrice, 0);

  const tripTotalPrice = offersPrice.trip + offersPrice.offer;

  return (
    `<p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripTotalPrice}</span>
      </p>`
  );
};

const calculateAllEvantOfferPrice = (offers) => {
  return offers.reduce((accumulator, offer) => {
    return accumulator + offer.evantOfferPrice;
  }, 0);
};

export { createTripCostTemplate };
