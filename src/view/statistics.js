import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';

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
    // Метод для отрисовки графика финансовых расходов по каждому типу точек маршрута
    return new Chart(moneyCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: ['TAXI', 'BUS', 'TRAIN', 'SHIP', 'TRANSPORT', 'DRIVE'],
        datasets: [{
          data: [400, 300, 200, 160, 150, 100],
          backgroundColor: '#ffffff',
          hoverBackgroundColor: '#ffffff',
          anchor: 'start',
        }],
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13,
            },
            color: '#000000',
            anchor: 'end',
            align: 'start',
            formatter: (val) => '€ ${val}',
          },
        },
        title: {
          display: true,
          text: 'MONEY',
          fontColor: '#000000',
          fontSize: 23,
          position: 'left',
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#000000',
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            minBarLength: 50,
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
  }

  _renderTypeChart(typeCtx, events) {
    // Метод для отрисовки графика количества того или иного типа точки маршрута
  }

  _renderTimeChart(timeCtx, events) {
    // Метод для отрисовки графика затраченного времени относительно типа точки маршрута
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

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    // Для отрисовки трёх графиков
    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }

    const moneyCtx = document.querySelector('.statistics__chart--money');
    const typeCtx = document.querySelector('.statistics__chart--transport');
    const timeCtx = document.querySelector('.statistics__chart--time');

    this._moneyChart = this._renderMoneyChart(moneyCtx, this._events);
    this._typeChart = this._renderTypeChart(typeCtx, this._events);
    this._timeChart = this._renderTimeChart(timeCtx, this._events);
  }
}
