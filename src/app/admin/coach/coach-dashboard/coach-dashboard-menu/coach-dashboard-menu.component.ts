import {Component, Inject, Input, OnInit,} from "@angular/core";
import {UsersModalInvitationCreateComponent} from "../../coach-clients/coach-clients-modal/users-modal-invitation-create/users-modal-invitation-create.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CoachDashboardMenuService} from "./coach-dashboard-menu.service";
import {ResizeService} from "../../../../_/services/ui/resize-service.service";
import {DOCUMENT} from "@angular/common";
import {addHours, endOfWeek, format, startOfWeek} from "date-fns";
import {UsersService} from "../../../../_/templates/users.service";
import {FatigueManagementComputerService} from "../../../../_/services/stats/fatigue-management-computer.service";
import {AuthService} from "../../../../_/services/http/auth.service";
import * as _ from "lodash";
import {CustomerStatsComputerService} from "../../../../_/services/stats/customer-stats-computer.service";
import {CustomerStatsSummaryService} from "../../../../_/components/ui/customer-stats-summary/customer-stats-summary.service";
import {UserService} from "../../../../_/services/model/user.service";

@Component({
  selector: "app-coach-dashboard-menu",
  templateUrl: "./coach-dashboard-menu.component.html",
  styleUrls: ["./coach-dashboard-menu.component.scss"],
})
export class CoachDashboardMenuComponent implements OnInit {
  @Input() isFromUrl = true;
  @Input() activeTab = 'training';

  bsModalRef: BsModalRef;
  user: any = {};

  links : any = {
    training: ['/coach', 'dashboard'],
    fatigue: ['/coach', 'dashboard', 'performance'],
    wellness: ['/coach', 'dashboard', 'wellness'],
  };

  workouts: any = {};
  currentWorkout : any = {};
  sub: any = {};
  isLoading = false;

  fatigueManagementData: any = [];

  fatigueManagement: any = {
    load: {constraint: 0, rcac: 0},
    variation: {monotony: 0},
    fitness: {fitness: 0, energyScore: 0},
    colors: {load: {color1: '', color2: ''}, variation: {percent: 0}, fitness: {color1: ''}}
  };

  size: number = 1;
  responsiveSize: number = 768;

  currentDate: any = new Date();
  currentFrom: any = new Date();
  currentTo: any = new Date();

  constructor(
    private modalService: BsModalService,
    private coachDashboardMenuService: CoachDashboardMenuService,
    private customerStatsComputerService: CustomerStatsComputerService,
    private customerStatsSummaryService: CustomerStatsSummaryService,
    private usersService: UsersService,
    private authService: AuthService,
    private userService: UserService,
    private fatigueManagementComputer: FatigueManagementComputerService,
    private resizeSvc: ResizeService,
    @Inject(DOCUMENT) private _document
  ) {

  }

  ngOnInit(): void {

    this.detectScreenSize();

    if (this.isFromUrl === false) {
      this.links = {
        training: ['/athlete', 'team'],
        fatigue: ['/athlete', 'team', 'performance'],
        wellness: ['/athlete', 'team', 'wellness']
      };
    }


    this.currentFrom = startOfWeek(new Date(), { weekStartsOn: 1 });
    this.currentTo = endOfWeek(new Date(), { weekStartsOn: 1 });

    this.user = this.isFromUrl ? this.authService.getUserData() : this.authService.getUserClientData();

    this.initWorkouts();
    this.computeFatigueManagement(this.currentFrom, this.currentTo);
  }

  ngOnDestroy(): void {}

  setActiveTab(tab) {
    this.activeTab = tab;
    this.coachDashboardMenuService.onTabChanged.emit(tab);
  }

  openInvitationCreateModal() {
    const initialState = {
      modelId: this.user.id,
    };

    this.bsModalRef = this.modalService.show(
      UsersModalInvitationCreateComponent,
      {
        keyboard: false,
        initialState: initialState,
        class: "modal-xs",
      }
    );
  }

  initWorkouts() {

    let fromDate = CoachDashboardMenuComponent.formatDate(this.currentFrom) + ' 00:00:00';
    let toDate = CoachDashboardMenuComponent.formatDate(this.currentTo) + ' 00:00:00';

    if (this.isFromUrl) {
      this.sub.allWorkouts = this.usersService.getAllTeamWorkouts(fromDate, toDate, 1).subscribe((workouts: any) => {
        let allKeys = Object.keys(workouts);
        let isEmpty = allKeys.length == 0;

        if (!isEmpty) {
          this.workouts = workouts;

          let allWorkouts = [];

          for (const property in workouts) {
            for (const workoutPosition in workouts[property]) {
              allWorkouts.push(workouts[property][workoutPosition]);
            }
          }

          this.fatigueManagementData = this.fatigueManagementComputer.computeWithWorkouts(allWorkouts);
        }
      });

    } else {
      this.sub.allWorkouts = this.usersService.getAllClientTeamWorkouts(this.user.id, fromDate, toDate, 1).subscribe((workouts: any) => {
        let allKeys = Object.keys(workouts);
        let isEmpty = allKeys.length == 0;

        if (!isEmpty) {
          this.workouts = workouts;

          let allWorkouts = [];

          for (const property in workouts) {
            for (const workoutPosition in workouts[property]) {
              allWorkouts.push(workouts[property][workoutPosition]);
            }
          }

          this.fatigueManagementData = this.fatigueManagementComputer.computeWithWorkouts(allWorkouts);
        }
      });
    }
  }

  private computeFatigueManagement(dateFrom, dateTo) {

    let from = _.clone(dateFrom);
    let to = _.clone(dateTo);

    let weeksFrom = _.clone(from);
    from.setDate(from.getDate() - 21);
    let weeksTo = _.clone(to);

    let fromDate = CoachDashboardMenuComponent.formatDate(from) + ' 00:00:00';
    let toDate = CoachDashboardMenuComponent.formatDate(to) + ' 00:00:00';

    if (this.isFromUrl) {

      this.sub.onGetAllWorkout = this.usersService.getAllTeamWorkouts(fromDate, toDate, 1).subscribe((workouts: any) => {

        if (workouts) {
          let weeksWorkouts = CoachDashboardMenuComponent.getWorkoutsFromTo(workouts, weeksFrom, 7);

          if (Object.keys(weeksWorkouts).length > 0) {
            let weeksCustomerStats = this.customerStatsComputerService.computeStatsForAllWorkouts(weeksWorkouts, true);
            weeksCustomerStats = _.cloneDeep(weeksCustomerStats);
            let customerStats = this.customerStatsComputerService.computeStatsForAllWorkouts(workouts, true, from, to);

            this.fatigueManagement = this.customerStatsSummaryService.computeStatFatigueManagement(
              weeksWorkouts,
              workouts,
              weeksCustomerStats.stats,
              customerStats,
              weeksFrom,
              weeksTo
            );
          }
        }
      });

    } else {
      this.sub.onGetAllWorkout = this.usersService.getAllClientTeamWorkouts(this.user.id, fromDate, toDate, 1).subscribe((workouts: any) => {

        if (workouts) {
          let weeksWorkouts = CoachDashboardMenuComponent.getWorkoutsFromTo(workouts, weeksFrom, 7);

          if (Object.keys(weeksWorkouts).length > 0) {
            let weeksCustomerStats = this.customerStatsComputerService.computeStatsForAllClientWorkouts(weeksWorkouts, true);
            weeksCustomerStats = _.cloneDeep(weeksCustomerStats);
            let customerStats = this.customerStatsComputerService.computeStatsForAllClientWorkouts(workouts, true, from, to);

            this.fatigueManagement = this.customerStatsSummaryService.computeStatFatigueManagement(
              weeksWorkouts,
              workouts,
              weeksCustomerStats.stats,
              customerStats,
              weeksFrom,
              weeksTo
            );
          }
        }
      });
    }
  }

  private static formatDate(d) {
    var month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  private static getWorkoutsFromTo(workouts, from, totalDays) {
    let data = {};
    let currentDate = _.clone(from);

    for (let i = 0; i < totalDays; i++) {
      let property = format(currentDate, "yyyy-MM-dd");

      if (workouts[property]) {
        data[property] = workouts[property];
      }

      currentDate = addHours(currentDate, 24);
    }

    return _.cloneDeep(data);
  }

  private detectScreenSize() {
    const currentSize = this._document.body.clientWidth;
    this.size = currentSize;
    this.resizeSvc.onResize(currentSize);
  }
}
