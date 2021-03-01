import { Component, OnInit, Input } from '@angular/core';
import {AuthService} from "../../../../_/services/http/auth.service";

@Component({
  selector: 'app-athlete-stats-training-overload',
  templateUrl: './athlete-stats-training-overload.component.html',
  styleUrls: ['./athlete-stats-training-overload.component.scss']
})
export class AthleteStatsTrainingOverloadComponent implements OnInit {
  @Input() isFromUrl = true;
  stats:any;
  categoriesData:any;

  user: any = {
    data: {},
    profil: []
  };

  isCoach: boolean = false;

  links: any = {
    fatigueManagement: ['/athlete', 'stats'],
    trainingOverload: ['/athlete', 'stats', 'overload']
  }

  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {  
    this.isCoach = this.authService.isCoach();
    this.isFromUrl = !this.isCoach;

    this.user = this.isFromUrl
      ? this.authService.getUserData()
      : this.authService.getUserClientData();



    if (this.isCoach) {
      this.links = {
        fatigueManagement: ['/coach', 'athlet', 'stats'],
        trainingOverload: ['/coach', 'athlet', 'stats', 'overload']
      }
    }
  }
  onUpdateStats(event) {
    this.stats = event;
  }
}
