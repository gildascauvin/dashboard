import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class AthleteDashboardMenuService {
	onTabChanged: any = new EventEmitter();
}
