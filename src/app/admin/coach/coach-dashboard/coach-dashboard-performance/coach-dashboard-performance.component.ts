import {Component, Input, OnInit,} from "@angular/core";
import {AuthService} from "../../../../_/services/http/auth.service";
import * as _ from "lodash";
import {UsersModalInvitationDeleteComponent} from "../../coach-clients/coach-clients-modal/users-modal-invitation-delete/users-modal-invitation-delete.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {UsersService} from "../../../../_/templates/users.service";
import {UserService} from "../../../../_/services/model/user.service";
import {CoachDashboardMenuService} from "../coach-dashboard-menu/coach-dashboard-menu.service";
import {endOfWeek} from "date-fns";
import {DoorgetsTranslateService} from "doorgets-ng-translate";

@Component({
  selector: "app-coach-dashboard-performance",
  templateUrl: "./coach-dashboard-performance.component.html",
  styleUrls: ["./coach-dashboard-performance.component.scss"],
})
export class CoachDashboardPerformanceComponent implements OnInit {
  @Input() isFromUrl = true;

  activeTab : any = 'performance';

  isLoading: boolean  = false;
  bsModalRef: BsModalRef;
  sub: any = {};

  dataPerformanceIsLoading: boolean = false;
  dataPerformanceClients: any = [];
  dataPerformanceSorting: any = [];

  clients: any;

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
    private doorgetsTranslateService: DoorgetsTranslateService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUserData();
    this._initUser();

    if (this.isFromUrl) {
      this.clients = this.user.clients;

      this.computeAllPerformances(this.clients);

    } else {
      for (let i in this.user.coachs) {
        let coachId = this.user.coachs[i].user_id;

        this.usersService.getOne(coachId).subscribe((user: any) => {
          this.clients = user.clients;
          this.computeAllPerformances(user.clients);
        });
      }
    }

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
  }

  computeAllPerformances(clients) {

    let to = endOfWeek(new Date(), {weekStartsOn: 1});
    let from = _.clone(to);
    from.setDate(from.getDate() - 7);
    let fromDate = this.formatDate(from) + ' 00:00:00';
    let toDate = this.formatDate(to) + ' 00:00:00';

    clients.forEach((client, key) => {
      let clientId = client.client_id;

      this.sub.onGetAllWorkout = this.usersService
        .getAllClientWorkouts(clientId, fromDate, toDate, 1)
        .subscribe((workouts: any) => {
          this.dataPerformanceClients[clientId] = this._computePerformance(clientId, client.status, workouts);

          if (Object.is(this.clients.length - 1, key)) {
            this.clients.sort((a,b) => this.dataPerformanceSorting['client-id-' + b.client_id] - this.dataPerformanceSorting['client-id-' + a.client_id]);
            this.dataPerformanceIsLoading = true;
          }
        });
    });
  }

  _computePerformance(clientId, clientStatus, workouts) {

    let energyScores = 0;
    let energyScoresLength = 0;
    let rpeScores = 0;
    let rpeScoresLength = 0;

    let totalCompleteData = 0;

    for (let dayWorkout in workouts) {
      let dayWorkouts = workouts[dayWorkout];

      for (let workoutKey in dayWorkouts) {
        let workoutEnergyScore = this._computeEnergyScore(dayWorkouts[workoutKey]);

        if (workoutEnergyScore > 0) {
          energyScores += workoutEnergyScore;
          energyScoresLength++;
        }
        if (dayWorkouts[workoutKey].rate > 0) {
          rpeScores += dayWorkouts[workoutKey].rate;
          rpeScoresLength++;
        }
      }
    }

    let energyScore = (energyScoresLength > 0) ? Math.round(((energyScores / energyScoresLength / 10) + Number.EPSILON) * 100) / 100 : null;
    let rpeScore = (rpeScoresLength > 0) ? Math.round(((rpeScores / rpeScoresLength) + Number.EPSILON) * 100) / 100 : null;
    let zoneScore = (energyScore !== null && rpeScore !== null) ? energyScore - rpeScore : null;

    let colorRPE = '';
    let zoneName = '';
    let zoneColor = '';

    if (rpeScore > 8) {
      colorRPE = 'red';
    } else if (rpeScore < 6) {
      colorRPE = 'green';
    } else {
      colorRPE = 'yellow';
    }

    if (zoneScore > 1.33) {
      zoneName = this.doorgetsTranslateService.instant('#Recovery');
      zoneColor = 'yellow';
      totalCompleteData += 2;
    } else if (zoneScore < -1.33) {
      zoneName = this.doorgetsTranslateService.instant('#Overreaching');
      zoneColor = 'red';
      totalCompleteData += 1;
    } else if (zoneScore !== null) {
      zoneName = this.doorgetsTranslateService.instant('#Optimal');
      zoneColor = 'green';
      totalCompleteData += 3;
    }

    // en attente
    if (clientStatus == 1) {
      totalCompleteData = -1;
    } else if (clientStatus == 3) {
      totalCompleteData = -2;
    }

    this.dataPerformanceSorting['client-id-' + clientId] = totalCompleteData;

    return {
      'zoneColor': zoneColor,
      'rpeScore': rpeScore,
      'zoneScore': zoneScore,
      'energyScore': energyScore,
      'colorRPE': colorRPE,
      'zoneName': zoneName
    };
  }

  private _computeEnergyScore(workout) {
    let diet = parseInt(workout.diet);
    let sleep = parseInt(workout.sleep);
    let mood = parseInt(workout.mood);
    let energy = parseInt(workout.energy);
    let stress = parseInt(workout.stress);

    let energyDatas = [diet, sleep, mood, energy, stress];

    let totalEnergy = 0;
    let totalDataConfirmed = 0;
    energyDatas.forEach(function (data) {
      if (data > 0) {
        totalDataConfirmed++
        totalEnergy += data;
      }
    });

    return (totalDataConfirmed > 0) ? totalEnergy / (5 * totalDataConfirmed) * 100 : 0;
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
