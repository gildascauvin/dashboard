import { Component, OnInit, Input } from '@angular/core';
import { format, addHours, startOfISOWeek, startOfWeek, endOfWeek, differenceInDays } from 'date-fns';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import * as _ from 'lodash';

import { UsersService } from '../../../../_/templates/users.service';
import { CustomerStatsService } from '../customer-stats-range/customer-stats-range.service';

import { webConfig } from '../../../../web-config';

@Component({
  selector: 'app-customer-stats',
  templateUrl: './customer-stats.component.html',
  styleUrls: ['./customer-stats.component.scss']
})
export class CustomerStatsComponent implements OnInit {
	@Input() showCardio: boolean = true;

	stats: any = {
    weekly: {
      volume: [],
      tonnage: [],
      intensite: [],

      realIntensite: [],
      realIntensiteSize: [],

      volumeRound: 0,
      tonnageRound: 0,
      intensiteRound: 0,
    },
    categories: {},
    movements: {},
    cardio: {
      volume: [],
      intensity: [],
    },
  };

	barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
        }
      ]
    },
    plugins: {
      datalabels: {
        labels: {
          title: null
        },
      }
    }
  };

  barChartCardioOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
        }
      ]
    },
    plugins: {
      datalabels: {
        labels: {
          title: null
        },
        anchor: 'end',
        align: 'end',
      }
    }
  };

  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [pluginDataLabels];

  barChartData: ChartDataSets[] = [
    {
      data: this.stats.weekly.intensite,
      label: 'Intensité',
      backgroundColor: "#cc0202",
      hoverBackgroundColor: "#cc0202",
      barThickness: 4,
    },
    {
      data: this.stats.weekly.volume,
      label: 'Volume',
      backgroundColor: "#000000",
      hoverBackgroundColor: "#000000",
      barThickness: 4,
    },
    {
      data: this.stats.weekly.tonnage,
      label: 'Tonnage',
      backgroundColor: "#C1C1C1",
      hoverBackgroundColor: "#C1C1C1",
      barThickness: 4,
      yAxisID: 'y-axis-1'
    }
  ];

  barChartCardioData: ChartDataSets[] = [
    {
      data: this.stats.cardio.intensity,
      label: 'Intensity',
      backgroundColor: "#cc0202",
      hoverBackgroundColor: "#cc0202",
      barThickness: 4,
      yAxisID: 'y-axis-1',
    },{
      data: this.stats.cardio.volume,
      label: 'Volume',
      backgroundColor: "#000000",
      hoverBackgroundColor: "#000000",
      barThickness: 4,
    }
  ];

  isLoading: boolean = false;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  workouts: any[] = [];

  sub: any = {};

  tabs: any = [];
	movements: any = [];
  categoriesData: any = [];

  endDay: any = endOfWeek(new Date(), {weekStartsOn: 1});
  startDay: any = startOfWeek(new Date(), {weekStartsOn: 1});

  liveStats: any = {
    volume: 0,
    tonnage: 0,
    intensite: 0,
    intensiteSize: 0,
  };

  categories: any = webConfig.categories;

  constructor(
    private usersService: UsersService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
  	private customerStatsService: CustomerStatsService,
    ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 7);
  }

  ngOnInit(): void {
  	this.sub.onStatsUpdated = this.customerStatsService
  		.onStatsUpdated
  		.subscribe((component) => {
    		this.usersService = component.usersService;
				this.calendar = component.calendar;
				this.formatter = component.formatter;
				this.customerStatsService = component.customerStatsService;
				this.isLoading = component.isLoading;
				this.hoveredDate = component.hoveredDate;
				this.workouts = component.workouts;
				this.sub = component.sub;
				this.tabs = component.tabs;
				this.stats = component.stats;
				this.liveStats = component.liveStats;
				this.movements = component.movements;
				this.categoriesData = component.categoriesData;
				this.endDay = component.endDay;
				this.startDay = component.startDay;
				this.barChartOptions = component.barChartOptions;
				this.barChartCardioOptions = component.barChartCardioOptions;
				this.barChartLabels = component.barChartLabels;
				this.barChartType = component.barChartType;
				this.barChartLegend = component.barChartLegend;
				this.barChartPlugins = component.barChartPlugins;
				this.barChartData = component.barChartData;
				this.barChartCardioData = component.barChartCardioData;
				this.categories = component.categories;
				this.fromDate = component.fromDate;
				this.toDate = component.toDate;
    });

  	this.sub.onStatsUpdatedStart = this.customerStatsService
  		.onStatsUpdatedStart
  		.subscribe(() => {
  			this._clean();
  		});
  }

  ngOnDestroy(): void {
  	this.sub.onStatsUpdated && this.sub.onStatsUpdated.unsubscribe();
  	this.sub.onStatsUpdatedStart && this.sub.onStatsUpdatedStart.unsubscribe();
  }

  private _clean() {
    this.stats = {
      weekly: {
        volume: [],
        tonnage: [],
        intensite: [],
        realIntensite: [],
        realIntensiteSize: [],
        volumeRound: 0,
        tonnageRound: 0,
        intensiteRound: 0,
      },
      categories: {},
      movements: {},
      cardio: {
        volume: [],
        intensity: [],
      },
    };

    this.stats.categories[0] = this._setCategory('Others');
    this.stats.categories[1] = this._setCategory('Cardio');
    this.stats.categories[2] = this._setCategory('Olympic Weightlifting');
    this.stats.categories[3] = this._setCategory('Powerlifting');
    this.stats.categories[4] = this._setCategory('Strongman');
    this.stats.categories[5] = this._setCategory('Stretching');
    this.stats.categories[6] = this._setCategory('Plyometrics');
    this.stats.categories[7] = this._setCategory('General Strenght');

    this.movements = []
    this.categoriesData = [];

    this.barChartData[0].data = [];
    this.barChartData[1].data = [];
    this.barChartData[2].data = [];

    this.barChartCardioData[0].data = [];
    this.barChartCardioData[1].data = [];
  }

  private _setCategory(label) {
    return {
      label: label,
      volume: 0,
      tonnage: 0,
      intensite: 0,
      intensiteSize: 0,
      movements: [],
    }
  }
}
