import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../../_/services/http/auth.service';
import { UserService } from '../../../../_/services/model/user.service';
import { UsersService } from '../../../../_/templates/users.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-athlete-settings-password',
  templateUrl: './athlete-settings-password.component.html',
  styleUrls: ['./athlete-settings-password.component.scss']
})
export class AthleteSettingsPasswordComponent implements OnInit {
	model: any = {};
	errors: any = {};

	isLoading: boolean  = false;

   constructor(
    private authService: AuthService,
    private userService: UserService,
    private usersService: UsersService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
  }

  save() {
    if (!this.model.currentPassword) {
      this.toastrService.error('Current password is empty');
      return;
    }

    if (!this.model.newPassword) {
      this.toastrService.error('New password is empty');
      return;
    }

    if (this.model.newPassword !== this.model.confirmNewPassword) {
      this.toastrService.error('Bad confirm password');
      return;
    }

    this.isLoading = true;

    let model = {
      password: this.model.newPassword,
      currentPassword: this.model.currentPassword,
    };

    this.usersService.resetUserPassword(model).subscribe((res: any) => {
      if (res.error) {
        this.toastrService.error(res.error);
      } else {
        this.toastrService.success('Password updated!');
        this.authService.logout();
      }

      this.isLoading = false;
    });
  }
}

