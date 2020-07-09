import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UsersService } from '../../users.service';
import { ToastrService } from 'ngx-toastr';

import { webConfig } from '../../../../web-config';
import { FormModalCore } from '../../../../_/core/form-modal.core';

@Component({
  selector: 'tpc-users-modal-program-delete',
  templateUrl: './users-modal-program-delete.component.html',
  styleUrls: ['./users-modal-program-delete.component.scss']
})
export class UsersModalProgramDeleteComponent extends FormModalCore implements OnInit {

  modelProgram: any = {};

	programs: any [];

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
  }

  cancel() {
  	this.modelProgram = {};
    this.bsModalRef.hide();
  }

  deleteProgram() {
    this.startLoading();

    this.usersService.removeProgram(this.modelId, this.modelProgram).subscribe((data: any) => {
      if (!data.errors) {
        this.cancel();
        this.usersService.onUserUpdated.emit(true);
        this.toastrService.success('Program removed !');
      } else {
        this.toastrService.error('An error has occurred');
      }
    }, (e) => {
      this.toastrService.error('An error has occurred');
    });
  }
}
