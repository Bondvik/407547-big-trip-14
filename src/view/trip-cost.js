import AbstractView from './abstract.js';

export default class TripCost extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }

  _getTotalPriceOfAllEvents(offers) {
    return offers.reduce((accumulator, offer) => accumulator + offer.price, 0);
  }

  getTemplate(events = this._events) {
    const offersPrice = {
      trip: 0,
      offer: 0,
    };
    events.forEach(({eventOffers, eventTotal}) => {
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
