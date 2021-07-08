import {Component, Input, OnInit,} from "@angular/core";
import {CoachDashboardMenuService} from "./coach-dashboard-menu/coach-dashboard-menu.service";
import {Router} from "@angular/router";

@Component({
  selector: "app-coach-dashboard",
  templateUrl: "./coach-dashboard.component.html",
  styleUrls: ["./coach-dashboard.component.scss"],
})
export class CoachDashboardComponent implements OnInit {
  @Input() isFromUrl = true;
  activeTab : any = 'training';
  sub: any = {};

  constructor(
    private router: Router,
    private coachDashboardMenuService: CoachDashboardMenuService
  ) {

  }

  ngOnInit(): void {
    let paths = this.router.url.split('/');

    if (paths.length >= 3 && ((paths[1] === 'coach' && paths[3] === 'performance') || ((paths[1] === 'athlete' && paths[3] === 'performance')))) {
        this.setActiveTab('fatigue');
    }

    if (paths.length >= 3 && ((paths[1] === 'coach' && paths[3] === 'wellness') || ((paths[1] === 'athlete' && paths[3] === 'wellness')))) {
      this.setActiveTab('wellness');
    }

    this.sub.onTabChanged = this.coachDashboardMenuService.onTabChanged.subscribe(
      (tab) => {
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
