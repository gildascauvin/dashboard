import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { webConfig } from '../../../web-config';

import { AuthService } from '../../../_/services/http/auth.service';
import { UserService } from '../../../_/services/model/user.service';
import { UsersService } from '../../../_/templates/users.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-athlete-profile',
  templateUrl: './athlete-profile.component.html',
  styleUrls: ['./athlete-profile.component.scss']
})
export class AthleteProfileComponent implements OnInit {
  bsModalRef: BsModalRef;

  sub: any = {};

  user: any = {
  	data: {}
  };

  isLoading = false;

  configMrv = webConfig.mrv;

  birthdayModel: NgbDateStruct = {
    day: 1,
    month: 1,
    year: 2002
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private usersService: UsersService,
    private toastrService: ToastrService
  	) { }

  ngOnInit(): void {
  	this.user = this.authService.getUserData();
    this._initUser();
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

  private _initUser() {
		this.isLoading = true;
  	this.sub.userInfo && this.sub.userInfo.unsubscribe();

  	this.sub.userInfo = this.usersService.getUser().subscribe((user: any) => {
    	this._initData(user);
    });
  }

  private _initData(user) {
  	if (user && user.data) {
	  	this.user = _.cloneDeep(user);

	  	if (user.data.birthday) {
	      let date = user.data.birthday.split('-');
	      this.birthdayModel.day = parseInt(date[2]);
	      this.birthdayModel.month = parseInt(date[1]);
	      this.birthdayModel.year = parseInt(date[0]);

	      console.log('date', date, this.birthdayModel);

	    }

	  	this.userService.initUserInfos(user);
			this.isLoading = false;
		}
  }
}
