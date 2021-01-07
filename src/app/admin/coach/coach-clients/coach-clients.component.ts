import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { AuthService } from '../../../_/services/http/auth.service';
import { UserService } from '../../../_/services/model/user.service';
import { UsersService } from '../../../_/templates/users.service';

import * as _ from 'lodash';

import { UsersModalInvitationCreateComponent } from './coach-clients-modal/users-modal-invitation-create/users-modal-invitation-create.component';
import { UsersModalInvitationDeleteComponent } from './coach-clients-modal/users-modal-invitation-delete/users-modal-invitation-delete.component';

@Component({
  selector: 'app-coach-clients',
  templateUrl: './coach-clients.component.html',
  styleUrls: ['./coach-clients.component.scss']
})
export class CoachClientsComponent implements OnInit {
  bsModalRef: BsModalRef;

	model: any = {};
	errors: any = {};

	isLoading: boolean  = false;

	sub: any = {};

  user: any = {
  	data: {},
    profil: []
  };

  constructor(private authService: AuthService,
    private userService: UserService,
    private usersService: UsersService,
    private toastrService: ToastrService,
    private modalService: BsModalService) { }

  ngOnInit(): void {
  	this.user = this.authService.getUserData();
    this._initUser();

    this.sub.subjectUpdateUsers = this.usersService.onUserUpdated.subscribe(() => {
      this._initUser();
    });
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

  openInvitationCreateModal() {
    const initialState = {
      modelId: this.user.id
    };

    this.bsModalRef = this.modalService.show(UsersModalInvitationCreateComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-xs'
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
