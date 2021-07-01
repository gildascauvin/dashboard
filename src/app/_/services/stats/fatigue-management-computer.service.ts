import {Injectable} from '@angular/core';
import {DoorgetsTranslateService} from "doorgets-ng-translate";
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class FatigueManagementComputerService {

  constructor(private doorgetsTranslateService: DoorgetsTranslateService) { }

  computeWithWorkouts(workouts) {

    let totalEnergyScore = 0;
    let totalRate = 0;
    let sumEnergyScore = 0;
    let sumRate = 0;

    _.forEach(workouts, (workout) => {
      let energyScore = this.computeEnergyScore(workout);
      let rate =(workout.rate) ? parseInt(workout.rate) : 0;

      if (energyScore > 0) {
        totalEnergyScore++;
        sumEnergyScore += energyScore;
      }

      if (rate > 0) {
        totalRate++;
        sumRate += rate;
      }
    });

    return this.computeWithEnergyScoreAndRate((sumEnergyScore / totalEnergyScore), (sumRate / totalRate));
  }

  compute(workout) {
    let energyScore = this.computeEnergyScore(workout);
    let rate =(workout.rate) ? parseInt(workout.rate) : 0;

    return this.computeWithEnergyScoreAndRate(energyScore, rate);
  }

  private computeWithEnergyScoreAndRate(energyScore, rate) {
    if (energyScore <= 0) {
      return {
        status: 'todo',
        color: 'low'
      };
    }

    if (rate <= 0) {
      let title = this.doorgetsTranslateService.instant('#Autoregulation tips');
      let subtitle = '';
      let color = '';

      if (energyScore > 80) {
        subtitle = this.doorgetsTranslateService.instant('#It seems like you are in a good shape, you can push yourself to a hard session.');
        color = 'high';
      } else if (energyScore < 60) {
        subtitle = this.doorgetsTranslateService.instant('#It seems like you rather tired. Do a light session to recover or rest.');
        color = 'low';
      } else {
        subtitle = this.doorgetsTranslateService.instant('#It seems like you are a bit tired. Adjust your session according to how you feel.');
        color = 'medium';
      }

      return {
        status: 'in-progress',
        color: color,
        energy: Math.round(energyScore),
        title: title,
        subtitle: subtitle
      };
    }

    let zoneScore = (energyScore / 10) - rate;

    let colorRPE = '';
    let colorEnergy = '';
    let zoneName = '';
    let subtitle = '';

    if (rate > 8) {
      colorRPE = 'red';
    } else if (rate < 6) {
      colorRPE = 'green';
    } else {
      colorRPE = 'yellow';
    }

    if (zoneScore > 1.33) {
      zoneName = this.doorgetsTranslateService.instant('#Recovery');
      subtitle = this.doorgetsTranslateService.instant('#It seems like you had an easy session. While it is good for recovering or peaking, it is not optimal for improving.');
    } else if (zoneScore < -1.33) {
      zoneName = this.doorgetsTranslateService.instant('#Overreaching');
      subtitle = this.doorgetsTranslateService.instant('#It seems like you did a very trying session. You might consider doing a recovery session or having a rest day.');
    } else {
      zoneName = this.doorgetsTranslateService.instant('#Optimal');
      subtitle = this.doorgetsTranslateService.instant('#It seems like you did an optimal session. Take a well deserved rest and you will be ready to train again!');
    }

    if (energyScore > 80) {
      colorEnergy = 'high';
    } else if (energyScore < 60) {
      colorEnergy = 'low';
    } else {
      colorEnergy = 'medium';
    }

    return {
      status: 'done',
      colorRPE: colorRPE,
      colorEnergy: colorEnergy,
      energyScore: Math.round(energyScore / 10),
      rpeScore: rate,
      zoneName: zoneName,
      subtitle: subtitle
    };
  }

  computeEnergyScore(workout)
  {
    let diet = parseInt(workout.diet);
    let sleep = parseInt(workout.sleep);
    let mood = parseInt(workout.mood);
    let energy = parseInt(workout.energy);
    let stress = parseInt(workout.stress);

    let energyDatas = [diet, sleep, mood, energy, stress];

    let totalEnergy = 0;
    let totalDataConfirmed = 0;
    energyDatas.forEach(function(data){
      if (data > 0) {
        totalDataConfirmed++
        totalEnergy += data;
      }
    });

    return (totalDataConfirmed > 0) ? totalEnergy / (5 * totalDataConfirmed) * 100 : 0;
  }
}
