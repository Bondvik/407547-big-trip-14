import {setOptions} from '../utils/set-options.js';
import SmartView from './smart.js';
import {
  BAR_HEIGHT,
  getTypesUniq,
  getPriceByTripType,
  getCountByTripType,
  getDurationByTripType,
  humanizeDuration
} from '../utils/statistics.js';

export default class Statistics extends SmartView {
  constructor(events) {
    super();
    this._events = events;
    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this._setCharts();
  }

  _renderMoneyChart(moneyCtx, events) {
    // Метод для отрисовки графика финансовых расходов по каждому типу точки маршрута
    const totalPriceByTypes = getTypesUniq(events).map((item) => getPriceByTripType(events, item));
    moneyCtx.height = BAR_HEIGHT * getTypesUniq(events).length;

    setOptions(moneyCtx, getTypesUniq(events), totalPriceByTypes, (val) => `€ ${val}`);
  }

  _renderTypeChart(typeCtx, events) {
    // Метод для отрисовки графика количества того или иного типа точки маршрута
    const countByEventTypes = getTypesUniq(events).map((item) => getCountByTripType(events, item));
    typeCtx.height = BAR_HEIGHT * getTypesUniq(events).length;

    setOptions(typeCtx, getTypesUniq(events), countByEventTypes, (val) => `${val}x`);
  }

  _renderTimeChart(timeCtx, events) {
    // Метод для отрисовки графика затраченного времени относительно типа точки маршрута
    const durationEventTypes = getTypesUniq(events).map((item) => getDurationByTripType(events, item));
    timeCtx.height = BAR_HEIGHT * getTypesUniq(events).length;

    setOptions(timeCtx, getTypesUniq(events), durationEventTypes, (val) => `${humanizeDuration(val)}`);
  }

  getTemplate() {
    return (
      `<section class="statistics">
        <h2 class="visually-hidden">Trip statistics</h2>

        <div class="statistics__item statistics__item--money">
          <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
        </div>

        <div class="statistics__item statistics__item--transport">
          <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
        </div>

        <div class="statistics__item statistics__item--time-spend">
          <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
        </div>

    </section>`
    );
  }

  removeElement() {
    super.removeElement();
  }

  _setCharts() {
    // Для отрисовки трёх графиков
    if (![this._moneyChart, this._typeChart, this._timeChart].includes(null)) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }

    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeCtx = this.getElement().querySelector('.statistics__chart--time');

    this._moneyChart = this._renderMoneyChart(moneyCtx, this._events);
    this._typeChart = this._renderTypeChart(typeCtx, this._events);
    this._timeChart = this._renderTimeChart(timeCtx, this._events);
  }

  restoreHandlers() {
    this._setCharts();
  }
}
