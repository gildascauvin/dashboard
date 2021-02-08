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

@Component({
  selector: 'app-athlete-stats-fatigue-management',
  templateUrl: './athlete-stats-fatigue-management.component.html',
  styleUrls: ['./athlete-stats-fatigue-management.component.scss']
})
export class AthleteStatsFatigueManagementComponent implements OnInit {
  @Input() isFromUrl = true;

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

    let from = new Date();
    let to = new Date();
    from.setDate(from.getDate() - 35);
    to.setDate(to.getDate() - 7);
    let fromDate = this.formatDate(from) + ' 00:00:00';
    let toDate = this.formatDate(to) + ' 00:00:00';

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
      }
    );


    this.sub.onStatsUpdated = this.customerStatsService.onStatsUpdated.subscribe(
      (component) => {

        let dataWeeklyLoad = this._compute_weeklyLoad(component.stats.weekly);
        let weeklyLoad = dataWeeklyLoad.weeklyLoad;
        let weeklyLoadByDay = dataWeeklyLoad.weeklyLoadByDay;

        let standardDeviation = StandardDeviationCore.standardDeviation(weeklyLoadByDay);

        let averageLoad = weeklyLoad / component.stats.weekly.volume.length;
        let monotony = averageLoad / standardDeviation;
        let constraint = weeklyLoad * monotony;

        this.data.standardDeviation = standardDeviation;
        this.data.monotony = monotony;
        this.data.constraint = constraint;
        this.data.fitness = weeklyLoad - constraint;
        this.data.energyScore = this._computeEnergyScoreForWorkouts(component.workouts);

        this.data.fitness = Math.round((this.data.fitness + Number.EPSILON) * 100) / 100;
        this.data.constraint = Math.round((this.data.constraint + Number.EPSILON) * 100) / 100;
        this.data.monotony = Math.round((this.data.monotony + Number.EPSILON) * 100) / 100;
        this.data.energyScore = Math.round(this.data.energyScore);

        if (this.isFromUrl) {
          this.usersService.getAllWorkouts(fromDate, toDate, 1).subscribe((workouts: any) => {
            if (workouts) {
              let customerStats = this.customerStatsComputerService.computeStatsForAllWorkouts(workouts);

              let dataWeeklyLoad = this._compute_weeklyLoad(customerStats.stats.weekly);
              this.data.rcac = weeklyLoad/dataWeeklyLoad.weeklyLoad;
              this.data.rcac = Math.round((this.data.rcac + Number.EPSILON) * 100) / 100;

              this._initFatigueManagementData(this.data);
            }
          });
        } else {
          let clientId = this.authService.getCurrentAthletId();

          this.usersService.getAllClientWorkouts(clientId, fromDate, toDate, 1).subscribe((workouts: any) => {
            if (workouts) {
              let customerStats = this.customerStatsComputerService.computeStatsForAllClientWorkouts(workouts);

              let dataWeeklyLoad = this._compute_weeklyLoad(customerStats.stats.weekly);
              this.data.rcac = weeklyLoad/dataWeeklyLoad.weeklyLoad;
              this.data.rcac = Math.round((this.data.rcac + Number.EPSILON) * 100) / 100;

              this._initFatigueManagementData(this.data);
            }
          });
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.onStatsUpdated && this.sub.onStatsUpdated.unsubscribe();
    this.sub.onStatsUpdatedStart && this.sub.onStatsUpdatedStart.unsubscribe();
  }

  private _compute_weeklyLoad(weekly) {

    let weeklyLoad = 0;
    let weeklyLoadByDay = [];

    for (var i = 0; i < weekly.volume.length; i++) {
      let volume = weekly.volume[i];
      let tonnage = weekly.tonnage[i];
      let distance = weekly.distance[i];
      let duration = weekly.duration[i];
      let intensite = weekly.intensite[i] > 0 ? weekly.intensite[i] : 1;
      let rpe = weekly.rpe[i] > 0 ? weekly.rpe[i] : 1;

      let externalLoad = (volume + tonnage + distance + duration) / 3;
      let dailyLoad = externalLoad * ((intensite / 100 + rpe / 10) / 2);

      weeklyLoad += dailyLoad;
      weeklyLoadByDay.push(dailyLoad);
    }

    return {
      weeklyLoad: weeklyLoad,
      weeklyLoadByDay: weeklyLoadByDay
    };
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
        energyScores += this._computeEnergyScore(dayWorkouts[workoutKey]);
        energyScoresLength++;
      }
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
