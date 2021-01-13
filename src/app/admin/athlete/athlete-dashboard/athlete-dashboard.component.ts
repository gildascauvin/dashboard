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

  getExercice(withoutName?) {
    return {
      name: '',
      movements: []
    }
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
