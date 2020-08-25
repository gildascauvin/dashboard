import { Component, OnInit, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';

import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

import { webConfig } from '../../../../web-config';

import { AuthService } from '../../../../_/services/http/auth.service';
import { UserService } from '../../../../_/services/model/user.service';
import { UsersService } from '../../../../_/templates/users.service';

import { AthleteProfileModalProfileCreateComponent } from '../athlete-profile-modal/athlete-profile-modal-profile-create/athlete-profile-modal-profile-create.component';
import { AthleteProfileModalProfileEditComponent } from '../athlete-profile-modal/athlete-profile-modal-profile-edit/athlete-profile-modal-profile-edit.component';
import { AthleteProfileModalProfileDeleteComponent } from '../athlete-profile-modal/athlete-profile-modal-profile-delete/athlete-profile-modal-profile-delete.component';

import * as _ from 'lodash';

@Component({
  selector: 'app-athlete-profile-performance',
  templateUrl: './athlete-profile-performance.component.html',
  styleUrls: ['./athlete-profile-performance.component.scss']
})
export class AthleteProfilePerformanceComponent implements OnInit {
  @Input() isFromUrl = true;

  bsModalRef: BsModalRef;

  currentTab: number = 0;

  sub: any = {};

  user: any = {
  	data: {},
    profil: []
  };

  isLoading = false;

  configMrv = webConfig.mrv;

  birthdayModel: NgbDateStruct = {
    day: 1,
    month: 1,
    year: 2002
  };

  isCoach: boolean = false;

  links: any = {
    profile: ['/athlete', 'profile'],
    performance: ['/athlete', 'profile', 'performance']
  }

  constructor(
    private authService: AuthService,
    private modalService: BsModalService,
    private userService: UserService,
    private usersService: UsersService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
  	) { }

  ngOnInit(): void {
  	this.user = this.isFromUrl
      ? this.authService.getUserData()
      : this.authService.getUserClientData();

    this._initUser();

    this.sub.subjectUpdateUsers = this.usersService.onUserUpdated.subscribe(() => {
      this._initUser();
    });

    this.sub.isCoach = this.route
      .data
      .subscribe((params) => {
        this.isCoach = params && params.isCoach || false;

        if (this.isCoach) {
          this.links = {
            profile: ['/coach', 'athlet', 'profile'],
            performance: ['/coach', 'athlet', 'profile', 'performance']
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.sub.subjectUpdateUsers && this.sub.subjectUpdateUsers.unsubscribe();
    this.sub.isCoach && this.sub.isCoach.unsubscribe();
  }

  save() {
		this.isLoading = true;

    this.user.data.birthday = `${this.birthdayModel.year}-${this.birthdayModel.month}-${this.birthdayModel.day}`;

    // console.log('this.user', this.user);
  	this.usersService[(this.isFromUrl ? 'updateUser' : 'updateClientUser' )](this.user).subscribe((user: any) => {
      if (!user.errors) {
        this.toastrService.success('MRV updated!');
        this._initUser();
      } else {
        this.toastrService.error('An error has occurred');
      }

  		this.isLoading = false;
  	}, error => this.toastrService.error('An error has occurred'));
  }

  openCreateModal() {
    const initialState = {
      userId: this.user.id,
      isFromUrl: this.isFromUrl,
    };

    this.bsModalRef = this.modalService.show(AthleteProfileModalProfileCreateComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-xs',
    });
  }

  openDeleteModal(profile) {
    const initialState = {
      model: profile,
      isFromUrl: this.isFromUrl,
    };

    this.bsModalRef = this.modalService.show(AthleteProfileModalProfileDeleteComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-xs'
    });
  }

  openEditModal(profile) {
    const initialState = {
      model: profile,
      isFromUrl: this.isFromUrl,
    };

    this.bsModalRef = this.modalService.show(AthleteProfileModalProfileEditComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-xs'
    });
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  private _initUser() {
		this.isLoading = true;
  	this.sub.userInfo && this.sub.userInfo.unsubscribe();

    if (this.isFromUrl) {
    	this.sub.userInfo = this.usersService.getUser().subscribe((user: any) => {
      	this._initData(user);
        this.isLoading = false;
      });
    } else {
      let userClientId = this.authService.getCurrentAthletId();

      this.sub.userInfo = this.usersService.getUserClient(userClientId).subscribe((user: any) => {
        this._initData(user);
        this.isLoading = false;
      });
    }
  }

  private _initData(user) {
  	if (user && user.data) {
	  	this.user = _.cloneDeep(user);

	  	if (user.data.birthday) {
	      let date = user.data.birthday.split('-');
	      this.birthdayModel.day = parseInt(date[2]);
	      this.birthdayModel.month = parseInt(date[1]);
	      this.birthdayModel.year = parseInt(date[0]);
	    }

      if (this.isFromUrl) {
	  	  this.userService.initUserInfos(user);
      } else {
        this.userService.initUserClientInfos(user);
      }
			this.isLoading = false;
		}
  }
}
