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

  lineEnergyData: any = [];
  lineRpeData: any = [];
  lineChartLabels: Label[] = [];

  lineChartData: ChartDataSets[] = [
    {
      data: this.lineEnergyData,
      label: "Energy",
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

        this.lineEnergyData = [];
        this.lineRpeData = [];
        this.lineChartLabels = [];
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

        if (currentDiet > 0) { diet += currentDiet / 3 * 10; dietLength++;}
        if (currentSleep > 0) { sleep += currentSleep / 3 * 10; sleepLength++;}
        if (currentEnergy > 0) { energy += currentEnergy / 3 * 10; energyLength++;}
        if (currentMood > 0) { mood += currentMood / 3 * 10; moodLength++;}
        if (currentStress > 0) { stress += currentStress / 3 * 10; stressLength++;}
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

    this.lineEnergyData = [];
    this.lineRpeData = [];
    this.lineChartLabels = [];

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

        let energyScores = 0;
        let energyScoresLength = 0;
        let rpeScores = 0;
        let rpeScoresLength = 0;

        for (let workoutKey in dayWorkouts) {
          let workoutEnergyScore = this._computeEnergyScore(dayWorkouts[workoutKey]);

          if (workoutEnergyScore > 0) {
            energyScores += workoutEnergyScore;
            energyScoresLength++;
          }
          if (dayWorkouts[workoutKey].rate > 0) {
            rpeScores += dayWorkouts[workoutKey].rate;
            rpeScoresLength++;
          }
        }

        this.lineEnergyData.push((energyScoresLength > 0) ? Math.round(((energyScores / energyScoresLength / 10) + Number.EPSILON) * 100) / 100 : null);
        this.lineRpeData.push((rpeScoresLength > 0) ? Math.round(((rpeScores / rpeScoresLength) + Number.EPSILON) * 100) / 100 : null);
      } else {
        this.lineEnergyData.push(null);
        this.lineRpeData.push(null);
      }
    }

    this.lineChartData[0].data = this.lineEnergyData;
    this.lineChartData[1].data = this.lineRpeData;
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

    return (totalDataConfirmed > 0) ? totalEnergy / (3 * totalDataConfirmed) * 100 : 0;
  }

  private detectScreenSize() {
    const currentSize = this._document.body.clientWidth;
    this.size = currentSize;
    this.resizeSvc.onResize(currentSize);
  }
}
