import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AthleteCalendarService {
  onCreatedPlanning: any = new EventEmitter();
  onUpdatedPlanning: any = new EventEmitter();
  onRemovedPlanning: any = new EventEmitter();
  onDateSelected: any = new EventEmitter();
}
