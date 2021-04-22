import AbstractView from './abstract.js';

export default class TripCost extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }

  _getTotalPriceOfAllEvents(offers) {
    return offers.reduce((accumulator, offer) => accumulator + offer.evantOfferPrice, 0);
  }

  getTemplate() {
    const offersPrice = {
      trip: 0,
      offer: 0,
    };
    this._events.forEach(({eventOffers, eventTotal}) => {
      offersPrice.trip += eventTotal;
      offersPrice.offer += this._getTotalPriceOfAllEvents(eventOffers);
    });
    const tripTotalPrice = offersPrice.trip + offersPrice.offer;
    return (
      `<p class="trip-info__cost">
        Total:&nbsp;&euro;&nbsp;<span class="trip-info__cost-value">${tripTotalPrice}</span>
      </p>`
    );
  }
}
