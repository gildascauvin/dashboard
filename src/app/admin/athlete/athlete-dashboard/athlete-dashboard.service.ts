import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class AthleteDashboardService {
	onWorkoutUpdated: any = new EventEmitter();
  onEnergyScoreUpdated: any = new EventEmitter();
}
