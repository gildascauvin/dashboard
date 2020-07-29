import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class CustomerStatsService {
	onStatsUpdated: any = new EventEmitter();
	onStatsUpdatedStart: any = new EventEmitter();
}
