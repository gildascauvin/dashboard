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
  profileRef:any;

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
    this.sub.subjectUpdateUsers = this.usersService.onUserUpdated.subscribe(() => {
      this._initUser();
    });

    this.sub.isCoach = this.route
      .data
      .subscribe((params) => {
        this.isCoach = params && params.isCoach || false;

        this.user = !this.isCoach
          ? this.authService.getUserData()
          : this.authService.getUserClientData();

        this._initUser();

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

  openCreateModal() {
    const initialState = {
      userId: this.user.id,
      isFromUrl: !this.isCoach,
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
      isFromUrl: !this.isCoach,
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
      maxRefId: this.user.data.max_ref_id,
      isFromUrl: !this.isCoach,
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


    if (!this.isCoach) {
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

      const userProfilsWithoutRatio = this.user.profil.filter( (profile)=> 
      (user.data.max_ref_id !== profile.movement_id) && (!profile.ratio_value))

      const userProfilsWithRatio = this.user.profil.filter( (profile)=> 
      profile.ratio_value && profile.ratio_value !== profile.record).sort( (a, b) => {
        return this.getRatioMovement(b)- this.getRatioMovement(a)
      });

      const userProfilRefMax = this.user.profil.filter( (profile)=> 
      user.data.max_ref_id === profile.movement_id);

      this.user.profil = [...userProfilRefMax, ...userProfilsWithRatio, ...userProfilsWithoutRatio]
      this.profileRef = this.user?.profil?.find( (profile) => profile?.movement_id === this.user?.data?.max_ref_id );


      let index = this.user?.profil?.indexOf(this.profileRef);
  
      this.user.profil[index].color = '#000000';

      this.user.profil =  this.user.profil.map(item => {
          const obj = Object.assign({}, item);
          if( this.profileRef !== item) {
            obj.color = this.getRandomColor();
          }
          return obj;
      });
      

	  	if (user.data.birthday) {
	      let date = user.data.birthday.split('-');
	      this.birthdayModel.day = parseInt(date[2]);
	      this.birthdayModel.month = parseInt(date[1]);
	      this.birthdayModel.year = parseInt(date[0]);
	    }

      this.userService[(!this.isCoach ? 'initUserInfos' : 'initUserClientInfos' )](user);
			this.isLoading = false;
		}
  }
  private getRatioMovement(value) {
    return parseInt('' + value.record / value.ratio_value * 100)
  }
  getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
  }
}
