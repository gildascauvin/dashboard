import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unitSizeLabel'
})
export class UnitSizeLabelPipe implements PipeTransform {

  transform(value: any, size: any, unit: any) {
    let result = ((size / 100 * value) || 0).toFixed(2);
    return result + ' ' + this._setUnitLabel(unit);
  }

  private _setUnitLabel(value) {
    switch (value) {
      case 1:
      case "1":
        return 'kg';
      case 2:
      case "2":
        return 'lbs';
      case 3:
      case "3":
        return '%';
      case 4:
      case "4":
        return 'RPE';
      case 5:
      case "5":
        return 'km/h';
    }

    return '';
  }

}
