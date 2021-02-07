import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import * as _ from 'lodash';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-customer-profile-level',
  templateUrl: './customer-profile-level.component.html',
  styleUrls: ['./customer-profile-level.component.scss'],
})
export class CustomerProfileLevelComponent implements OnInit {
  @Input() user: any = {
    data: {},
    profil: [],
  };
  @Input() resize: boolean = false;

  // Radar
  public radarChartOptions: RadialChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scale: {
      ticks: { min: 0 },
    },
    plugins: {
      datalabels: {
        labels: {
          title: null,
        },
        anchor: 'end',
        align: 'end',
      },
    },
  };

  //
  public radarChartLabels: Label[] = [
    'Back Squat',
    'Rope Jumping',
    'Front-To-Back Squat With Belt',
    'Backward Drag',
    'Defensive Slide',
  ];

  public radarChartData: ChartDataSets[] = [
    {
      data: [150, 120, 89, 120, 90],
      label: 'Your RM',
      backgroundColor: null,
      borderColor: '#000000',
    },
    {
      data: [150, 120, 89, 120, 90],
      label: 'Goal',
      backgroundColor: null,
      borderColor: '#FF0000',
    },
    // { data: [12, 32, 43, 57, 90], label: 'Intensity' },
  ];

  public radarChartType: ChartType = 'radar';

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes) {
    this._initChart();
  }

  private _initChart() {
    this.radarChartData[0].data = [];
    this.radarChartData[1].data = [];
    this.radarChartLabels = [];

    let radarChartLabels = [];
    let radarChartData = [];
    let radarChartDataTwo = [];
    _.forEach(this.user.profil, (profil) => {
      if (profil.ratio_value && profil.ratio_value !== profil.record) {
        if (this.user.data.max_ref_id === profil.movement_id) {
          radarChartData.push(profil.record);
          radarChartDataTwo.push(profil.record);
          radarChartLabels.push(profil.movement.name);
        } else {
          radarChartData.push(profil.record);
          radarChartDataTwo.push(profil.ratio_value);
          radarChartLabels.push(profil.movement.name);
        }
      }
    });

    this.radarChartData[0].data = radarChartData;
    this.radarChartData[1].data = radarChartDataTwo;
    this.radarChartLabels = radarChartLabels;
  }
}
