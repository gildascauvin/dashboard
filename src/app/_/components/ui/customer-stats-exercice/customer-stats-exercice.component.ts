import { Component, OnInit, Input } from '@angular/core';
import { CustomerStatsService } from '../customer-stats-range/customer-stats-range.service';

@Component({
  selector: 'app-customer-stats-exercice',
  templateUrl: './customer-stats-exercice.component.html',
  styleUrls: ['./customer-stats-exercice.component.scss']
})
export class CustomerStatsExerciceComponent implements OnInit {
  @Input() isFromUrl = true;

	movements: any = [];
  categoriesData: any = [];
  sub: any = {};

  constructor(private customerStatsService: CustomerStatsService) { }

  ngOnInit(): void {
    this.sub.onStatsUpdated = this.customerStatsService
  		.onStatsUpdated
  		.subscribe((component) => {
				this.movements = component.movements;
				this.categoriesData = component.categoriesData;
    });

  	this.sub.onStatsUpdatedStart = this.customerStatsService
  		.onStatsUpdatedStart
  		.subscribe(() => {
  			this.movements = [];
  			this.categoriesData = [];
  		});
  }

  ngOnDestroy(): void {
  	this.sub.onStatsUpdated && this.sub.onStatsUpdated.unsubscribe();
  	this.sub.onStatsUpdatedStart && this.sub.onStatsUpdatedStart.unsubscribe();
  }
}
