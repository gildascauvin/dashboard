import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FatigueManagementComputerService {

  compute(workout) {

    let energyScore = this.computeEnergyScore(workout);

    let rate = parseInt(workout.rate);

    if (energyScore <= 0) {
      return {
        status: 'todo',
        color: 'red'
      };
    }

    if (rate <= 0) {
      let title = 'Autoregulation tips';
      let subtitle = '';
      let color = '';

      if (energyScore > 80) {
        subtitle = 'It seems like you are in a good shape, you can push yourself to a hard session.';
        color = 'green';
      } else if (energyScore < 60) {
        subtitle = 'It seems like you rather tired. Do a light session to recover or rest.';
        color = 'red';
      } else {
        subtitle = 'It seems like you are a bit tired. Adjust your session according to how you feel.';
        color = 'yellow';
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
      zoneName = 'Recovery';
      subtitle = 'It seems like you had an easy session. While it is good for recovering or peaking, it is not optimal for improving.';
    } else if (zoneScore < -1.33) {
      zoneName = 'Overreaching';
      subtitle = 'It seems like you did a very trying session. You might consider doing a recovery session or having a rest day.';
    } else {
      zoneName = 'Optimal';
      subtitle = 'It seems like you did an optimal session. Take a well deserved rest and you will be ready to train again!';
    }

    if (energyScore > 80) {
      colorEnergy = 'green';
    } else if (energyScore < 60) {
      colorEnergy = 'red';
    } else {
      colorEnergy = 'yellow';
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

    return (totalDataConfirmed > 0) ? totalEnergy / (3 * totalDataConfirmed) * 100 : 0;
  }
}
