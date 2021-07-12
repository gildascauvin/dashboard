import {Component, Input, OnInit,} from "@angular/core";
import {AuthService} from "../../../../_/services/http/auth.service";
import * as _ from "lodash";
import {UsersModalInvitationDeleteComponent} from "../../coach-clients/coach-clients-modal/users-modal-invitation-delete/users-modal-invitation-delete.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {UsersService} from "../../../../_/templates/users.service";
import {UserService} from "../../../../_/services/model/user.service";
import {CoachDashboardMenuService} from "../coach-dashboard-menu/coach-dashboard-menu.service";
import {addHours, differenceInDays, endOfWeek, format, startOfWeek} from "date-fns";
import {DoorgetsTranslateService} from "doorgets-ng-translate";
import {CustomerStatsComputerService} from "../../../../_/services/stats/customer-stats-computer.service";
import {CustomerStatsSummaryService} from "../../../../_/components/ui/customer-stats-summary/customer-stats-summary.service";
import {CustomerStatsService} from "../../../../_/components/ui/customer-stats-range/customer-stats-range.service";

@Component({
  selector: "app-coach-dashboard-performance",
  templateUrl: "./coach-dashboard-performance.component.html",
  styleUrls: ["./coach-dashboard-performance.component.scss"],
})
export class CoachDashboardPerformanceComponent implements OnInit {
  @Input() isFromUrl = true;

  activeTab: any = 'fatigue';

  isLoading: boolean = false;
  bsModalRef: BsModalRef;
  sub: any = {};

  dataPerformanceIsLoading: boolean = false;
  dataPerformanceClients: any = [];
  dataPerformanceSorting: any = [];

  clients: any;

  dateStartOn: any;
  dateEndOn: any;

  user: any = {
    data: {},
    profil: []
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private usersService: UsersService,
    private modalService: BsModalService,
    private coachDashboardMenuService: CoachDashboardMenuService,
    private doorgetsTranslateService: DoorgetsTranslateService,
    public customerStatsComputerService: CustomerStatsComputerService,
    private customerStatsSummaryService: CustomerStatsSummaryService,
    private customerStatsService: CustomerStatsService,
  ) {
  }

  ngOnInit(): void {
    this.user = this.authService.getUserData();
    this._initUser();

    this.customerStatsService.onRefreshStats.emit();

    this.sub.onStatsUpdated = this.customerStatsService.onStatsUpdated.subscribe(
      (component) => {
        this.dateStartOn = component.startDay;
        this.dateEndOn = component.endDay;

        if (this.isFromUrl) {
          this.clients = this.user.clients;

          this.computeAllPerformances(this.clients, this.dateStartOn, this.dateEndOn);

        } else {
          for (let i in this.user.coachs) {
            let coachId = this.user.coachs[i].user_id;

            this.usersService.getOne(coachId).subscribe((user: any) => {
              this.clients = user.clients;
              this.computeAllPerformances(user.clients, this.dateStartOn, this.dateEndOn);
            });
          }
        }
      }
    );

    this.sub.subjectUpdateUsers = this.usersService.onUserUpdated.subscribe(() => {
      this._initUser();
    });

    this.sub.onTabChanged = this.coachDashboardMenuService.onTabChanged.subscribe(
      (tab) => {
        this.setActiveTab(tab);
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.subjectUpdateUsers && this.sub.subjectUpdateUsers.unsubscribe();
    this.sub.onTabChanged && this.sub.onTabChanged.unsubscribe();
    this.sub.onStatsUpdated && this.sub.onStatsUpdated.unsubscribe();
  }

  computeAllPerformances(clients, dateFrom, dateTo) {

    let from = _.clone(dateFrom);
    let to = _.clone(dateTo);

    let weeksFrom = _.clone(from);
    from.setDate(from.getDate() - 21);
    let weeksTo = _.clone(to);

    let fromDate = this.formatDate(from) + ' 00:00:00';
    let toDate = this.formatDate(to) + ' 00:00:00';

    if (this.isFromUrl) {
      this.sub.onGetAllWorkout = this.usersService.getAllTeamWorkouts(fromDate, toDate, 1).subscribe((workouts) => {
        this._computeAllPerformanceForAllClients(workouts, weeksFrom, weeksTo, from, to);
      });
    } else {
      this.sub.onGetAllWorkout = this.usersService.getAllClientTeamWorkouts(this.user.id, fromDate, toDate, 1).subscribe((workouts) => {
        this._computeAllPerformanceForAllClients(workouts, weeksFrom, weeksTo, from, to);
      });
    }
  }

  private _computeAllPerformanceForAllClients(allWorkouts, weeksFrom, weeksTo, from, to) {
    this.dataPerformanceClients = [];
    this.dataPerformanceSorting = [];

    this.clients.forEach((client, key) => {
      let clientId = client.client_id;
      let workouts = CoachDashboardPerformanceComponent._getWorkoutsForOneClient(clientId, allWorkouts);

      this.dataPerformanceSorting['client-id-' + clientId] = 1;

      if (workouts) {
        let weeksWorkouts = CoachDashboardPerformanceComponent.getWorkoutsFromTo(workouts, weeksFrom, 7);

        if (Object.keys(weeksWorkouts).length > 0) {
          let weeksCustomerStats = this.customerStatsComputerService.computeStatsForAllClientWorkouts(weeksWorkouts, true);
          weeksCustomerStats = _.cloneDeep(weeksCustomerStats);
          let customerStats = this.customerStatsComputerService.computeStatsForAllClientWorkouts(workouts, true, from, to);

          this.dataPerformanceClients[clientId] = this.customerStatsSummaryService.computeStatFatigueManagement(
            weeksWorkouts,
            workouts,
            weeksCustomerStats.stats,
            customerStats,
            weeksFrom,
            weeksTo
          );

          if (this.dataPerformanceClients[clientId].colors.zone.color == "red") {
            this.dataPerformanceSorting['client-id-' + clientId] = 4;
          } else if (this.dataPerformanceClients[clientId].colors.zone.color == "green") {
            this.dataPerformanceSorting['client-id-' + clientId] = 3;
          } else if (this.dataPerformanceClients[clientId].colors.zone.color == "yellow") {
            this.dataPerformanceSorting['client-id-' + clientId] = 2;
          } else {
            this.dataPerformanceSorting['client-id-' + clientId] = 1;
          }
        }
      }

      if (Object.is(this.clients.length - 1, key)) {
        this.clients.sort((a, b) => this.dataPerformanceSorting['client-id-' + b.client_id] - this.dataPerformanceSorting['client-id-' + a.client_id]);
        this.dataPerformanceIsLoading = true;
      }
    });
  }

  private static _getWorkoutsForOneClient(clientId, workouts) {
    let clientWorkouts = {};

    for (let dayWorkout in workouts) {
      let dayWorkouts = workouts[dayWorkout];

      for (let workoutKey in dayWorkouts) {
        let workout = dayWorkouts[workoutKey];

        if (workout.user_id == clientId) {
          if (!clientWorkouts[dayWorkout]) {
            clientWorkouts[dayWorkout] = [];
          }

          clientWorkouts[dayWorkout].push(workout);
        }
      }
    }

    return clientWorkouts;
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

  setCurrentAthletId(clientId) {
    this.authService.setCurrentAthletId(clientId);
    this.authService.setCurrentAthlet({});
  }

  openInvitationDeleteModal(client) {
    const initialState = {
      modelId: this.user.id,
      modelClient: _.cloneDeep(client)
    };
    this.bsModalRef = this.modalService.show(UsersModalInvitationDeleteComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-xs'
    });
  }

  setActiveTab(tab) {
    this.activeTab = tab;
  }

  private _initUser() {
    this.isLoading = true;
    this.sub.userInfo && this.sub.userInfo.unsubscribe();

    this.sub.userInfo = this.usersService.getUser().subscribe((user: any) => {
      this._initData(user);
      this.isLoading = false;
    });
  }

  private _initData(user) {
    if (user && user.data) {
      this.user = _.cloneDeep(user);
      this.userService.initUserInfos(user);
      this.isLoading = false;
    }
  }

  formatDate(d) {
    var month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
}
