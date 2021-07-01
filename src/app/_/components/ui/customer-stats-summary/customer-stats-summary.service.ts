import { Injectable, EventEmitter } from '@angular/core';
import {StandardDeviationCore} from "../../../core/standard-deviation.core";
import {UsersService} from "../../../templates/users.service";
import {CustomerStatsComputerService} from "../../../services/stats/customer-stats-computer.service";
import {AuthService} from "../../../services/http/auth.service";
import {DoorgetsTranslateService} from "doorgets-ng-translate";
import * as _ from "lodash";

@Injectable({
	providedIn: 'root'
})
export class CustomerStatsSummaryService {
	onTabChanged: any = new EventEmitter();

  data: any = {
    standardDeviation: 0,
    monotony: 0,
    constraint: 0,
    fitness: 0,
    energyScore: 0,
    rcac: 0,
    rpe: 0,
    zone: 0,
    lifestyle: 0
  };

  constructor(
    private usersService: UsersService,
    private customerStatsComputerService: CustomerStatsComputerService,
    private authService: AuthService,
    private doorgetsTranslateService: DoorgetsTranslateService,
  ) {}

  computeEnergyScoresForWorkouts(workouts) {
    let listScores = ['diet', 'sleep', 'mood', 'energy', 'stress'];
    let scores = {
      diet: 0, sleep: 0, mood: 0, energy: 0, stress: 0,
      dietLength: 0, sleepLength: 0, moodLength: 0, energyLength: 0, stressLength: 0
    };

    for (let dayWorkout in workouts) {
      let dayWorkouts = workouts[dayWorkout];

      for (let workoutKey in dayWorkouts) {
        listScores.forEach(function(scoreName) {
          if (dayWorkouts[workoutKey][scoreName] > 0) {
            scores[scoreName] += dayWorkouts[workoutKey][scoreName];
            scores[scoreName + "Length"]++;
          }
        });
      }
    }

    let diet = CustomerStatsSummaryService._computeSingleEnergyScore(scores.diet, scores.dietLength);
    let sleep = CustomerStatsSummaryService._computeSingleEnergyScore(scores.sleep, scores.sleepLength);
    let mood = CustomerStatsSummaryService._computeSingleEnergyScore(scores.mood, scores.moodLength);
    let energy = CustomerStatsSummaryService._computeSingleEnergyScore(scores.energy, scores.energyLength);
    let stress = CustomerStatsSummaryService._computeSingleEnergyScore(scores.stress, scores.stressLength);

    let energyScoresLength = 0;
    if (diet.value > 0) energyScoresLength++;
    if (sleep.value > 0) energyScoresLength++;
    if (mood.value > 0) energyScoresLength++;
    if (energy.value > 0) energyScoresLength++;
    if (stress.value > 0) energyScoresLength++;

    let energyScore = energyScoresLength > 0 ? (diet.value + sleep.value + mood.value + energy.value + stress.value) / energyScoresLength : 0;

    return {
      diet: diet,
      sleep: sleep,
      mood: mood,
      energy: energy,
      stress: stress,
      energyScore: energyScore
    };
  }

  computeStatFatigueManagement(globalWorkouts, workouts, globalCustomerStats, customerStats, startDay, endDay) {
    let dataWeeklyLoad = CustomerStatsSummaryService._compute_weeklyLoad(globalCustomerStats.weekly);
    let weeklyLoadByDay = dataWeeklyLoad.weeklyLoadByDay;

    let totalDays = Math.round((endDay - startDay) / (1000 * 3600 * 24));
    let weekSelectedCount = totalDays / 7;

    let weeklyLoad = (weekSelectedCount > 0) ? dataWeeklyLoad.weeklyLoad / weekSelectedCount : dataWeeklyLoad.weeklyLoad;
    let averageLoad = (weeklyLoad > 0) ? weeklyLoad / 7 : 0;

    let standardDeviation = averageLoad;
    if (weeklyLoadByDay.length > 1) {
      standardDeviation = StandardDeviationCore.standardDeviation(weeklyLoadByDay);
    }

    let monotony = (averageLoad > 0) ? averageLoad / standardDeviation : 0;
    let constraint = (weeklyLoad > 0) ? weeklyLoad * monotony : 0;

    let energyScoresData = this.computeEnergyScoresForWorkouts(globalWorkouts);

    this.data.standardDeviation = standardDeviation;
    this.data.monotony = monotony;
    this.data.constraint = constraint;
    this.data.fitness = weeklyLoad - constraint;
    this.data.energyScore = energyScoresData.energyScore;

    this.data.fitness = Math.round((this.data.fitness + Number.EPSILON) * 100) / 100;
    this.data.fitnessRounded = Math.round(this.data.fitness);
    this.data.constraint = Math.round((this.data.constraint + Number.EPSILON) * 100) / 100;
    this.data.constraintRounded = Math.round(this.data.constraint);
    this.data.monotony = Math.round((this.data.monotony + Number.EPSILON) * 100) / 100;
    this.data.energyScore = this.data.energyScore > 0 ? Math.round((this.data.energyScore * 10 + Number.EPSILON) * 10) / 10 : 0;

    let customerDataWeeklyLoad = CustomerStatsSummaryService._compute_weeklyLoad(customerStats.stats.weekly);

    if (weeklyLoad > 0 && customerDataWeeklyLoad.weeklyLoad > 0) {
      this.data.rcac = weeklyLoad/(customerDataWeeklyLoad.weeklyLoad / 4);
      this.data.rcac = Math.round((this.data.rcac + Number.EPSILON) * 100) / 100;
    } else {
      this.data.rcac = 0;
    }

    let rpeData = this._computeRPE(globalWorkouts);
    this.data.rpe = rpeData.rpe;
    this.data.zone = rpeData.zone;

    if (this.data.energyScore > 0) {
      this.data.lifestyle = 10 - (Math.round((this.data.energyScore + Number.EPSILON) * 10) / 100);
      this.data.lifestyle = Math.round((this.data.lifestyle + Number.EPSILON) * 10) / 10;
    } else {
      this.data.lifestyle = '';
    }

    return this._initFatigueManagementData(this.data, (Object.keys(workouts).length > 0));
  }

  private _initFatigueManagementData(data, hasStat) {
    let loadColors = this._computeLoadColors(data);
    let variationColors = this._computeVariationColors(data);
    let fitnessColors = this._computeFitnessColors(data);
    let lifeStyleColor = CustomerStatsSummaryService._computeLifeStyleColors(data);

    return {
      has_stats: hasStat,
      load: {
        constraint: data.constraint,
        constraintRounded: data.constraintRounded,
        rcac: data.rcac
      },
      variation: {
        monotony: data.monotony
      },
      fitness: {
        fitness: data.fitness,
        fitnessRounded: data.fitnessRounded,
        energyScore: data.energyScore
      },
      rpe: {
        rpe: data.rpe.value
      },
      zone: {
        name: data.zone.name
      },
      lifestyle: {
        value: data.lifestyle
      },
      colors: {
        load: loadColors,
        variation: variationColors,
        fitness: fitnessColors,
        rpe: {
          color: data.rpe.color
        },
        zone: {
          color: data.zone.color
        },
        lifestyle: {
          color: lifeStyleColor
        }
      }
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

    return (totalDataConfirmed > 0) ? totalEnergy / (5 * totalDataConfirmed) * 100 : 0;
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

  private static _computeLifeStyleColors(data) {
    let color = 'yellow';

    if (data.lifestyle > 8) {
      color = 'red';
    } else if (data.lifestyle < 6) {
      color = 'green';
    }

    return color;
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
      textCircle = this.doorgetsTranslateService.instant('#Very good1');
    } else if (color1 == 'green' && color2 == 'yellow') {
      colorCircle = 'yellow';
      percent = 80;
      textCircle = this.doorgetsTranslateService.instant('#Good1');
    } else if (color1 == 'red' && color2 == 'green') {
      colorCircle = 'yellow';
      percent = 65;
      textCircle = this.doorgetsTranslateService.instant('#Quite good');
    } else if (color1 == 'red' && color2 == 'yellow') {
      colorCircle = 'red';
      percent = 50;
      textCircle = this.doorgetsTranslateService.instant('#Rather low');
    } else if (color1 == 'green' && color2 == 'red') {
      colorCircle = 'yellow';
      percent = 35;
      textCircle = this.doorgetsTranslateService.instant('#Low');
    } else if (color1 == 'red' && color2 == 'red') {
      colorCircle = 'red';
      percent = 20;
      textCircle = this.doorgetsTranslateService.instant('#Very low');
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

  private _computeRPE(workouts) {
    let rpeScores = 0;
    let rpeScoresLength = 0;
    let energyScores = 0;
    let energyScoresLength = 0;

    for (let dayWorkout in workouts) {
      let dayWorkouts = workouts[dayWorkout];

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
    }

    let energyScore = (energyScoresLength > 0) ? Math.round(((energyScores / energyScoresLength / 10) + Number.EPSILON) * 100) / 100 : null;
    let value = (rpeScoresLength > 0) ? Math.round(((rpeScores / rpeScoresLength) + Number.EPSILON) * 100) / 100 : null;
    let zoneScore = (energyScore !== null && value !== null) ? energyScore - value : null;

    let zoneName = '';
    let zoneColor = '';

    let color = 'yellow';

    if (value > 8) {
      color = 'red';
    } else if (value < 6) {
      color = 'green';
    }

    if (zoneScore > 1.33) {
      zoneName = this.doorgetsTranslateService.instant('#Recovery');
      zoneColor = 'yellow';
    } else if (zoneScore < -1.33) {
      zoneName = this.doorgetsTranslateService.instant('#Overreaching');
      zoneColor = 'red';
    } else if (zoneScore !== null) {
      zoneName = this.doorgetsTranslateService.instant('#Optimal');
      zoneColor = 'green';
    }

    return {
      rpe: {
        value: (value !== null) ? value : '',
        color: color,
      },
      zone: {
        name: zoneName,
        color: zoneColor
      }
    };
  }

  private static _compute_weeklyLoad(weekly) {

    let weeklyLoad = 0;
    let weeklyLoadByDay = [];

    for (var i = 0; i < weekly.volume.length; i++) {
      let volume = weekly.volume[i];
      let tonnage = weekly.tonnage[i];
      let distance = weekly.distance[i];
      let duration = weekly.duration[i];
      let intensity = weekly.intensite[i];
      let rpe = weekly.rpe[i];

      let externalLoad = CustomerStatsSummaryService._computeExternalLoad(volume, tonnage, distance, duration);

      if (externalLoad > 0) {
        let averageIntensityRPE = 0;
        if (intensity > 0) { averageIntensityRPE = intensity / 100;}
        if (rpe > 0) { averageIntensityRPE += rpe / 10;}
        averageIntensityRPE = (intensity > 0 && rpe > 0) ? averageIntensityRPE / 2 : averageIntensityRPE;

        let dailyLoad = (averageIntensityRPE > 0) ? externalLoad * averageIntensityRPE : externalLoad;

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

  private static _computeExternalLoad(volume, tonnage, distance, duration) {
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

  private static _computeSingleEnergyScore(score, scoreLength) {

    let result = 0;
    let color = '';

    if (scoreLength == 0 || score == 0) {
      result = 0;
    } else {
      result = score / scoreLength / 5 * 10;
      result = Math.round((result + Number.EPSILON) * 100) / 100;

      color = 'medium';

      if (result <= 5) {
        color = 'low';
      } else if (result >= 8) {
        color = 'high';
      }
    }

    return {
      value: result,
      color: color
    };
  }
}
