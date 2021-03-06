import FilterView from '../view/filter.js';
import {render, PositionOfRender, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';

export default class Filter {
  constructor(filterContainer, filterModel, eventsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._eventsModel = eventsModel;

    this._filterComponent = null;

    this._handleFiltertModelCreate = this._handleFiltertModelCreate.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleFiltertModelCreate);
    this._filterModel.addObserver(this._handleFiltertModelCreate);
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.filter);

    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, PositionOfRender.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  get filters() {
    const events = this._eventsModel.getEvents();

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'everything',
        count: filter[FilterType.EVERYTHING](events).length,
      },
      {
        type: FilterType.FUTURE,
        name: 'future',
        count: filter[FilterType.FUTURE](events).length,
      },
      {
        type: FilterType.PAST,
        name: 'past',
        count: filter[FilterType.PAST](events).length,
      },
    ];
  }

  _handleFiltertModelCreate() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.filter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
