import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { FormModalCore } from '../../../../../_/core/form-modal.core';
import { UsersService } from '../../../../../_/templates/users.service';

@Component({
  selector: 'tpc-users-modal-invitation-delete',
  templateUrl: './users-modal-invitation-delete.component.html',
  styleUrls: ['./users-modal-invitation-delete.component.scss']
})
export class UsersModalInvitationDeleteComponent extends FormModalCore implements OnInit {

  modelId: number = 0;

	modelClient: any = {};

  constructor(
  	public bsModalRef: BsModalRef,
  	private usersService: UsersService,
  	private toastrService: ToastrService,) {
    super();
  }

  ngOnInit(): void {
  }

  cancel() {
    this.bsModalRef.hide();

  	this.modelId = 0;
		this.modelClient = {};
  }

	deleteClient() {
    this.startLoading();

    this.usersService.removeClient(this.modelClient.user_client_id).subscribe((data: any) => {
      if (!data.errors) {
        this.cancel();
        this.usersService.onUserUpdated.emit(true);
        this.toastrService.success('Athlete removed !');
      } else {
        this.toastrService.error('An error has occurred');
      }
  	}, (e) => {
      this.toastrService.error('An error has occurred');
  	});
  }
}
