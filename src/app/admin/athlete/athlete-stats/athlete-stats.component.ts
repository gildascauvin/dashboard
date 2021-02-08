import { Component, OnInit, Input } from '@angular/core';
import {AuthService} from "../../../_/services/http/auth.service";

@Component({
  selector: 'app-athlete-stats',
  templateUrl: './athlete-stats.component.html',
  styleUrls: ['./athlete-stats.component.scss']
})
export class AthleteStatsComponent implements OnInit {
  @Input() isFromUrl = true;

  isCoach: boolean = false;

  links: any = {
    fatigueManagement: ['/athlete', 'stats'],
    trainingOverload: ['/athlete', 'stats', 'overload']

  }

  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
    this.isCoach = this.authService.isCoach();

    if (this.isCoach) {
      this.links = {
        fatigueManagement: ['/coach', 'athlet', 'stats'],
        trainingOverload: ['/coach', 'athlet', 'stats', 'overload']

      }
    }
  }
}
