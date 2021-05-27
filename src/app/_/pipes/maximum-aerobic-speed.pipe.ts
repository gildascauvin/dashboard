import { Pipe, PipeTransform } from '@angular/core';
import {DoorgetsTranslateService} from "doorgets-ng-translate";

@Pipe({
  name: 'maximumAerobicSpeed'
})
export class MaximumAerobicSpeedPipe implements PipeTransform {

  constructor(private doorgetsTranslateService: DoorgetsTranslateService,) {
  }

  transform(value: any, rep: any, repUnit: any, unit: any, mas: any) {

    if (!value) {value = 0;}
    if (!rep) { rep = 1;}
    if (!mas) { mas = 0;}

    let percent = (unit == 3 && value > 0) ? (value / 100) : 1;

    // meters
    if (repUnit == 1) {
      let minutes = 0;
      let seconds = 0;

      if (mas > 0) {
        let totalSeconds = Math.round(rep / (mas / 3.6 * percent));
        minutes = Math.floor(totalSeconds / 60);
        seconds = totalSeconds - minutes * 60;
      }

      if (minutes < 0) {
        minutes = 0;
        seconds = 0;
      }

      return minutes + 'min ' + seconds + 's';
    }

    // minutes
    if (repUnit == 3 || repUnit == 4) {
      let seconds = rep * 60;
      let meters = (mas / 3.6) * (seconds * percent);

      if (meters < 0) {
        meters = 0;
      }

      return Math.round(meters) + ' ' + this.doorgetsTranslateService.instant("#meters");
    }

    // seconds
    if (repUnit == 5) {
      let meters = (mas / 3.6) * (rep * percent);

      if (meters < 0) {
        meters = 0;
      }

      return Math.round(meters) + ' ' + this.doorgetsTranslateService.instant("#meters");;
    }

    return '';
  }
}
