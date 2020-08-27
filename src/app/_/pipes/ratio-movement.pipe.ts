import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratioMovement'
})
export class RatioMovementPipe implements PipeTransform {
  transform(value: any): any {
  	console.log(value);
    return parseInt('' + value.record / value.ratio_value * 100);
  }
}
