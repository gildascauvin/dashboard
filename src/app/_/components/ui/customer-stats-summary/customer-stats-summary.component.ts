import {Component, ElementRef, Inject, Input, OnInit, QueryList, ViewChild, ViewChildren} from "@angular/core";
import {ngxLightOptions} from "ngx-light-carousel/public-api";
import {NgxCarouselComponent} from "ngx-light-carousel";
import {ResizeService} from "../../../services/ui/resize-service.service";
import {DOCUMENT} from "@angular/common";
import {CustomerStatsService} from "../customer-stats-range/customer-stats-range.service";
import {StandardDeviationCore} from "../../../core/standard-deviation.core";
import {endOfWeek} from "date-fns";
import * as _ from "lodash";
import {UsersService} from "../../../templates/users.service";
import {CustomerStatsComputerService} from "../../../services/stats/customer-stats-computer.service";
import {AuthService} from "../../../services/http/auth.service";
import { CustomerStatsSummaryService } from './customer-stats-summary.service';
import {DoorgetsTranslateService} from "doorgets-ng-translate";

@Component({
  selector: "app-customer-stats-summary",
  templateUrl: "./customer-stats-summary.component.html",
  styleUrls: ["./customer-stats-summary.component.scss"],
})
export class CustomerStatsSummaryComponent implements OnInit {
  @Input() isFromUrl = true;
  currentElementCarousel: number = 0;

  @ViewChild(NgxCarouselComponent) sliderElement: NgxCarouselComponent;

  ngAfterViewInit() {
      this.touchendCarousel();
  }

  touchendCarousel(timeout?){

    let duration = 0;
    if (timeout === true) {
      duration = 1000;
    }

    setTimeout(() => {
      if (this.sliderElement && this.currentElementCarousel != this.sliderElement.current) {
        this.currentElementCarousel = this.sliderElement.current;

        if (this.currentElementCarousel == 1) {
          this.setActiveTab('energySystems');
        } else if (this.currentElementCarousel == 2) {
          this.setActiveTab('fatigueManagement');
        } else {
          this.setActiveTab('trainingOverload');
        }
      }
    }, duration);
  }

  size: number = 1;
  responsiveSize: number = 768;

  sub: any = {};

  carouselOptions: ngxLightOptions;
  carouselData: any = [];

  activeTab: string = 'trainingOverload';

  data: any = {
    standardDeviation: 0,
    monotony: 0,
    constraint: 0,
    fitness: 0,
    energyScore: 0,
    rcac: 0
  };

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

  isCoach: boolean = false;

  constructor(
    private customerStatsService: CustomerStatsService,
    private resizeSvc: ResizeService,
    private customerStatsComputerService: CustomerStatsComputerService,
    private usersService: UsersService,
    private authService: AuthService,
    private customerStatsSummaryService: CustomerStatsSummaryService,
    private doorgetsTranslateService: DoorgetsTranslateService,
    @Inject(DOCUMENT) private _document
  ) {
  }

  ngOnInit() {
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

    this.isCoach = this.authService.isCoach();

    this.carouselData.push({title: 'Load'});
    this.carouselData.push({title: 'Variation'});
    this.carouselData.push({title: 'Fitness'});

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

              this.data.rcac = weeklyLoad/(dataWeeklyLoad.weeklyLoad / 4);
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

  setActiveTab(tab) {
    this.activeTab = tab;
    this.customerStatsSummaryService.onTabChanged.emit(tab);
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

  private _computeLoadColors(data) {

    let color1 = 'red';
    let color2 = 'red';

    let descriptionConstraint = this.doorgetsTranslateService.instant('#Load is dangerously high. High risk of injury due to overfatigue');
    let descriptionRCAC = this.doorgetsTranslateService.instant('#Load is too high. High risk of injury due to overfatigue');

    if (data.constraint < 6000) {
      descriptionConstraint = this.doorgetsTranslateService.instant('#Load is under control. You can continue to overload');
      color1 = 'green';
    } else if (data.constraint < 9000) {
      descriptionConstraint = this.doorgetsTranslateService.instant('#Load starts to be too high. Reduce load to avoid overfatigue');
      color1 = 'yellow';
    }

    if (data.rcac < 0.8) {
      color2 = 'yellow1';
      descriptionRCAC = this.doorgetsTranslateService.instant('#Training load is too low. Increase load gradually');
    } else if (data.rcac < 1.3) {
      color2 = 'green';
      descriptionRCAC = this.doorgetsTranslateService.instant('#High load but low risk of injury due to overfatigue. Good job');
    } else if (data.rcac < 1.5) {
      color2 = 'yellow2';
      descriptionRCAC = this.doorgetsTranslateService.instant('#Load has increased too fast. Reduce load to avoid overfatigue');
    }

    let colorCircle = 'red';
    let textCircle = '';
    let percent = 0;


    if (color1 == 'green' && color2 == 'yellow1') {
      colorCircle = 'yellow';
      textCircle = this.doorgetsTranslateService.instant('#Undertraining');
      percent = 40;
    } else if (color1 == 'green' && color2 == 'green') {
      colorCircle = 'green';
      textCircle = this.doorgetsTranslateService.instant('#Optimal');
      percent = 50;
    } else if (color1 == 'green' && color2 == 'yellow2') {
      colorCircle = 'yellow';
      textCircle = this.doorgetsTranslateService.instant('#Overreaching');
      percent = 60;
    } else if (color1 == 'green' && color2 == 'red') {
      colorCircle = 'red';
      textCircle = this.doorgetsTranslateService.instant('#Overreaching');
      percent = 60;


    } else if (color1 == 'yellow' && color2 == 'yellow1') {
      colorCircle = 'yellow';
      textCircle = this.doorgetsTranslateService.instant('#Overreaching');
      percent = 60;
    } else if (color1 == 'yellow' && color2 == 'green') {
      colorCircle = 'yellow';
      textCircle = this.doorgetsTranslateService.instant('#Overreaching');
      percent = 70;
    } else if (color1 == 'yellow' && color2 == 'yellow2') {
      colorCircle = 'red';
      textCircle = this.doorgetsTranslateService.instant('#Overtraining');
      percent = 80;
    } else if (color1 == 'yellow' && color2 == 'red') {
      colorCircle = 'red';
      textCircle = this.doorgetsTranslateService.instant('#Overtraining');
      percent = 90;


    } else if (color1 == 'red' && color2 == 'yellow1') {
      colorCircle = 'red';
      textCircle = this.doorgetsTranslateService.instant('#Overtraining');
      percent = 70;
    } else if (color1 == 'red' && color2 == 'green') {
      colorCircle = 'red';
      textCircle = this.doorgetsTranslateService.instant('#Overtraining');
      percent = 80;
    } else if (color1 == 'red' && color2 == 'yellow2') {
      colorCircle = 'red';
      textCircle = this.doorgetsTranslateService.instant('#Overtraining');
      percent = 90;
    } else if (color1 == 'red' && color2 == 'red') {
      colorCircle = 'red';
      textCircle = this.doorgetsTranslateService.instant('#Overtraining');
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
    let description = this.doorgetsTranslateService.instant('#Your training is not varied enough, it can cause injury and avoid good recovery');

    if (data.monotony < 1.5) {
      description = this.doorgetsTranslateService.instant('#Your training is well designed with good variation, it avoid injury and promote recovery');
      colorCircle = 'green';

    } else if (data.monotony < 2) {
      description = this.doorgetsTranslateService.instant('#Your training is well designed, keep some variety to avoid injury and recover well');
      colorCircle = 'yellow';

    } else if (data.monotony < 2.5) {
      description = this.doorgetsTranslateService.instant('#Your training has not enough variation, it can cause injury and underperformance');
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
    let descriptionEnergyScore = this.doorgetsTranslateService.instant('#Good job at recovering and having a healthy lifestyle');
    let descriptionFitness = this.doorgetsTranslateService.instant('#To peak or recover, consider reducing load and/or varying sessions');

    if (data.fitness > 0) {
      color1 = 'green';
      descriptionFitness = this.doorgetsTranslateService.instant('#Your load and training design is good for peaking and performance');
    }

    if (data.energyScore < 60) {
      color2 = 'red';
      descriptionEnergyScore = this.doorgetsTranslateService.instant('#You seem rather tired : focus on recovery and having a healthy lifestyle');
    } else if (data.energyScore < 80) {
      color2 = 'yellow';
      descriptionEnergyScore = this.doorgetsTranslateService.instant('#It seems like you are a bit tired but doing ok');
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

  private _computeExternalLoad(volume, tonnage, distance, duration) {
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

  private detectScreenSize() {
    const currentSize = this._document.body.clientWidth;
    this.size = currentSize;
    this.resizeSvc.onResize(currentSize);
  }
}
