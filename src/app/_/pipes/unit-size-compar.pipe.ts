import { Pipe, PipeTransform } from '@angular/core';

import { webConfig } from '../../web-config';

@Pipe({
  name: 'unitSizeCompar'
})
export class UnitSizeComparPipe implements PipeTransform {

  transform(value: any, size: any, unit: any, setUnit: any) {
    console.log(value, size, unit, setUnit, webConfig.conversion);

    // KG or LBS
    if (setUnit != 1 && setUnit != 2) {
    	return '';
    }

    let valueCompar = 0;
    let unitKey = this._setUnitLabel(unit);
    let unitKeyCompar = this._setUnitCompar(setUnit);

    if (webConfig.conversion[unitKey] && webConfig.conversion[unitKey][unitKeyCompar]) {
    	valueCompar = webConfig.conversion[unitKey][unitKeyCompar];
    }

    // Same Unit
    if (!valueCompar) {
    	return this._getPercent(size, value);
    }

	return this._getPercent(size, value * valueCompar);
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
        return 'watts';
      case 5:
      case "5":
        return 'km/h';
    }

    return '';
  }

  private _setUnitCompar(value) {
    switch (value) {
      case 1:
      case "1":
        return 'lbs';
      case 2:
      case "2":
        return 'kg';
    }

    return '';
  }

  private _getPercent(primaryValue, secondaryValue) {
  	return parseInt('' + 100 / primaryValue * secondaryValue) + ' %';
  }
}
