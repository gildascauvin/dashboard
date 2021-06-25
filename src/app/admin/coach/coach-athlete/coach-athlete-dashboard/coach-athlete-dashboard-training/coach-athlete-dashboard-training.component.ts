import {Component, Input, OnInit,} from "@angular/core";

@Component({
  selector: "app-coach-athlete-dashboard-training",
  templateUrl: "./coach-athlete-dashboard-training.component.html",
  styleUrls: ["./coach-athlete-dashboard-training.component.scss"],
})
export class CoachAthleteDashboardTrainingComponent implements OnInit {
  @Input() isFromUrl = false;

  ngOnInit(): void {}
}
