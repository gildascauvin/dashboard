import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { FormModalCore } from '../../../../../_/core/form-modal.core';
import { UsersService } from '../../../../../_/templates/users.service';

@Component({
  selector: 'tpc-users-modal-invitation-create',
  templateUrl: './users-modal-invitation-create.component.html',
  styleUrls: ['./users-modal-invitation-create.component.scss']
})
export class UsersModalInvitationCreateComponent extends FormModalCore implements OnInit {

  modelClient: any = {};

	modelId: number = 0;

  errors: any = {}
  errorsMessage: string = '';

  constructor(
  	public bsModalRef: BsModalRef,
  	private usersService: UsersService,
  	private toastrService: ToastrService,) {
    super();
  }

  ngOnInit(): void {
  	this.modelClient = {
	    name: '',
	    email: ''
	  }
  }

  cancel() {
  	this.modelId = 0;
		this.modelClient = {
      data: {}
    };

    this.bsModalRef.hide();
  }

	saveClient() {
    this.startLoading();

    this.usersService.createClient(this.modelClient).subscribe((data: any) => {
      if (!data.errors) {
        this.cancel();
        this.usersService.onUserUpdated.emit(true);
        this.toastrService.success('Invitation created !');
      } else {
      	this.errors = data.errors;
        this.toastrService.error(data.message || 'An error has occurred');
      }
  	}, (e) => this.toastrService.error('An error has occurred'));
  }

}
