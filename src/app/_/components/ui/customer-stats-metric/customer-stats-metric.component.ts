import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import * as _ from 'lodash';
import {Label} from "ng2-charts";
import {AthleteProfileService} from "../../../../admin/athlete/athlete-profile/athlete-profile.service";
import {DoorgetsTranslateService} from "doorgets-ng-translate";

@Component({
  selector: 'app-customer-stats-metric',
  templateUrl: './customer-stats-metric.component.html',
  styleUrls: ['./customer-stats-metric.component.scss'],
})
export class CustomerStatsMetricComponent implements OnInit {
  @Input() resize: boolean = false;
  @Input() metric: any = {};

  @Output() onUnSelectedMetric: EventEmitter<any> = new EventEmitter();

  sub: any = {};

  lineMetricData: any = [];
  lineChartLabels: Label[] = [];

  lineChartData: ChartDataSets[] = [
    {
      data: this.lineMetricData,
      label: "Metric",
      fill: false,
      backgroundColor: "#000",
      borderColor: "#000",
      barThickness: 4,
      borderWidth: 3,
      pointStyle: 'circle',
      pointRadius: 7,
      pointBorderColor: '#000',
      pointBackgroundColor: '#fff',
      spanGaps: true
    }];

  lineChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      labels: {
        usePointStyle: true,
        fontSize: 10,
        fontStyle: 'weight',
        padding: 20
      }
    },
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          id: "y-axis-0",
          position: "left",
          ticks: {
            beginAtZero: true,
            //stepSize: 2,
            padding: 10,
            //min: 0,
            //max: 10
          },
          gridLines: {
            drawBorder: false
          }
        }
      ],
      xAxes: [
        {
          gridLines: {
            display: false
          }
        }
      ],
    },
    plugins: {datalabels: {labels: {title: null}}}
  };
  lineChartPlugins = [pluginDataLabels];
  lineChartLegend = true;
  lineChartType: ChartType = "line";

  constructor(
    private athleteProfileService: AthleteProfileService,
    private doorgetsTranslateService: DoorgetsTranslateService,
  ) {
  }

  ngOnInit(): void {
    this.lineChartData[0].label = this.doorgetsTranslateService.instant('#Metric');

    this.sub.metricSelected = this.athleteProfileService.onSelectedMetric.subscribe((metric: any) => {
      this.metric = metric;
      this._initMetric();
    });

    this._initMetric();
  }

  ngOnDestroy(): void {
    this.sub.metricSelected && this.sub.metricSelected.unsubscribe();
  }

  _initMetric() {
    this._resetMetric();

    let results = _.cloneDeep(this.metric.results);

    if (results) {
      for(let resultId in results.reverse()) {
        let result = results[resultId];
        let date = result.date.split(' ');

        this.lineChartLabels.push(date[0]);
        this.lineMetricData.push(parseInt(result.result));
      }

      this.lineChartData[0].data = this.lineMetricData;
    }
  }

  close() {
    this.athleteProfileService.onUnSelectedMetric.emit();
  }

  _resetMetric() {
    this.lineChartLabels = [];
    this.lineMetricData = [];
    this.lineChartData[0].data = [];
  }
}
