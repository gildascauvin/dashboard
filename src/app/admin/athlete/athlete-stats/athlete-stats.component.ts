import { Component, OnInit, Input } from '@angular/core';
import {AuthService} from "../../../_/services/http/auth.service";
import {CustomerStatsSummaryService} from "../../../_/components/ui/customer-stats-summary/customer-stats-summary.service";

@Component({
  selector: 'app-athlete-stats',
  templateUrl: './athlete-stats.component.html',
  styleUrls: ['./athlete-stats.component.scss']
})
export class AthleteStatsComponent implements OnInit {
  @Input() isFromUrl = true;
  @Input() keepDates = true;

  sub: any = {};
  isCoach: boolean = false;
  activeTab: string = 'trainingOverload';

  constructor(
    private authService: AuthService,
    private customerStatsSummaryService: CustomerStatsSummaryService
  ) {}

  ngOnInit(): void {
    this.isCoach = this.authService.isCoach();
    this.isFromUrl = !this.isCoach;

    this.sub.onTabChanged = this.customerStatsSummaryService.onTabChanged.subscribe(
      (tab) => {
        console.log(tab);
        this.setActiveTab(tab);
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.onTabChanged && this.sub.onTabChanged.unsubscribe();
  }

  setActiveTab(tab) {
    this.activeTab = tab;
  }
}
