import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class CustomerStatsSummaryService {
	onTabChanged: any = new EventEmitter();
}
