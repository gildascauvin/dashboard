import {Component, Input, OnInit,} from "@angular/core";

@Component({
  selector: "app-coach-athlete-dashboard-fatigue",
  templateUrl: "./coach-athlete-dashboard-fatigue.component.html",
  styleUrls: ["./coach-athlete-dashboard-fatigue.component.scss"],
})
export class CoachAthleteDashboardFatigueComponent implements OnInit {
  @Input() isFromUrl = false;

  ngOnInit(): void {}
}
