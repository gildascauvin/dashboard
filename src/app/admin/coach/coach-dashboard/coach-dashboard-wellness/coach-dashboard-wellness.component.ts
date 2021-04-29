import {Component, Input, OnInit,} from "@angular/core";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {AuthService} from "../../../../_/services/http/auth.service";
import {UserService} from "../../../../_/services/model/user.service";
import {UsersService} from "../../../../_/templates/users.service";
import {CoachDashboardMenuService} from "../coach-dashboard-menu/coach-dashboard-menu.service";
import {endOfWeek} from "date-fns";
import * as _ from "lodash";
import {UsersModalInvitationDeleteComponent} from "../../coach-clients/coach-clients-modal/users-modal-invitation-delete/users-modal-invitation-delete.component";

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

  user: any = {
    data: {},
    profil: []
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private usersService: UsersService,
    private modalService: BsModalService,
    private coachDashboardMenuService: CoachDashboardMenuService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUserData();
    this._initUser();

    if (this.isFromUrl) {
      this.clients = this.user.clients;

      this.computeAllWellnesses();

    } else {
      for (let i in this.user.coachs) {
        let coachId = this.user.coachs[i].user_id;

        this.usersService.getOne(coachId).subscribe((user: any) => {
          this.clients = user.clients;
          this.computeAllWellnesses();
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

  computeAllWellnesses() {

    let to = endOfWeek(new Date(), {weekStartsOn: 1});
    let from = _.clone(to);
    from.setDate(from.getDate() - 7);
    let fromDate = this.formatDate(from) + ' 00:00:00';
    let toDate = this.formatDate(to) + ' 00:00:00';

    this.clients.forEach((client, key) => {
      let clientId = client.client_id;

      this.sub.onGetAllWorkout = this.usersService
        .getAllClientWorkouts(clientId, fromDate, toDate, 1)
        .subscribe((workouts: any) => {
          this.dataWellnessClients[clientId] = this._computeWellness(clientId, workouts);

          if (Object.is(this.clients.length - 1, key)) {
            this.clients.sort((a,b) => this.dataWellnessSorting['client-id-' + b.client_id] - this.dataWellnessSorting['client-id-' + a.client_id]);
            this.dataWellnessIsLoading = true;
          }
        });
    });
  }

  _computeWellness(clientId, workouts) {

    let energyScores = 0;
    let energyScoresLength = 0;
    let rpeScores = 0;
    let rpeScoresLength = 0;
    let totalCompleteData = 0;

    let listScores = ['diet', 'sleep', 'mood', 'energy', 'stress'];

    let scores = {
      diet: 0, sleep: 0, mood: 0, energy: 0, stress: 0,
      dietLength: 0, sleepLength: 0, moodLength: 0, energyLength: 0, stressLength: 0
    };

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

        listScores.forEach(function(scoreName) {
          if (dayWorkouts[workoutKey][scoreName] > 0) {
            scores[scoreName] += dayWorkouts[workoutKey][scoreName];
            scores[scoreName + "Length"]++;

            totalCompleteData++;
          }
        });
      }
    }

    let energyScore = (energyScoresLength > 0) ? Math.round(((energyScores / energyScoresLength / 10) + Number.EPSILON) * 100) / 100 : null;
    let rpeScore = (rpeScoresLength > 0) ? Math.round(((rpeScores / rpeScoresLength) + Number.EPSILON) * 100) / 100 : null;
    let zoneScore = (energyScore !== null && rpeScore !== null) ? energyScore - rpeScore : null;

    let zoneName = '';
    let zoneColor = '';

    if (zoneScore > 1.33) {
      zoneName = 'Recovery';
      zoneColor = 'yellow';
      totalCompleteData += 2;
    } else if (zoneScore < -1.33) {
      zoneName = 'Overreaching';
      zoneColor = 'red';
      totalCompleteData += 1;
    } else if (zoneScore !== null) {
      zoneName = 'Optimal';
      zoneColor = 'green';
      totalCompleteData += 3;
    }

    this.dataWellnessSorting['client-id-' + clientId] = totalCompleteData;

    return {
      'zoneColor': zoneColor,
      'zoneName': zoneName,
      'diet': CoachDashboardWellnessComponent._computeSingleEnergyScore(scores.diet, scores.dietLength),
      'sleep': CoachDashboardWellnessComponent._computeSingleEnergyScore(scores.sleep, scores.sleepLength),
      'mood': CoachDashboardWellnessComponent._computeSingleEnergyScore(scores.mood, scores.moodLength),
      'energy': CoachDashboardWellnessComponent._computeSingleEnergyScore(scores.energy, scores.energyLength),
      'stress': CoachDashboardWellnessComponent._computeSingleEnergyScore(scores.stress, scores.stressLength),
    };
  }

  private static _computeSingleEnergyScore(score, scoreLength) {

    let result = 0;
    let color = '';

    if (scoreLength == 0 || score == 0) {
      result = 0;
    } else {
      result = score / scoreLength / 3 * 10;
      result = Math.round((result + Number.EPSILON) * 10) / 10;

      color = 'yellow';

      if (result <= 5) {
        color = 'red';
      } else if (result >= 8) {
        color = 'green';
      }
    }

    return {
      value: result,
      color: color
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

    return (totalDataConfirmed > 0) ? totalEnergy / (3 * totalDataConfirmed) * 100 : 0;
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
