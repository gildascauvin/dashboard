import {Component, Input, OnInit,} from "@angular/core";

@Component({
  selector: "app-coach-athlete-dashboard-wellness",
  templateUrl: "./coach-athlete-dashboard-wellness.component.html",
  styleUrls: ["./coach-athlete-dashboard-wellness.component.scss"],
})
export class CoachAthleteDashboardWellnessComponent implements OnInit {
  @Input() isFromUrl = false;

  ngOnInit(): void {}
}
