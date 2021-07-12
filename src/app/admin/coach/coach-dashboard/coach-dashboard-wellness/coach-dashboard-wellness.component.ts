import {Component, Input, OnInit,} from "@angular/core";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {AuthService} from "../../../../_/services/http/auth.service";
import {UserService} from "../../../../_/services/model/user.service";
import {UsersService} from "../../../../_/templates/users.service";
import {CoachDashboardMenuService} from "../coach-dashboard-menu/coach-dashboard-menu.service";
import {endOfWeek, startOfWeek} from "date-fns";
import * as _ from "lodash";
import {UsersModalInvitationDeleteComponent} from "../../coach-clients/coach-clients-modal/users-modal-invitation-delete/users-modal-invitation-delete.component";
import {DoorgetsTranslateService} from "doorgets-ng-translate";
import {CustomerStatsSummaryService} from "../../../../_/components/ui/customer-stats-summary/customer-stats-summary.service";
import {CustomerStatsService} from "../../../../_/components/ui/customer-stats-range/customer-stats-range.service";

@Component({
  selector: "app-coach-dashboard-wellness",
  templateUrl: "./coach-dashboard-wellness.component.html",
  styleUrls: ["./coach-dashboard-wellness.component.scss"],
})
export class CoachDashboardWellnessComponent implements OnInit {
  @Input() isFromUrl = true;

  activeTab : any = 'wellness';

  isLoading: boolean  = false;
  bsModalRef: BsModalRef;
  sub: any = {};

  dataWellnessIsLoading: boolean = false;
  dataWellnessClients : any = [];
  dataWellnessSorting : any = [];

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
    private customerStatsSummaryService: CustomerStatsSummaryService,
    private coachDashboardMenuService: CoachDashboardMenuService,
    private doorgetsTranslateService: DoorgetsTranslateService,
    private customerStatsService: CustomerStatsService,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUserData();
    this._initUser();

    this.customerStatsService.onRefreshStats.emit();

    this.sub.onStatsUpdated = this.customerStatsService.onStatsUpdated.subscribe(
      (component) => {
        this.dateStartOn = component.startDay;
        this.dateEndOn = component.endDay;

        this._initWellness();
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

  _initWellness() {
    if (this.isFromUrl) {
      this.clients = this.user.clients;

      this._computeAllWellnesses(this.dateStartOn, this.dateEndOn);

    } else {
      for (let i in this.user.coachs) {
        let coachId = this.user.coachs[i].user_id;

        this.usersService.getOne(coachId).subscribe((user: any) => {
          this.clients = user.clients;
          this._computeAllWellnesses(this.dateStartOn, this.dateEndOn);
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.sub.subjectUpdateUsers && this.sub.subjectUpdateUsers.unsubscribe();
    this.sub.onTabChanged && this.sub.onTabChanged.unsubscribe();
    this.sub.onStatsUpdated && this.sub.onStatsUpdated.unsubscribe();
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

  private _computeAllWellnesses(from, to) {

    let fromDate = CoachDashboardWellnessComponent.formatDate(from) + ' 00:00:00';
    let toDate = CoachDashboardWellnessComponent.formatDate(to) + ' 00:00:00';

    if (this.isFromUrl) {
      this.sub.onGetAllWorkout = this.usersService.getAllTeamWorkouts(fromDate, toDate, 1).subscribe((workouts) => {
        this._computeAllWellnessForAllClients(workouts);
      });
    } else {
      this.sub.onGetAllWorkout = this.usersService.getAllClientTeamWorkouts(this.user.id, fromDate, toDate, 1).subscribe((workouts) => {
        this._computeAllWellnessForAllClients(workouts);
      });
    }
  }

  private _computeAllWellnessForAllClients(workouts) {
    this.clients.forEach((client, key) => {
      let clientId = client.client_id;
      let clientWorkouts = CoachDashboardWellnessComponent._getWorkoutsForOneClient(clientId, workouts);

      this.dataWellnessClients[clientId] = this._computeWellnessForOneClient(clientId, clientWorkouts);

      if (Object.is(this.clients.length - 1, key)) {
        this.clients.sort((a, b) => this.dataWellnessSorting['client-id-' + b.client_id] - this.dataWellnessSorting['client-id-' + a.client_id]);
        this.dataWellnessIsLoading = true;
      }
    });
  }

  private _computeWellnessForOneClient(clientId, workouts) {

    let energyScoresData = this.customerStatsSummaryService.computeEnergyScoresForWorkouts(workouts);

    let diet = energyScoresData.diet;
    let sleep = energyScoresData.sleep;
    let mood = energyScoresData.mood;
    let energy = energyScoresData.energy;
    let stress = energyScoresData.stress;
    let energyScore = energyScoresData.energyScore;

    let zoneName = '';
    let zoneColor = '';

    if (energyScore > 8) {
      zoneName = this.doorgetsTranslateService.instant('#Very good');
      zoneColor = 'high';
    } else if (energyScore < 5) {
      zoneName = this.doorgetsTranslateService.instant('#Very low');
      zoneColor = 'low';
    } else if (energyScore !== null) {
      zoneName = this.doorgetsTranslateService.instant('#Good1');
      zoneColor = 'medium';
    }

    this.dataWellnessSorting['client-id-' + clientId] = energyScore !== null ? energyScore : 0;

    return {
      'zoneColor': zoneColor,
      'zoneName': zoneName,
      'diet': diet,
      'sleep': sleep,
      'mood': mood,
      'energy': energy,
      'stress': stress,
      'energyScore': energyScore > 0 ? Math.round((energyScore * 10 + Number.EPSILON) * 10) / 10 : 0
    };
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

  private static formatDate(d) {
    var month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
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
}
