import {Component, OnInit, Input, Inject} from '@angular/core';
import {webConfig} from '../../../../web-config';
import {AuthService} from '../../../../_/services/http/auth.service';
import {CustomerStatsService} from "../../../../_/components/ui/customer-stats-range/customer-stats-range.service";
import {ResizeService} from '../../../../_/services/ui/resize-service.service';
import {DOCUMENT} from "@angular/common";
import {addHours, differenceInDays, format, startOfWeek} from "date-fns";
import * as _ from "lodash";
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {Label} from "ng2-charts";
import * as pluginDataLabels from "chartjs-plugin-datalabels";

@Component({
  selector: 'app-athlete-energy-systems',
  templateUrl: './athlete-stats-energy-systems.component.html',
  styleUrls: ['./athlete-stats-energy-systems.component.scss']
})
export class AthleteStatsEnergySystemsComponent implements OnInit {
  @Input() isFromUrl = true;
  @Input() keepDates = true;
  @Input() resize: boolean = false;

  size: number = 1;
  responsiveSize: number = 768;

  links: any = {
    fatigueManagement: ['/athlete', 'stats'],
    trainingOverload: ['/athlete', 'stats', 'overload'],
    energySystems: ['/athlete', 'stats', 'energy']
  }

  stats: any = {
    power: {
      percent : 0
    },
    resistance: {
      percent : 0
    },
    endurance: {
      percent : 0
    },
  }

  categories: any = webConfig.categories;

  isCoach: boolean = false;

  sub: any = {};

  user: any = {
    data: {},
    profil: []
  };

  barPowerData: any = [];
  barResistanceData: any = [];
  barEnduranceData: any = [];

  barChartLabels: Label[] = [];
  barChartType: ChartType = "bar";
  barChartLegend = false;
  barChartPlugins = [pluginDataLabels];

  barChartData: ChartDataSets[] = [
    {
      data: [],
      label: "Endurance",
      backgroundColor: "#8f5ac3",
      hoverBackgroundColor: "#8f5ac3",
      maxBarThickness: 15,
    },
    {
      data: [],
      label: "Resistance",
      backgroundColor: "#c1c1c1",
      hoverBackgroundColor: "#c1c1c1",
      maxBarThickness: 15,
    },
    {
      data: [],
      label: "Power",
      backgroundColor: "#ff0502",
      hoverBackgroundColor: "#ff0502",
      maxBarThickness: 15,
    }
  ];

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        stacked: true,
        gridLines: {
          display: false
        }
      }],
      yAxes: [{
        stacked: true,
        ticks: {
          beginAtZero: true,
          stepSize: 1,
          min: 0
        },
        gridLines: {
          drawBorder: false
        }
      }]
    },
    plugins: {
      datalabels: {
        labels: {
          title: null,
        },
      },
    },
  };

  constructor(
    private authService: AuthService,
    private customerStatsService: CustomerStatsService,
    @Inject(DOCUMENT) private _document,
    private resizeSvc: ResizeService
  ) {

  }

  ngOnInit(): void {
    this.detectScreenSize();

    this.isCoach = this.authService.isCoach();
    this.isFromUrl = !this.isCoach;

    this.user = this.isFromUrl
      ? this.authService.getUserData()
      : this.authService.getUserClientData();


    if (this.isCoach) {
      this.links = {
        fatigueManagement: ['/coach', 'athlet', 'stats'],
        trainingOverload: ['/coach', 'athlet', 'stats', 'overload'],
        energySystems: ['/coach', 'athlet', 'stats', 'energy'],
      }
    }

    this.sub.onStatsUpdatedStart = this.customerStatsService.onStatsUpdatedStart.subscribe(
      () => {
        this._resetBarChart();
      }
    );

    this.sub.onStatsUpdated = this.customerStatsService.onStatsUpdated.subscribe(
      (component) => {
        this._initBarChart(component.startDay, component.endDay, component.workouts);
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.onStatsUpdated && this.sub.onStatsUpdated.unsubscribe();
    this.sub.onStatsUpdatedStart && this.sub.onStatsUpdatedStart.unsubscribe();
  }

  private _resetBarChart() {
    this.barChartData[0].data = [];
    this.barChartData[1].data = [];
    this.barChartData[2].data = [];

    this.barPowerData = [];
    this.barResistanceData = [];
    this.barEnduranceData = [];

    this.barChartLabels = [];
  }

  private _initBarChart(startDay, endDay, workouts) {

    this._resetBarChart();

    let currentDate = _.clone(startDay);
    let diff = Math.abs(differenceInDays(startDay, endDay));
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let isDaily = diff < 30;
    let modulo = isDaily ? 1 : 7;

    let totalWorkoutsPower = 0;
    let totalWorkoutsResistance = 0;
    let totalWorkoutsEndurance = 0;

    for (let i = 0; i <= diff; i++) {
      if (i % modulo == 0) {

        let property = format(currentDate, "yyyy-MM-dd");

        let propertyKey = days[currentDate.getDay()];
        if (diff > 6) {
          propertyKey = format(currentDate, "MM/dd");
        }

        this.barChartLabels.push(propertyKey);

        let selectedWorkouts = [];

        if (isDaily) {
          selectedWorkouts = workouts[property];
        } else {
          let startDay = startOfWeek(new Date(currentDate), { weekStartsOn: 1 });
          let selectedDay;
          for (let workoutKey in workouts) {
            selectedDay = startOfWeek(new Date(workoutKey), { weekStartsOn: 1 });
            if (
              format(startDay, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd")
            ) {
              selectedWorkouts = _.concat(selectedWorkouts, workouts[workoutKey]);
            }
          }
        }

        if (selectedWorkouts) {
          let totalPower = 0;
          let totalResistance = 0;
          let totalEndurance = 0;

          selectedWorkouts.map((workout) => {
            workout.program.exercices.map((exercice) => {

              let isCategoryCardio = false;
              let isCategoryStretching = false;

              exercice.movements &&
              exercice.movements.map((movement) => {
                let categoryId = this.categories[movement.category_id];

                if (categoryId == 1) {
                  isCategoryCardio = true;
                } else if (categoryId == 5) {
                  isCategoryStretching = true;
                }

                // Exercice simple
                if (exercice.type.id == 1) {

                  if (isCategoryCardio == true) {
                    totalEndurance++;
                  } else if (isCategoryStretching === false) {
                    totalPower++;
                  }

                  // Exercice complex
                } else if (exercice.type.id == 2) {

                  if (isCategoryCardio == true) {
                    totalResistance++;
                  } else if (isCategoryStretching === false) {
                    totalPower++;
                  }

                  // Exercice Timed
                } else if (exercice.type.id == 3 || exercice.type.id == 4 || exercice.type.id == 5) {

                  if (isCategoryStretching === false) {
                    totalResistance++;
                  }
                }
              });

              // Exercice Cardio / Intervals
              if (exercice.type.id == 7) {

                // Cardio
                if (exercice.cardio_scoring == 1) {
                  totalEndurance++

                  // Intervals
                } else if (exercice.cardio_scoring == 2) {
                  totalResistance++;
                }
              }

            });
          });

          totalWorkoutsPower += totalPower;
          totalWorkoutsResistance += totalResistance;
          totalWorkoutsEndurance += totalEndurance;

          this.barPowerData.push(totalPower);
          this.barResistanceData.push(totalResistance);
          this.barEnduranceData.push(totalEndurance);


        } else {
          this.barPowerData.push(0);
          this.barResistanceData.push(0);
          this.barEnduranceData.push(0);
        }
      }

      currentDate = addHours(currentDate, 24);
    }

    let totalExercice = totalWorkoutsPower + totalWorkoutsResistance + totalWorkoutsEndurance;

    this.stats.power.percent = Math.round(totalWorkoutsPower / totalExercice * 100);
    this.stats.resistance.percent = Math.round(totalWorkoutsResistance / totalExercice * 100);
    this.stats.endurance.percent = Math.round(totalWorkoutsEndurance / totalExercice * 100);

    this.barChartData[0].data = this.barEnduranceData;
    this.barChartData[1].data = this.barResistanceData;
    this.barChartData[2].data = this.barPowerData;
  }

  private detectScreenSize() {
    const currentSize = this._document.body.clientWidth;
    this.size = currentSize;
    this.resizeSvc.onResize(currentSize);
  }
}
