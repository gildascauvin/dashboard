import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class CoachDashboardMenuService {
	onTabChanged: any = new EventEmitter();
}
