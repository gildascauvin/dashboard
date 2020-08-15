import { Component, OnInit, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

import { webConfig } from '../../../web-config';

import { AuthService } from '../../../_/services/http/auth.service';
import { UserService } from '../../../_/services/model/user.service';
import { UsersService } from '../../../_/templates/users.service';

import { AthleteProfileModalProfileCreateComponent } from './athlete-profile-modal/athlete-profile-modal-profile-create/athlete-profile-modal-profile-create.component';
import { AthleteProfileModalProfileEditComponent } from './athlete-profile-modal/athlete-profile-modal-profile-edit/athlete-profile-modal-profile-edit.component';
import { AthleteProfileModalProfileDeleteComponent } from './athlete-profile-modal/athlete-profile-modal-profile-delete/athlete-profile-modal-profile-delete.component';

import * as _ from 'lodash';

@Component({
  selector: 'app-athlete-profile',
  templateUrl: './athlete-profile.component.html',
  styleUrls: ['./athlete-profile.component.scss']
})
export class AthleteProfileComponent implements OnInit {
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

  // Radar
  public radarChartOptions: RadialChartOptions = {
    responsive: true,
    scale: {
      ticks: { min: 0 },
    },
    plugins: {
      datalabels: {
        labels: {
          title: null
        },
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public radarChartLabels: Label[] = ['Back Squat', 'Rope Jumping', 'Front-To-Back Squat With Belt', 'Backward Drag', 'Defensive Slide'];

  public radarChartData: ChartDataSets[] = [
    {
      data: [150, 120, 89, 120, 90],
      label: 'Volume',
      backgroundColor: null,
      borderColor: "#000000",
    },
    // { data: [12, 32, 43, 57, 90], label: 'Intensity' },
  ];

  public radarChartType: ChartType = 'radar';

  constructor(
    private authService: AuthService,
    private modalService: BsModalService,
    private userService: UserService,
    private usersService: UsersService,
    private toastrService: ToastrService
  	) { }

  ngOnInit(): void {
  	this.user = this.isFromUrl
      ? this.authService.getUserData()
      : this.authService.getUserClientData();

    this._initUser();

    this.sub.subjectUpdateUsers = this.usersService.onUserUpdated.subscribe(() => {
      this._initUser();
    });
  }

  ngOnDestroy(): void {
    this.sub.subjectUpdateUsers && this.sub.subjectUpdateUsers.unsubscribe();
  }

  save() {
		this.isLoading = true;

    this.user.data.birthday = `${this.birthdayModel.year}-${this.birthdayModel.month}-${this.birthdayModel.day}`;

    // console.log('this.user', this.user);
  	this.usersService.updateUser(this.user).subscribe((user: any) => {
      this.toastrService.success('MRV updated!');
    	this._initUser();

  		this.isLoading = false;
  	}, error => this.toastrService.error('An error has occurred'));
  }

  openCreateModal() {
    const initialState = {
    };

    this.bsModalRef = this.modalService.show(AthleteProfileModalProfileCreateComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-xs'
    });
  }

  openDeleteModal(profile) {
    const initialState = {
      model: profile,
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

      this._initChart();
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

  private _initChart() {
    this.radarChartData[0].data = [];
    this.radarChartLabels = [];

    let radarChartLabels = [];
    let radarChartData = [];
    _.forEach(this.user.profil, (profil) => {
      if (radarChartData.length < 6) {
        radarChartData.push(profil.record);
        radarChartLabels.push(profil.movement.name);
      }
    });

    this.radarChartData[0].data = radarChartData;
    this.radarChartLabels = radarChartLabels;
  }
}
