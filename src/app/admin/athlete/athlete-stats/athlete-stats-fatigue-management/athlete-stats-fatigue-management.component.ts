import {Component, OnInit, Input, Inject} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {webConfig} from '../../../../web-config';
import {AuthService} from '../../../../_/services/http/auth.service';
import {CustomerStatsService} from "../../../../_/components/ui/customer-stats-range/customer-stats-range.service";
import {ResizeService} from '../../../../_/services/ui/resize-service.service';
import {DOCUMENT} from "@angular/common";
import {UsersService} from "../../../../_/templates/users.service";
import {addHours, differenceInDays, format} from "date-fns";
import * as _ from "lodash";
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {Label} from "ng2-charts";
import * as pluginDataLabels from "chartjs-plugin-datalabels";

@Component({
  selector: 'app-athlete-stats-fatigue-management',
  templateUrl: './athlete-stats-fatigue-management.component.html',
  styleUrls: ['./athlete-stats-fatigue-management.component.scss']
})
export class AthleteStatsFatigueManagementComponent implements OnInit {
  @Input() isFromUrl = true;
  @Input() keepDates = true;

  @Input() resize: boolean = false;

  lineRecoveryData: any = [];
  lineRpeData: any = [];

  lineDietData: any = [];
  lineSleepData: any = [];
  lineEnergyData: any = [];
  lineMoodData: any = [];
  lineStressData: any = [];

  lineChartLabels: Label[] = [];

  lineChartData: ChartDataSets[] = [
    {
      data: this.lineRecoveryData,
      label: "Recovery",
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
    },
    {
      data: this.lineRpeData,
      label: "RPE",
      fill: false,
      backgroundColor: "#D44000",
      borderColor: "#D44000",
      borderWidth: 3,
      pointStyle: 'circle',
      pointRadius: 7,
      pointBorderColor: '#D44000',
      pointBackgroundColor: '#fff',
      spanGaps: true
  },
    {
      data: this.lineDietData,
      label: "Diet",
      fill: false,
      backgroundColor: "#D44000",
      borderColor: "#D44000",
      borderWidth: 2,
      borderDash: [8, 4],
      pointStyle: 'dash',
      pointRadius: 7,
      pointBorderColor: '#D44000',
      pointBackgroundColor: '#fff',
      spanGaps: true
    },
    {
      data: this.lineSleepData,
      label: "Sleep",
      fill: false,
      backgroundColor: "#000",
      borderColor: "#000",
      borderWidth: 2,
      borderDash: [8, 4],
      pointStyle: 'dash',
      pointRadius: 7,
      pointBorderColor: '#000',
      pointBackgroundColor: '#fff',
      spanGaps: true
    },
    {
      data: this.lineEnergyData,
      label: "Energy",
      fill: false,
      backgroundColor: "#c1c1c1",
      borderColor: "#c1c1c1",
      borderWidth: 2,
      borderDash: [8, 4],
      pointStyle: 'dash',
      pointRadius: 7,
      pointBorderColor: '#c1c1c1',
      pointBackgroundColor: '#fff',
      spanGaps: true
    },
    {
      data: this.lineMoodData,
      label: "Mood",
      fill: false,
      backgroundColor: "#e37242",
      borderColor: "#e37242",
      borderWidth: 2,
      borderDash: [8, 4],
      pointStyle: 'dash',
      pointRadius: 7,
      pointBorderColor: '#e37242',
      pointBackgroundColor: '#fff',
      spanGaps: true
    },
    {
      data: this.lineStressData,
      label: "Stress",
      fill: false,
      backgroundColor: "#8d6767",
      borderColor: "#8d6767",
      borderWidth: 2,
      borderDash: [8, 4],
      pointStyle: 'dash',
      pointRadius: 7,
      pointBorderColor: '#8d6767',
      pointBackgroundColor: '#fff',
      spanGaps: true
    },
  ];
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
            stepSize: 2,
            padding: 10,
            min: 0,
            max: 10
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


  bsModalRef: BsModalRef;
  profileRef: any;

  currentTab: number = 0;

  sub: any = {};

  energiesData : any = [
    {title: 'diet', percentage: 0, average: 0, icon: 'logo-diet'},
    {title: 'sleep', percentage: 0, average: 0, icon: 'logo-sleep'},
    {title: 'energy', percentage: 0, average: 0, icon: 'logo-power'},
    {title: 'mood', percentage: 0, average: 0, icon: 'logo-mood'},
    {title: 'stress', percentage: 0, average: 0, icon: 'logo-stress'},
  ];

  size: number = 1;
  responsiveSize: number = 768;

  user: any = {
    data: {},
    profil: []
  };

  isLoading = false;

  configMrv = webConfig.mrv;

  isCoach: boolean = false;

  links: any = {
    fatigueManagement: ['/athlete', 'stats'],
    trainingOverload: ['/athlete', 'stats', 'overload'],
    energySystems: ['/athlete', 'stats', 'energy']
  }

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
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
        this.lineChartData[0].data = [];
        this.lineChartData[1].data = [];

        this.lineRecoveryData = [];
        this.lineRpeData = [];
        this.lineChartLabels = [];

        this.lineDietData = [];
        this.lineSleepData = [];
        this.lineEnergyData = [];
        this.lineMoodData = [];
        this.lineStressData = [];
      }
    );

    this.sub.onStatsUpdated = this.customerStatsService.onStatsUpdated.subscribe(
      (component) => {
        this._initLineChart(component.startDay, component.endDay, component.workouts);
        this._initReadinessBreakdown(component.workouts);
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.onStatsUpdated && this.sub.onStatsUpdated.unsubscribe();
    this.sub.onStatsUpdatedStart && this.sub.onStatsUpdatedStart.unsubscribe();
  }

  private _initReadinessBreakdown(workouts) {

    this.energiesData[0].percentage = 0;
    this.energiesData[1].percentage = 0;
    this.energiesData[2].percentage = 0;
    this.energiesData[3].percentage = 0;
    this.energiesData[4].percentage = 0;

    this.energiesData[0].average = 0;
    this.energiesData[1].average = 0;
    this.energiesData[2].average = 0;
    this.energiesData[3].average = 0;
    this.energiesData[4].average = 0;

    let diet = 0, sleep = 0, energy = 0, mood = 0, stress = 0;
    let dietLength = 0, sleepLength = 0, energyLength = 0, moodLength = 0, stressLength = 0;

    for (let workoutDay in workouts) {
      let dayWorkouts = workouts[workoutDay];

      for (let workoutKey in dayWorkouts) {
        let workout = dayWorkouts[workoutKey];

        let currentDiet = parseInt(workout.diet);
        let currentSleep = parseInt(workout.sleep);
        let currentEnergy = parseInt(workout.energy);
        let currentMood = parseInt(workout.mood);
        let currentStress = parseInt(workout.stress);

        if (currentDiet > 0) { diet += currentDiet / 5 * 10; dietLength++;}
        if (currentSleep > 0) { sleep += currentSleep / 5 * 10; sleepLength++;}
        if (currentEnergy > 0) { energy += currentEnergy / 5 * 10; energyLength++;}
        if (currentMood > 0) { mood += currentMood / 5 * 10; moodLength++;}
        if (currentStress > 0) { stress += currentStress / 5 * 10; stressLength++;}
      }
    }

    if (dietLength > 0) {
      this.energiesData[0].percentage = (diet / dietLength) * 10;
      this.energiesData[0].average = Math.round(diet / dietLength);
    }

    if (sleepLength > 0) {
      this.energiesData[1].percentage = (sleep / sleepLength) * 10;
      this.energiesData[1].average = Math.round(sleep / sleepLength);
    }

    if (energyLength > 0) {
      this.energiesData[2].percentage = (energy / energyLength) * 10;
      this.energiesData[2].average = Math.round(energy / energyLength);
    }

    if (moodLength > 0) {
      this.energiesData[3].percentage = (mood / moodLength) * 10;
      this.energiesData[3].average = Math.round(mood / moodLength);
    }

    if (stressLength > 0) {
      this.energiesData[4].percentage = (stress / stressLength) * 10;
      this.energiesData[4].average = Math.round(stress / stressLength);
    }
  }

  private _initLineChart(startDay, endDay, workouts) {
    this.lineChartData[0].data = [];
    this.lineChartData[1].data = [];

    this.lineChartData[2].data = [];
    this.lineChartData[3].data = [];
    this.lineChartData[4].data = [];
    this.lineChartData[5].data = [];
    this.lineChartData[6].data = [];

    this.lineRecoveryData = [];
    this.lineRpeData = [];
    this.lineChartLabels = [];

    this.lineDietData = [];
    this.lineSleepData = [];
    this.lineEnergyData = [];
    this.lineMoodData = [];
    this.lineStressData = [];

    let currentDate = _.clone(startDay);
    let diff = Math.abs(differenceInDays(startDay, endDay));
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i <= diff; i++) {
      let property = format(currentDate, "yyyy-MM-dd");

      let propertyKey = days[currentDate.getDay()];
      if (diff > 6) {
         propertyKey = format(currentDate, "MM/dd");
      }

      this.lineChartLabels.push(propertyKey);

      currentDate = addHours(currentDate, 24);

      if (workouts[property]) {

        let dayWorkouts = workouts[property];

        let recoveryScores = 0;
        let recoveryScoresLength = 0;
        let rpeScores = 0;
        let rpeScoresLength = 0;

        let dietScores = 0;
        let dietScoresLength = 0;
        let sleepScores = 0;
        let sleepScoresLength = 0;
        let energyScores = 0;
        let energyScoresLength = 0;
        let moodScores = 0;
        let moodScoresLength = 0;
        let stressScores = 0;
        let stressScoresLength = 0;


        for (let workoutKey in dayWorkouts) {
          let workoutRecoveryScore = this._computeEnergyScore(dayWorkouts[workoutKey]);

          if (workoutRecoveryScore > 0) {
            recoveryScores += workoutRecoveryScore;
            recoveryScoresLength++;
          }
          if (dayWorkouts[workoutKey].rate > 0) {
            rpeScores += dayWorkouts[workoutKey].rate;
            rpeScoresLength++;
          }

          if (dayWorkouts[workoutKey].diet > 0)   {dietScores += dayWorkouts[workoutKey].diet; dietScoresLength++;}
          if (dayWorkouts[workoutKey].sleep > 0)  {sleepScores += dayWorkouts[workoutKey].sleep; sleepScoresLength++;}
          if (dayWorkouts[workoutKey].energy > 0) {energyScores += dayWorkouts[workoutKey].energy; energyScoresLength++;}
          if (dayWorkouts[workoutKey].mood > 0)   {moodScores += dayWorkouts[workoutKey].mood; moodScoresLength++;}
          if (dayWorkouts[workoutKey].stress > 0) {stressScores += dayWorkouts[workoutKey].stress; stressScoresLength++;}
        }

        this.lineRecoveryData.push((recoveryScoresLength > 0) ? Math.round(((recoveryScores / recoveryScoresLength / 10) + Number.EPSILON) * 100) / 100 : null);
        this.lineRpeData.push((rpeScoresLength > 0) ? Math.round(((rpeScores / rpeScoresLength) + Number.EPSILON) * 100) / 100 : null);

        this.lineDietData.push((dietScoresLength > 0) ? Math.round(((dietScores / dietScoresLength / 5 * 10) + Number.EPSILON) * 100) / 100 : null);
        this.lineSleepData.push((sleepScoresLength > 0) ? Math.round(((sleepScores / sleepScoresLength / 5 * 10) + Number.EPSILON) * 100) / 100 : null);
        this.lineEnergyData.push((energyScoresLength > 0) ? Math.round(((energyScores / energyScoresLength / 5 * 10) + Number.EPSILON) * 100) / 100 : null);
        this.lineMoodData.push((moodScoresLength > 0) ? Math.round(((moodScores / moodScoresLength / 5 * 10) + Number.EPSILON) * 100) / 100 : null);
        this.lineStressData.push((stressScoresLength > 0) ? Math.round(((stressScores / stressScoresLength / 5 * 10) + Number.EPSILON) * 100) / 100 : null);

      } else {
        this.lineRecoveryData.push(null);
        this.lineRpeData.push(null);

        this.lineDietData.push(null);
        this.lineSleepData.push(null);
        this.lineEnergyData.push(null);
        this.lineMoodData.push(null);
        this.lineStressData.push(null);
      }
    }

    this.lineChartData[0].data = this.lineRecoveryData;
    this.lineChartData[1].data = this.lineRpeData;

    this.lineChartData[2].data = this.lineDietData;
    this.lineChartData[3].data = this.lineSleepData;
    this.lineChartData[4].data = this.lineEnergyData;
    this.lineChartData[5].data = this.lineMoodData;
    this.lineChartData[6].data = this.lineStressData;
  }

  private _computeEnergyScore(workout) {
    let diet = parseInt(workout.diet);
    let sleep = parseInt(workout.sleep);
    let mood = parseInt(workout.mood);
    let energy = parseInt(workout.energy);
    let stress = parseInt(workout.stress);

    let energyDatas = [diet, sleep, mood, energy, stress];

    let totalEnergy = 0;
    let totalDataConfirmed = 0;
    energyDatas.forEach(function (data) {
      if (data > 0) {
        totalDataConfirmed++
        totalEnergy += data;
      }
    });

    return (totalDataConfirmed > 0) ? totalEnergy / (5 * totalDataConfirmed) * 100 : 0;
  }

  private detectScreenSize() {
    const currentSize = this._document.body.clientWidth;
    this.size = currentSize;
    this.resizeSvc.onResize(currentSize);
  }
}
