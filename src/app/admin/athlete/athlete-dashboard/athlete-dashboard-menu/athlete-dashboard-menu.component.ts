import {Component, Inject, Input, OnInit,} from "@angular/core";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {AthleteDashboardMenuService} from "./athlete-dashboard-menu.service";
import {FatigueManagementComputerService} from "../../../../_/services/stats/fatigue-management-computer.service";
import {TemplatesModalStartSessionComponent} from "../../../../_/templates/templates-modal/templates-modal-start-session/templates-modal-start-session.component";
import {endOfWeek, format, startOfWeek} from "date-fns";
import {UsersService} from "../../../../_/templates/users.service";
import {AuthService} from "../../../../_/services/http/auth.service";
import {UserService} from "../../../../_/services/model/user.service";
import * as _ from "lodash";
import {CustomerStatsComputerService} from "../../../../_/services/stats/customer-stats-computer.service";
import {CustomerStatsSummaryService} from "../../../../_/components/ui/customer-stats-summary/customer-stats-summary.service";
import {CustomerStatsService} from "../../../../_/components/ui/customer-stats-range/customer-stats-range.service";
import {AthleteCalendarService} from "../../athlete-calendar/athlete-calendar.service";
import {ResizeService} from "../../../../_/services/ui/resize-service.service";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: "app-athlete-dashboard-menu",
  templateUrl: "./athlete-dashboard-menu.component.html",
  styleUrls: ["./athlete-dashboard-menu.component.scss"],
})
export class AthleteDashboardMenuComponent implements OnInit {
  @Input() isFromUrl = true;
  @Input() activeTab = 'training';
  @Input() activeSubTab = '';

  bsModalRef: BsModalRef;
  user: any = {};
  workouts: any = {};
  currentWorkout : any = {};
  sub: any = {};

  fatigueManagementData: any = [];

  fatigueManagement: any = {
    load: {constraint: 0, rcac: 0},
    variation: {monotony: 0},
    fitness: {fitness: 0, energyScore: 0},
    colors: {load: {color1: '', color2: ''}, variation: {percent: 0}, fitness: {color1: ''}}
  };

  isLoading = false;

  links: any = {
    training: ['/athlete', 'dashboard'],
    fatigue: ['/athlete', 'fatigue'],
    wellness: ['/athlete', 'wellness'],
    profile: ['/athlete', 'profile'],
  };

  size: number = 1;
  responsiveSize: number = 768;

  currentDate: any = new Date();
  currentFrom: any = new Date();
  currentTo: any = new Date();

  constructor(
    private modalService: BsModalService,
    private athleteDashboardMenuService: AthleteDashboardMenuService,
    private fatigueManagementComputer: FatigueManagementComputerService,
    private customerStatsComputerService: CustomerStatsComputerService,
    private customerStatsSummaryService: CustomerStatsSummaryService,
    private customerStatsService: CustomerStatsService,
    private athleteCalendarService: AthleteCalendarService,
    private usersService: UsersService,
    private userService: UserService,
    private authService: AuthService,
    private resizeSvc: ResizeService,
    @Inject(DOCUMENT) private _document
  ) {}

  ngOnInit(): void {

    this.detectScreenSize();

    if (this.isFromUrl === false) {
      this.links = {
        training: ['/coach', 'athlet', 'dashboard'],
        fatigue: ['/coach', 'athlet', 'fatigue'],
        wellness: ['/coach', 'athlet', 'wellness'],
        profile: ['/coach', 'athlete', 'profile']
      };
    }

    this.sub.onStatsUpdatedStart = this.customerStatsService.onStatsUpdatedStart.subscribe(() => {
        this.refreshData();
      }
    );

    this.sub.onWorkoutSaved = this.usersService.onWorkoutSaved.subscribe((workout) => {
        if (workout !== true) {
          this.currentWorkout = workout;

          console.log(this.currentWorkout);
          console.log(format(this.currentDate, 'yyyy-MM-dd00:00:00'));
          if (this.currentWorkout.started_at == format(this.currentDate, 'yyyy-MM-dd') + '00:00:00') {
            this.fatigueManagementData = this.fatigueManagementComputer.compute(this.currentWorkout);
          }

          this.computeFatigueManagement(this.currentFrom, this.currentTo);
        }
      }
    );

    this.sub.onStatsUpdated = this.customerStatsService.onStatsUpdated.subscribe((component) => {
        this.refreshData();

        console.log(this.currentFrom);
        console.log(this.currentTo);

        this.computeFatigueManagement(this.currentFrom, this.currentTo);
        let now = format(this.currentDate, 'yyyy-MM-dd');

        if (component.workouts[now] && component.workouts[now][0]) {
          this.currentWorkout = component.workouts[now][0];
          this.fatigueManagementData = this.fatigueManagementComputer.compute(this.currentWorkout);
        }
      }
    );

    this.sub.onDateCalendarSelected = this.athleteCalendarService.onDateSelected.subscribe((date) => {
        this.refreshData();
        this.initWorkouts(date);

        this.currentDate = date;

        this.currentFrom = startOfWeek(date, { weekStartsOn: 1 });
        this.currentTo = endOfWeek(date, { weekStartsOn: 1 });
        this.computeFatigueManagement(this.currentFrom, this.currentTo);
      }
    );

    this.user = this.isFromUrl ? this.authService.getUserData() : this.authService.getUserClientData();

    this._initUser();
    this.initWorkouts(new Date());

    this.currentFrom = startOfWeek(new Date(), { weekStartsOn: 1 });
    this.currentTo = endOfWeek(new Date(), { weekStartsOn: 1 });
    this.computeFatigueManagement(this.currentFrom, this.currentTo);
    console.log('3 / init FatigueManagement');
  }

  refreshData() {
    this.fatigueManagement = {
      load: {constraint: 0, rcac: 0}, variation: {monotony: 0}, fitness: {fitness: 0, energyScore: 0},
      colors: {load: {color1: '', color2: ''}, variation: {percent: 0}, fitness: {color1: ''}}
    };

    this.fatigueManagementData = [];
    this.currentWorkout = {};
  }

  ngOnDestroy(): void {
    this.sub.userInfo && this.sub.userInfo.unsubscribe();
    this.sub.onWorkoutSaved && this.sub.onWorkoutSaved.unsubscribe();
    this.sub.onStatsUpdated && this.sub.onStatsUpdated.unsubscribe();
    this.sub.onStatsUpdatedStart && this.sub.onStatsUpdatedStart.unsubscribe();
    this.sub.onGetAllWorkoutBis && this.sub.onGetAllWorkoutBis.unsubscribe();
    this.sub.onGetAllWorkout && this.sub.onGetAllWorkout.unsubscribe();
    this.sub.onDateCalendarSelected && this.sub.onDateCalendarSelected.unsubscribe();
    this.sub.allWorkouts && this.sub.allWorkouts.unsubscribe();
  }

  setActiveTab(tab) {
    this.activeTab = tab;
    this.athleteDashboardMenuService.onTabChanged.emit(tab);
  }

  openStartSessionModal(workout, day, onlyReadinessSurvey = false) {
    const initialState = {
      day: day,
      step: 1,
      workout: workout,
      isPlanning: true,
      userId: this.user.id,
      profil: this.user.profil || [],
      isFromUrl: this.isFromUrl,
      onlyReadynessSurvey: onlyReadinessSurvey
    };

    this.bsModalRef = this.modalService.show(
      TemplatesModalStartSessionComponent,
      {
        keyboard: false,
        initialState: initialState,
        class: "modal-lg",
      }
    );
  }

  initWorkouts(fromDate) {
    let now = format(fromDate, 'yyyy-MM-dd');

    if (this.isFromUrl) {
      this.sub.allWorkouts = this.usersService.getAllWorkouts(now, now, 1).subscribe((workouts: any) => {
        let allKeys = Object.keys(workouts);
        let isEmpty = allKeys.length == 0;

        if (!isEmpty) {
          this.workouts = workouts;

          if (workouts[now] && workouts[now][0]) {
            this.currentWorkout = workouts[now][0];
            this.fatigueManagementData = this.fatigueManagementComputer.compute(this.currentWorkout);
          }
        }
      });

    } else {
      let clientId = this.authService.getCurrentAthletId();
      this.sub.allWorkouts = this.usersService.getAllClientWorkouts(clientId, now, now, 1).subscribe((workouts: any) => {
        let allKeys = Object.keys(workouts);
        let isEmpty = allKeys.length == 0;

        if (!isEmpty) {
          this.workouts = workouts;

          if (workouts[now] && workouts[now][0]) {
            this.currentWorkout = workouts[now][0];
            this.fatigueManagementData = this.fatigueManagementComputer.compute(this.currentWorkout);
          }
        }
      });
    }
  }

  private _initUser() {
    this.isLoading = true;
    this.sub.userInfo && this.sub.userInfo.unsubscribe();

    if (this.isFromUrl) {
      this.sub.userInfo = this.usersService.getUser().subscribe((user: any) => {
        if (user) {
          this.user = user;

          this.userService.initUserInfos(user);
          this.isLoading = false;
        }
      });
    } else {
      let userClientId = this.authService.getCurrentAthletId();

      this.sub.userInfo = this.usersService.getUserClient(userClientId).subscribe((user: any) => {
        if (user) {
          this.user = user;

          if (this.isFromUrl) {
            this.userService.initUserInfos(user);
          } else {
            this.userService.initUserClientInfos(user);
          }
          this.isLoading = false;
        }
      });
    }
  }

  private computeFatigueManagement(dateFrom, dateTo) {

    let from = _.clone(dateFrom);
    let to = _.clone(dateTo);

    let globalFrom = _.clone(from);
    from.setDate(from.getDate() - 21);
    let globalTo = _.clone(to);

    let globalFromDate = AthleteDashboardMenuComponent.formatDate(globalFrom) + ' 00:00:00';
    let globalToDate = AthleteDashboardMenuComponent.formatDate(globalTo) + ' 00:00:00';
    let fromDate = AthleteDashboardMenuComponent.formatDate(from) + ' 00:00:00';
    let toDate = AthleteDashboardMenuComponent.formatDate(to) + ' 00:00:00';

    console.log(globalFromDate);
    console.log(globalToDate);
    console.log(fromDate);
    console.log(toDate);

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

            console.log(this.fatigueManagement);
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

              console.log(this.fatigueManagement);
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

  private static getWorkout(day?) {
    day = day || {};
    return {day: day.day, date: day.date, month: day.month, year: day.year, program: {name: '', exercices: []}};
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
