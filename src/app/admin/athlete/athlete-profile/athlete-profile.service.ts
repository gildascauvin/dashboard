import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class AthleteProfileService {
  onSelectedMetric: any = new EventEmitter();
  onUnSelectedMetric: any = new EventEmitter();
  onCreatedMetric:  any = new EventEmitter();
}
