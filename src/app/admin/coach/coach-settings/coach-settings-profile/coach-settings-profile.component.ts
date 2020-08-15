import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../../_/services/http/auth.service';
import { UserService } from '../../../../_/services/model/user.service';
import { UsersService } from '../../../../_/templates/users.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-coach-settings-profile',
  templateUrl: './coach-settings-profile.component.html',
  styleUrls: ['./coach-settings-profile.component.scss']
})
export class CoachSettingsProfileComponent implements OnInit {

  model: any = {};
	errors: any = {};

	isLoading: boolean  = false;

	sub: any = {};

  user: any = {
  	data: {},
    profil: []
  };

  constructor(
  	private authService: AuthService,
    private userService: UserService,
    private usersService: UsersService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
  	this.user = this.authService.getUserData();
    this._initUser();

    this.sub.subjectUpdateUsers = this.usersService.onUserUpdated.subscribe(() => {
      this._initUser();
    });
  }

  save() {
		this.isLoading = true;

  	let model = {
  		data: {
	  		firstname: this.user.data.firstname,
				lastname: this.user.data.lastname,
  		}
  	};

  	this.usersService.updateUser(model).subscribe((res) => {
  		this.toastrService.success('Profile updated!');
    	this._initUser();

  		this.isLoading = false;
  	});
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

}
