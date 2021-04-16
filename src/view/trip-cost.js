import {createElement} from '../mock/util.js';

export default class TripCost {
  constructor(events) {
    this._events = events;
    this._element = null;
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

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
