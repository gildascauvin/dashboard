import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratioMovement'
})
export class RatioMovementPipe implements PipeTransform {
  transform(value: any, profil): any {
  	console.log(value, profil);
    return ;
  }
}
