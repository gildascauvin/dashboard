import {Component, Input, OnInit,} from "@angular/core";

@Component({
  selector: "app-athlete-dashboard-training",
  templateUrl: "./athlete-dashboard-training.component.html",
  styleUrls: ["./athlete-dashboard-training.component.scss"],
})
export class AthleteDashboardTrainingComponent implements OnInit {
  @Input() isFromUrl = true;
  activeTab : any = 'training';

  ngOnInit(): void {

  }
}
