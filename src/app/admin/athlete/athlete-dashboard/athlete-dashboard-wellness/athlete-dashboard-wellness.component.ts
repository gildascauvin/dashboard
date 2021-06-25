import {Component, Inject, Input, OnInit,} from "@angular/core";
import {CustomerStatsService} from "../../../../_/components/ui/customer-stats-range/customer-stats-range.service";
import {AuthService} from "../../../../_/services/http/auth.service";
import {UsersService} from "../../../../_/templates/users.service";
import {CustomerStatsComputerService} from "../../../../_/services/stats/customer-stats-computer.service";
import {CustomerStatsSummaryService} from "../../../../_/components/ui/customer-stats-summary/customer-stats-summary.service";
import * as _ from "lodash";
import {ResizeService} from "../../../../_/services/ui/resize-service.service";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: "app-athlete-dashboard-wellness",
  templateUrl: "./athlete-dashboard-wellness.component.html",
  styleUrls: ["./athlete-dashboard-wellness.component.scss"],
})
export class AthleteDashboardWellnessComponent implements OnInit {
  @Input() isFromUrl = true;
  keepDates = true;
  activeTab : any = 'wellness';
  activeSubTab: any = 'fitness';

  sub: any = {};

  fatigueManagement: any = {
    load: {constraint: 0, rcac: 0},
    variation: {monotony: 0},
    fitness: {fitness: 0, energyScore: 0},
    colors: {load: {color1: '', color2: ''}, variation: {percent: 0}, fitness: {color1: ''}}
  };

  size: number = 1;
  responsiveSize: number = 768;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private customerStatsComputerService: CustomerStatsComputerService,
    private customerStatsSummaryService: CustomerStatsSummaryService,
    private customerStatsService: CustomerStatsService,
    private resizeSvc: ResizeService,
    @Inject(DOCUMENT) private _document
  ) {
  }

  ngOnInit(): void {

    this.detectScreenSize();

    this.sub.onStatsUpdated = this.customerStatsService.onStatsUpdated.subscribe(
      (component) => {
        this.fatigueManagement = {
          load: {constraint: 0, rcac: 0}, variation: {monotony: 0}, fitness: {fitness: 0, energyScore: 0},
          colors: {load: {color1: '', color2: ''}, variation: {percent: 0}, fitness: {color1: ''}}
        };

        let startDay = _.clone(component.startDay);
        let endDay = _.clone(component.endDay);
        this.computeFatigueManagement(startDay, endDay);
      }
    );
  }

  ngOnDestroy() {
    this.sub.onStatsUpdated && this.sub.onStatsUpdated.unsubscribe();
    this.sub.onGetAllWorkout && this.sub.onGetAllWorkout.unsubscribe();
    this.sub.onGetAllWorkoutBis && this.sub.onGetAllWorkoutBis.unsubscribe();
  }

  setActiveSubTab(tab) {
    this.activeSubTab = tab;
  }

  private computeFatigueManagement(from, to) {

    let globalFrom = _.clone(from);
    from.setDate(from.getDate() - 21);
    let globalTo = _.clone(to);

    let globalFromDate = AthleteDashboardWellnessComponent.formatDate(globalFrom) + ' 00:00:00';
    let globalToDate = AthleteDashboardWellnessComponent.formatDate(globalTo) + ' 00:00:00';
    let fromDate = AthleteDashboardWellnessComponent.formatDate(from) + ' 00:00:00';
    let toDate = AthleteDashboardWellnessComponent.formatDate(to) + ' 00:00:00';

    if (this.isFromUrl) {
      this.sub.onGetAllWorkout = this.usersService.getAllWorkouts(globalFromDate, globalToDate, 1).subscribe((globalWorkouts: any) => {
        let globalCustomerStats = this.customerStatsComputerService.computeStatsForAllClientWorkouts(globalWorkouts, true);
        globalCustomerStats = _.cloneDeep(globalCustomerStats);

        this.usersService.getAllWorkouts(fromDate, toDate, 1).subscribe((workouts: any) => {
          if (workouts) {
            let customerStats = this.customerStatsComputerService.computeStatsForAllWorkouts(workouts, true, from, to);
            this.fatigueManagement = this.customerStatsSummaryService.computeStatFatigueManagement(
              globalWorkouts,
              workouts,
              globalCustomerStats.stats,
              customerStats,
              globalFrom,
              globalTo
            );
          }
        });
      });
    } else {
      let clientId = this.authService.getCurrentAthletId();

      this.sub.onGetAllWorkout = this.usersService.getAllClientWorkouts(clientId, globalFromDate, globalToDate, 1).subscribe((globalWorkouts: any) => {

        let globalCustomerStats = this.customerStatsComputerService.computeStatsForAllClientWorkouts(globalWorkouts, true);
        globalCustomerStats = _.cloneDeep(globalCustomerStats);

        this.sub.onGetAllWorkoutBis = this.usersService.getAllClientWorkouts(clientId, fromDate, toDate, 1).subscribe((workouts: any) => {
            if (workouts) {
              let customerStats = this.customerStatsComputerService.computeStatsForAllClientWorkouts(workouts, true, from, to);

              this.fatigueManagement = this.customerStatsSummaryService.computeStatFatigueManagement(
                globalWorkouts,
                workouts,
                globalCustomerStats.stats,
                customerStats,
                globalFrom,
                globalTo
              );
            }
          });
      });
    }
  }

  private detectScreenSize() {
    const currentSize = this._document.body.clientWidth;
    this.size = currentSize;
    this.resizeSvc.onResize(currentSize);
  }

  private static formatDate(d) {
    var month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
}
