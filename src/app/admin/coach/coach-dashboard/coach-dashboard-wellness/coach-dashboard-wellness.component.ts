import {Component, Input, OnInit,} from "@angular/core";

@Component({
  selector: "app-coach-dashboard-wellness",
  templateUrl: "./coach-dashboard-wellness.component.html",
  styleUrls: ["./coach-dashboard-wellness.component.scss"],
})
export class CoachDashboardWellnessComponent implements OnInit {
  @Input() isFromUrl = true;

  constructor() {}

  ngOnInit(): void {}
  ngOnDestroy(): void {}
}
