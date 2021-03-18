import {Component, OnInit, Input, Inject} from '@angular/core';
import {AuthService} from "../../../../_/services/http/auth.service";
import {DOCUMENT} from "@angular/common";
import {ResizeService} from "../../../../_/services/ui/resize-service.service";

@Component({
  selector: 'app-athlete-stats-training-overload',
  templateUrl: './athlete-stats-training-overload.component.html',
  styleUrls: ['./athlete-stats-training-overload.component.scss']
})
export class AthleteStatsTrainingOverloadComponent implements OnInit {
  @Input() isFromUrl = true;
  stats:any;
  categoriesData:any;
  @Input() keepDates = true;

  size: number = 1;
  responsiveSize: number = 768;

  user: any = {
    data: {},
    profil: []
  };

  isCoach: boolean = false;

  links: any = {
    fatigueManagement: ['/athlete', 'stats'],
    trainingOverload: ['/athlete', 'stats', 'overload'],
    energySystems: ['/athlete', 'stats', 'energy']
  }

  constructor(
      private authService: AuthService,
      @Inject(DOCUMENT) private _document,
      private resizeSvc: ResizeService
  ) {

  }

  ngOnInit(): void {
    this.detectScreenSize();

    this.isCoach = this.authService.isCoach();
    this.isFromUrl = !this.isCoach;

    this.user = this.isFromUrl
      ? this.authService.getUserData()
      : this.authService.getUserClientData();

    console.log('init training overload');

    if (this.isCoach) {
      this.links = {
        fatigueManagement: ['/coach', 'athlet', 'stats'],
        trainingOverload: ['/coach', 'athlet', 'stats', 'overload'],
        energySystems: ['/coach', 'athlet', 'stats', 'energy'],
      }
    }
  }
  onUpdateStats(event) {
    this.stats = event;
  }
  private detectScreenSize() {
    const currentSize = this._document.body.clientWidth;
    this.size = currentSize;
    this.resizeSvc.onResize(currentSize);
  }
}
