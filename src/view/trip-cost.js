const createTripCostTemplate = (events) => {

  const tripPriceOutOffers = events
    .reduce((accumulator, currentValue) => accumulator + currentValue.eventTotal, 0);

  //вытянуть вложенные подмассивы
  const getCheckOffers = events.map((item) => item.eventOffers).flat();

  const offersPrice = getCheckOffers
    .map((element) => element.evantOfferPrice)
    .reduce((accumulator, currentValue) =>accumulator + currentValue, 0);

  const tripTotalPrice = tripPriceOutOffers + offersPrice;

  return (
    `<p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripTotalPrice}</span>
      </p>`
  );
};

export {createTripCostTemplate};
