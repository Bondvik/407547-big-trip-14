const createTripCostTemplate = (events) => {
  const offersPrice = {
    trip: 0,
    offer: 0,
  };
  events.forEach(({eventOffers, eventTotal}) => {
    offersPrice.trip += eventTotal;
    offersPrice.offer += getTotalPriceOfAllEvents(eventOffers);
  });
  const tripTotalPrice = offersPrice.trip + offersPrice.offer;
  return (
    `<p class="trip-info__cost">
      Total:&euro;&nbsp;<span class="trip-info__cost-value">${tripTotalPrice}</span>
    </p>`
  );
};

const getTotalPriceOfAllEvents = (offers) => {
  return offers.reduce((accumulator, offer) => accumulator + offer.evantOfferPrice, 0);
};

export {createTripCostTemplate};
