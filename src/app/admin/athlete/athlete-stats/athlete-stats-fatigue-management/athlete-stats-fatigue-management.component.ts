import {Component, OnInit, Input, Inject} from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {webConfig} from '../../../../web-config';
import {AuthService} from '../../../../_/services/http/auth.service';
import {CustomerStatsService} from "../../../../_/components/ui/customer-stats-range/customer-stats-range.service";
import {StandardDeviationCore} from "../../../../_/core/standard-deviation.core";
import {ngxLightOptions} from 'ngx-light-carousel/public-api';
import {ResizeService} from '../../../../_/services/ui/resize-service.service';
import {DOCUMENT} from "@angular/common";
import {CustomerStatsComputerService} from "../../../../_/services/stats/customer-stats-computer.service";
import {UsersService} from "../../../../_/templates/users.service";
import {addHours, differenceInDays, endOfWeek, format} from "date-fns";
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

  data: any = {
    standardDeviation: 0,
    monotony: 0,
    constraint: 0,
    fitness: 0,
    energyScore: 0,
    rcac: 0
  };

  energiesData : any = [
    {title: 'diet', percentage: 0, average: 0, icon: 'logo-alt-re'},
    {title: 'sleep', percentage: 0, average: 0, icon: 'logo-power'},
    {title: 'energy', percentage: 0, average: 0, icon: 'logo-plyo'},
    {title: 'mood', percentage: 0, average: 0, icon: 'logo-stretch'},
    {title: 'stress', percentage: 0, average: 0, icon: 'logo-cardio'},
  ];

  size: number = 1;
  responsiveSize: number = 768;

  fatigueManagement: any = {
    load: {constraint: 0, rcac: 0},
    variation: {monotony: 0},
    fitness: {fitness: 0, energyScore: 0},
    colors: {
      load: {color1: '', color2: ''},
      variation: {percent: 0},
      fitness: {color1: ''}
    }
  };

  carouselOptions: ngxLightOptions;
  carouselData: any = [];

  user: any = {
    data: {},
    profil: []
  };

  isLoading = false;

  configMrv = webConfig.mrv;

  isCoach: boolean = false;

  links: any = {
    fatigueManagement: ['/athlete', 'stats'],
    trainingOverload: ['/athlete', 'stats', 'overload']
  }

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private customerStatsService: CustomerStatsService,
    private customerStatsComputerService: CustomerStatsComputerService,
    private resizeSvc: ResizeService,
    @Inject(DOCUMENT) private _document
  ) {
  }

  ngOnInit(): void {

    this.detectScreenSize();

    this.carouselOptions = {
      animation: {
        animationClass: 'transition',
        animationTime: 500,
      },
      swipe: {
        swipeable: true,
        swipeVelocity: .004,
      },
      drag: {
        draggable: true,
        dragMany: true,
      },
      arrows: false,
      indicators: true,
      infinite: true,
      scroll: {
        numberToScroll: 1
      },
      breakpoints: [
        {
          width: 768,
          number: 1,
        },
        {
          width: 9999,
          number: 3,
        }
      ],
    };

    this.carouselData.push({title: 'Load'});
    this.carouselData.push({title: 'Variation'});
    this.carouselData.push({title: 'Fitness'});

    this.isCoach = this.authService.isCoach();
    this.isFromUrl = !this.isCoach;

    this.user = this.isFromUrl
      ? this.authService.getUserData()
      : this.authService.getUserClientData();


    if (this.isCoach) {
      this.links = {
        fatigueManagement: ['/coach', 'athlet', 'stats'],
        trainingOverload: ['/coach', 'athlet', 'stats', 'overload']
      }
    }

    this.sub.onStatsUpdatedStart = this.customerStatsService.onStatsUpdatedStart.subscribe(
      () => {
        this.data = {standardDeviation: 0, monotony: 0, constraint: 0, fitness: 0, energyScore: 0, rcac: 0};
        this.fatigueManagement = {
          load: {constraint: 0, rcac: 0}, variation: {monotony: 0}, fitness: {fitness: 0, energyScore: 0},
          colors: {load: {color1: '', color2: ''}, variation: {percent: 0}, fitness: {color1: ''}}
        };

        this.lineChartData[0].data = [];
        this.lineChartData[1].data = [];

        this.lineEnergyData = [];
        this.lineRpeData = [];
        this.lineChartLabels = [];
      }
    );

    this.sub.onStatsUpdated = this.customerStatsService.onStatsUpdated.subscribe(
      (component) => {

        let dataWeeklyLoad = this._compute_weeklyLoad(component.stats.weekly);
        let weeklyLoadByDay = dataWeeklyLoad.weeklyLoadByDay;

        let totalDays = Math.round((component.endDay - component.startDay) / (1000 * 3600 * 24)) + 1;
        let weekSelectedCount = totalDays / 7;

        let weeklyLoad = (weekSelectedCount > 0) ? dataWeeklyLoad.weeklyLoad / weekSelectedCount : dataWeeklyLoad.weeklyLoad;
        let averageLoad = (weeklyLoad > 0) ? weeklyLoad / 7 : 0;

        let standardDeviation = averageLoad;
        if (weeklyLoadByDay.length > 1) {
          standardDeviation = StandardDeviationCore.standardDeviation(weeklyLoadByDay);
        }

        let monotony = (averageLoad > 0) ? averageLoad / standardDeviation : 0;
        let constraint = (weeklyLoad > 0) ? weeklyLoad * monotony : 0;

        this.data.standardDeviation = standardDeviation;
        this.data.monotony = monotony;
        this.data.constraint = constraint;
        this.data.fitness = weeklyLoad - constraint;
        this.data.energyScore = this._computeEnergyScoreForWorkouts(component.workouts);

        this.data.fitness = Math.round((this.data.fitness + Number.EPSILON) * 100) / 100;
        this.data.constraint = Math.round((this.data.constraint + Number.EPSILON) * 100) / 100;
        this.data.monotony = Math.round((this.data.monotony + Number.EPSILON) * 100) / 100;
        this.data.energyScore = Math.round(this.data.energyScore);

        let to = endOfWeek(component.startDay, {weekStartsOn: 1});
        let from = _.clone(to);
        from.setDate(from.getDate() - 27);
        let fromDate = this.formatDate(from) + ' 00:00:00';
        let toDate = this.formatDate(to) + ' 00:00:00';

        if (this.isFromUrl) {
          this.usersService.getAllWorkouts(fromDate, toDate, 1).subscribe((workouts: any) => {
            if (workouts) {
              let customerStats = this.customerStatsComputerService.computeStatsForAllWorkouts(workouts, true, from, to);

              let dataWeeklyLoad = this._compute_weeklyLoad(customerStats.stats.weekly);

              console.log('last 4 stats', customerStats);
              console.log('last 4 data', dataWeeklyLoad);

              this.data.rcac = weeklyLoad/(dataWeeklyLoad.weeklyLoad / 4);
              this.data.rcac = Math.round((this.data.rcac + Number.EPSILON) * 100) / 100;

              this._initFatigueManagementData(this.data);
            }
          });
        } else {
          let clientId = this.authService.getCurrentAthletId();

          this.usersService.getAllClientWorkouts(clientId, fromDate, toDate, 1).subscribe((workouts: any) => {
            if (workouts) {
              let customerStats = this.customerStatsComputerService.computeStatsForAllClientWorkouts(workouts, true, from, to);

              let dataWeeklyLoad = this._compute_weeklyLoad(customerStats.stats.weekly);

              console.log('last 4 stats', customerStats);
              console.log('last 4 data', dataWeeklyLoad);

              this.data.rcac = weeklyLoad/(dataWeeklyLoad.weeklyLoad / 4);
              this.data.rcac = Math.round((this.data.rcac + Number.EPSILON) * 100) / 100;

              this._initFatigueManagementData(this.data);
            }
          });
        }

        this._initLineChart(component.startDay, component.endDay, component.workouts);
        this._initReadinessBreakdown(component.workouts);

        console.log('---- Stats Results ----', {
          'totalDays': totalDays,
          'totalWeeks': weekSelectedCount,
          'weeklyLoad': weeklyLoad,
          'weeklyLoadByDay': weeklyLoadByDay,
          'averageLoad': averageLoad,
          'standardDeviation': standardDeviation,
          'data':this.data
        });
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

  private _compute_weeklyLoad(weekly) {

    let weeklyLoad = 0;
    let weeklyLoadByDay = [];

    for (var i = 0; i < weekly.volume.length; i++) {
      let volume = weekly.volume[i];
      let tonnage = weekly.tonnage[i];
      let distance = weekly.distance[i];
      let duration = weekly.duration[i];
      let intensite = weekly.intensite[i];
      let rpe = weekly.rpe[i];

      let externalLoad = this._computeExternalLoad(volume, tonnage, distance, duration);

      if (externalLoad > 0) {
        let averageIntensiteRPE = 0;
        if (intensite > 0) { averageIntensiteRPE = intensite / 100;}
        if (rpe > 0) { averageIntensiteRPE += rpe / 10;}
        averageIntensiteRPE = (intensite > 0 && rpe > 0) ? averageIntensiteRPE / 2 : averageIntensiteRPE;

        let dailyLoad = (averageIntensiteRPE > 0) ? externalLoad * averageIntensiteRPE : externalLoad;

        weeklyLoad += dailyLoad;
        weeklyLoadByDay.push(dailyLoad);
      } else {
        weeklyLoadByDay.push(0);
      }
    }

    return {
      weeklyLoad: weeklyLoad,
      weeklyLoadByDay: weeklyLoadByDay
    };
  }

  private _computeExternalLoad(volume, tonnage, distance, duration)
  {
    let externalLoad = 0;
    let count = 0;

    if (volume > 0) { externalLoad += volume; count++; }
    if (tonnage > 0) { externalLoad += tonnage; count++; }
    if (distance > 0) { externalLoad += distance; count++; }
    if (duration > 0) { externalLoad += duration; count++; }

    if (externalLoad > 0 && count > 0) {
      return externalLoad / count;
    }

    return 0;
  }

  private _initFatigueManagementData(data) {
    let loadColors = this._computeLoadColors(data);
    let variationColors = this._computeVariationColors(data);
    let fitnessColors = this._computeFitnessColors(data);

    this.fatigueManagement = {
      load: {
        constraint: data.constraint,
        rcac: data.rcac
      },
      variation: {
        monotony: data.monotony
      },
      fitness: {
        fitness: data.fitness,
        energyScore: data.energyScore
      },
      colors: {
        load: loadColors,
        variation: variationColors,
        fitness: fitnessColors
      }
    };
  }

  private _computeLoadColors(data) {

    let color1 = 'red';
    let color2 = 'red';

    let descriptionConstraint = 'Load is dangerously high. High risk of injury due to overfatigue';
    let descriptionRCAC = 'Load is too high. High risk of injury due to overfatigue';

    if (data.constraint < 6000) {
      descriptionConstraint = 'Load is under control. You can continue to overload';
      color1 = 'green';
    } else if (data.constraint < 9000) {
      descriptionConstraint = 'Load starts to be too high. Reduce load to avoid overfatigue';
      color1 = 'yellow';
    }

    if (data.rcac < 0.8) {
      color2 = 'yellow1';
      descriptionRCAC = 'Training load is too low. Increase load gradually';
    } else if (data.rcac < 1.3) {
      color2 = 'green';
      descriptionRCAC = 'High load but low risk of injury due to overfatigue. Good job';
    } else if (data.rcac < 1.5) {
      color2 = 'yellow2';
      descriptionRCAC = 'Load has increased too fast. Reduce load to avoid overfatigue';
    }

    let colorCircle = 'red';
    let textCircle = '';
    let percent = 0;


    if (color1 == 'green' && color2 == 'yellow1') {
      colorCircle = 'yellow';
      textCircle = 'undertraining';
      percent = 40;
    } else if (color1 == 'green' && color2 == 'green') {
      colorCircle = 'green';
      textCircle = 'Optimal';
      percent = 50;
    } else if (color1 == 'green' && color2 == 'yellow2') {
      colorCircle = 'yellow';
      textCircle = 'overreaching';
      percent = 60;
    } else if (color1 == 'green' && color2 == 'red') {
      colorCircle = 'red';
      textCircle = 'overreaching';
      percent = 60;


    } else if (color1 == 'yellow' && color2 == 'yellow1') {
      colorCircle = 'yellow';
      textCircle = 'overreaching';
      percent = 60;
    } else if (color1 == 'yellow' && color2 == 'green') {
      colorCircle = 'yellow';
      textCircle = 'overreaching';
      percent = 70;
    } else if (color1 == 'yellow' && color2 == 'yellow2') {
      colorCircle = 'red';
      textCircle = 'overtraining';
      percent = 80;
    } else if (color1 == 'yellow' && color2 == 'red') {
      colorCircle = 'red';
      textCircle = 'overtraining';
      percent = 90;


    } else if (color1 == 'red' && color2 == 'yellow1') {
      colorCircle = 'red';
      textCircle = 'overtraining';
      percent = 70;
    } else if (color1 == 'red' && color2 == 'green') {
      colorCircle = 'red';
      textCircle = 'overtraining';
      percent = 80;
    } else if (color1 == 'red' && color2 == 'yellow2') {
      colorCircle = 'red';
      textCircle = 'overtraining';
      percent = 90;
    } else if (color1 == 'red' && color2 == 'red') {
      colorCircle = 'red';
      textCircle = 'overtraining';
      percent = 100;
    }

    if (color2 == 'yellow1' || color2 == 'yellow2') {
      color2 = 'yellow';
    }

    return {
      color1: color1,
      color2: color2,
      colorCircle: colorCircle,
      textCircle: textCircle,
      percent: percent,
      descriptionConstraint: descriptionConstraint,
      descriptionRCAC: descriptionRCAC
    }
  }

  private _computeVariationColors(data) {

    let colorCircle = 'red';
    let percent = (data.monotony > 2.5) ? 100 : (data.monotony * 40);
    let description = 'Your training is not varied enough, it can cause injury and avoid good recovery';

    if (data.monotony < 1.5) {
      description = 'Your training is well designed with good variation, it avoid injury and promote recovery';
      colorCircle = 'green';

    } else if (data.monotony < 2) {
      description = 'Your training is well designed, keep some variety to avoid injury and recover well';
      colorCircle = 'yellow';

    } else if (data.monotony < 2.5) {
      description = 'Your training has not enough variation, it can cause injury and underperformance';
      colorCircle = 'red';
    }

    return {
      colorCircle: colorCircle,
      percent: Math.round(percent),
      description: description
    }
  }

  private _computeFitnessColors(data) {

    let color1 = 'red';
    let color2 = 'green';
    let colorCircle = 'red';
    let textCircle = '';
    let percent = 0;
    let descriptionEnergyScore = 'Good job at recovering and having a healthy lifestyle';
    let descriptionFitness = 'To peak or recover, consider reducing load and/or varying sessions';

    if (data.fitness > 0) {
      color1 = 'green';
      descriptionFitness = 'Your load and training design is good for peaking and performance';
    }

    if (data.energyScore < 60) {
      color2 = 'red';
      descriptionEnergyScore = 'You seem rather tired : focus on recovery and having a healthy lifestyle';
    } else if (data.energyScore < 80) {
      color2 = 'yellow';
      descriptionEnergyScore = 'It seems like you are a bit tired but doing ok';
    }

    if (color1 == 'green' && color2 == 'green') {
      colorCircle = 'green';
      percent = 95;
      textCircle = 'Very good';
    } else if (color1 == 'green' && color2 == 'yellow') {
      colorCircle = 'yellow';
      percent = 80;
      textCircle = 'Good';
    } else if (color1 == 'red' && color2 == 'green') {
      colorCircle = 'yellow';
      percent = 65;
      textCircle = 'Quite good';
    } else if (color1 == 'red' && color2 == 'yellow') {
      colorCircle = 'red';
      percent = 50;
      textCircle = 'Rather low';
    } else if (color1 == 'green' && color2 == 'red') {
      colorCircle = 'yellow';
      percent = 35;
      textCircle = 'Low';
    } else if (color1 == 'red' && color2 == 'red') {
      colorCircle = 'red';
      percent = 20;
      textCircle = 'Very low';
    }

    return {
      color1: color1,
      color2: color2,
      colorCircle: colorCircle,
      textCircle: textCircle,
      percent: percent,
      descriptionFitness: descriptionFitness,
      descriptionEnergyScore: descriptionEnergyScore
    }
  }

  private _computeEnergyScoreForWorkouts(workouts) {
    let energyScoresLength = 0;
    let energyScores = 0;

    for (let workoutDay in workouts) {
      let dayWorkouts = workouts[workoutDay];

      for (let workoutKey in dayWorkouts) {
        let workoutEnergyScore = this._computeEnergyScore(dayWorkouts[workoutKey]);
        if (workoutEnergyScore > 0) {
          energyScores += workoutEnergyScore;
          energyScoresLength++;
        }
      }
    }

    if (energyScoresLength == 0) {
      return 0;
    }

    return energyScores / energyScoresLength;
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

  private _computeDateFromDatePicker(date, withtime?) {
    let day = (date.day < 10) ? "0" + date.day : date.day;
    let month = (date.month < 10) ? "0" + date.month : date.month;

    let dateFormatted = date.year + "-" + month + "-" + day;

    if (withtime === true) {
      dateFormatted += " 00:00:00";
    }

    return dateFormatted;
  }

  private detectScreenSize() {
    const currentSize = this._document.body.clientWidth;
    this.size = currentSize;
    this.resizeSvc.onResize(currentSize);
  }

  formatDate(d) {
    var month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
}
