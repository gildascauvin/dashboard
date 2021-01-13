import { Component, OnInit, Inject, Input, SimpleChanges, HostListener, ElementRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DOCUMENT } from '@angular/common';

import { format, addHours, startOfISOWeek, startOfWeek, endOfWeek } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { DoorgetsTranslateService } from 'doorgets-ng-translate';
import { delay } from 'rxjs/operators';

import { webConfig } from '../../../web-config';

import { AuthService } from '../../../_/services/http/auth.service';
import { UserService } from '../../../_/services/model/user.service';
import { UsersService } from '../../../_/templates/users.service';
import { ResizeService } from '../../../_/services/ui/resize-service.service';

import { TemplatesModalExerciceManagerComponent } from '../../../_/templates/templates-modal/templates-modal-exercice-manager/templates-modal-exercice-manager.component';
import {TemplatesModalStartSessionComponent} from "../../../_/templates/templates-modal/templates-modal-start-session/templates-modal-start-session.component";

@Component({
  selector: 'app-athlete-dashboard',
  templateUrl: './athlete-dashboard.component.html',
  styleUrls: ['./athlete-dashboard.component.scss']
})
export class AthleteDashboardComponent implements OnInit {
  @Input() isFromUrl = true;

  bsModalRef: BsModalRef;

  sub: any = {};
  user: any = {};
  currentDate: Date = new Date();

  workouts: any = [];
  flatWorkouts: any = [];

  configExercices: any = webConfig.exercices;

  isEmpty = false;
  isLoading = false;

  size: number = 768;
  responsiveSize: number = 768;

  links: any = {
    profile: ['/athlete', 'profile'],
    performance: ['/athlete', 'profile', 'performance']
  }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private resizeSvc: ResizeService,
    private usersService: UsersService,
    private modalService: BsModalService,
    private doorgetsTranslateService: DoorgetsTranslateService,
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private _document,
  	) {

  }

  ngOnInit(): void {
    this.user = this.isFromUrl
      ? this.authService.getUserData()
      : this.authService.getUserClientData();

    if (!this.isFromUrl) {
      this.links = {
        profile: ['/coach', 'athlet', 'profile'],
        performance: ['/coach', 'athlet', 'profile', 'performance']
      }
    }

    this._initWorkouts();

    this._initUser();

    this.sub.onWorkoutSaved = this.usersService.onWorkoutSaved.subscribe((o) => {
      this._initUser();
    });

    this.sub.onUpdate = this.userService.onUpdate.subscribe((user) => {
      // this.user = this.authService.getUserData();
      this.user = this.isFromUrl
        ? this.authService.getUserData()
        : this.authService.getUserClientData();

      this._checkEmpty();
    });

    this.detectScreenSize();
  }

  ngOnDestroy(): void {
    this.sub.onUpdate && this.sub.onUpdate.unsubscribe();
    this.sub.userInfo && this.sub.userInfo.unsubscribe();
  	this.sub.resizeSvc && this.sub.resizeSvc.unsubscribe();
  }

  private _initUser() {
		this.isLoading = true;
  	this.sub.userInfo && this.sub.userInfo.unsubscribe();

    if (this.isFromUrl) {
      this.sub.userInfo = this.usersService.getUser().subscribe((user: any) => {
        if (user) {
          this.user = user;
          // this.user.workouts = [];

          this._initWorkouts();

          this.userService.initUserInfos(user);
          this.isLoading = false;

          this._checkEmpty();
        }
      });
    } else {
      let userClientId = this.authService.getCurrentAthletId();

      this.sub.userInfo = this.usersService.getUserClient(userClientId).subscribe((user: any) => {
        if (user) {
          this.user = user;
          // this.user.workouts = [];

          this._initWorkouts();

          if (this.isFromUrl) {
            this.userService.initUserInfos(user);
          } else {
            this.userService.initUserClientInfos(user);
          }
          this.isLoading = false;

          this._checkEmpty();
        }
      });
    }
  }

  private _initWorkouts() {
    this.workouts = this.user.workouts && Object.keys(this.user.workouts) || [];

    this.flatWorkouts = [];
    this.workouts.map((date) => {
    	let _date = date.split('-');

    	this.flatWorkouts.push({
    		date: date,
    		label: _date[2] + ' ' + this._getMonthName(_date[1]) + ' ' + _date[0]
    	})

    	return date;
    });
  }

  private _checkEmpty() {
		this.isEmpty = false;
  	if (!this.flatWorkouts.length) {
			this.isEmpty = true;
		}
  }

  private _getMonthName(pos) {
    switch (pos) {
      case 1:
      case '01':
        return this.doorgetsTranslateService.instant('#January');
      case 2:
      case '02':
        return this.doorgetsTranslateService.instant('#February');
      case 3:
      case '03':
        return this.doorgetsTranslateService.instant('#March');
      case 4:
      case '04':
        return this.doorgetsTranslateService.instant('#April');
      case 5:
      case '05':
        return this.doorgetsTranslateService.instant('#May');
      case 6:
      case '06':
        return this.doorgetsTranslateService.instant('#June');
      case 7:
      case '07':
        return this.doorgetsTranslateService.instant('#July');
      case 8:
      case '08':
        return this.doorgetsTranslateService.instant('#August');
      case 9:
      case '09':
        return this.doorgetsTranslateService.instant('#September');
      case 10:
      case '10':
        return this.doorgetsTranslateService.instant('#October');
      case 11:
      case '11':
        return this.doorgetsTranslateService.instant('#November');
      case 12:
      case '12':
        return this.doorgetsTranslateService.instant('#December');
    }
  }

  openExerciceManagerModal() {
    let model: any = {
      movements: [],
      step: 1
    };

    const initialState = {
      model: model,
      workout: this.getWokout(),
      isPlanning: true,
      showDate: true,
      userId: this.user.id,
      isFromUrl: this.isFromUrl,
      // model: _.cloneDeep(model),
    };

    this.bsModalRef = this.modalService.show(TemplatesModalExerciceManagerComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-lg'
    });
  }

  openStartSessionModal(workout, day, onlyReadynessSurvey = false) {
    const initialState = {
      day: day,
      step: 1,
      workout: workout,
      isPlanning: true,
      userId: this.user.id,
      profil: this.user.profil || [],
      isFromUrl: this.isFromUrl,
      onlyReadynessSurvey: onlyReadynessSurvey
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

  getExercice(withoutName?) {
    return {
      name: '',
      movements: []
    }
  }

  checkIsToday (someDate) {
    let date = new Date(someDate);
    const today = new Date()
    return date.getDate() == today.getDate() &&
      date.getMonth() == today.getMonth() &&
      date.getFullYear() == today.getFullYear()
  }

  computeFatigueManagementData(workout) {

    let energyScore = this.computeEnergyScore(workout);

    let rate = parseInt(workout.rate);

    if (energyScore <= 0) {
      return {
        status: 'todo',
        color: 'red'
      };
    }

    if (rate <= 0) {
      let title = 'Autoregulation tips';
      let subtitle = '';
      let color = '';

      if (energyScore > 80) {
        subtitle = 'It seems like you are in a good shape, you can push yourself to a hard session.';
        color = 'green';
      } else if (energyScore < 60) {
        subtitle = 'It seems like you rather tired. Do a light session to recover or rest.';
        color = 'red';
      } else {
        subtitle = 'It seems like you are a bit tired. Adjust your session according to how you feel.';
        color = 'yellow';
      }

      return {
        status: 'in-progress',
        color: color,
        energy: Math.round(energyScore),
        title: title,
        subtitle: subtitle
      };
    }

    let zoneScore = (energyScore / 10) - rate;

    let colorRPE = '';
    let colorEnergy = '';
    let zoneName = '';
    let subtitle = '';

    if (rate > 8) {
      colorRPE = 'red';
    } else if (rate < 6) {
      colorRPE = 'green';
    } else {
      colorRPE = 'yellow';
    }

    if (zoneScore > 1.33) {
      zoneName = 'Recovery';
      subtitle = 'It seems like you had an easy session. While it is good for recovering or peaking, it is not optimal for improving.';
    } else if (zoneScore < -1.33) {
      zoneName = 'Overreaching';
      subtitle = 'It seems like you did a very trying session. You might consider doing a recovery session or having a rest day.';
    } else {
      zoneName = 'Optimal';
      subtitle = 'It seems like you did an optimal session. Take a well deserved rest and you will be ready to train again!';
    }

    if (energyScore > 80) {
      colorEnergy = 'green';
    } else if (energyScore < 60) {
      colorEnergy = 'red';
    } else {
      colorEnergy = 'yellow';
    }

    return {
      status: 'done',
      colorRPE: colorRPE,
      colorEnergy: colorEnergy,
      energyScore: Math.round(energyScore / 10),
      rpeScore: rate,
      zoneName: zoneName,
      subtitle: subtitle
    };

  }

  computeEnergyScore(workout)
  {
    let diet = parseInt(workout.diet);
    let sleep = parseInt(workout.sleep);
    let mood = parseInt(workout.mood);
    let energy = parseInt(workout.energy);
    let stress = parseInt(workout.stress);

    let energyDatas = [diet, sleep, mood, energy, stress];

    let totalEnergy = 0;
    let totalDataConfirmed = 0;
    energyDatas.forEach(function(data){
      if (data > 0) {
        totalDataConfirmed++
        totalEnergy += data;
      }
    });

    return (totalDataConfirmed > 0) ? totalEnergy / (3 * totalDataConfirmed) * 100 : 0;
  }

  getWokout(day?) {
    day = day || {};
    return {
      day: day.day,
      date: day.date,
      month: day.month,
      year: day.year,
      program: {
        name: '',
        exercices: [
        ]
      }
    };
  }

  @HostListener("window:resize", [])
  private onResize() {
    this.detectScreenSize();
  }

  private detectScreenSize() {
    const currentSize = this._document.body.clientWidth;
    this.size = currentSize;
    this.resizeSvc.onResize(currentSize);
  }
  getCardioUnitLabel(key) {
    const labelObj = this.configExercices.unit.find(obj => obj.id == key);
    return labelObj.name;
  }
}
