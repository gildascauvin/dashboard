import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UsersService } from '../../users.service';
import { ToastrService } from 'ngx-toastr';

import { webConfig } from '../../../../web-config';
import { FormModalCore } from '../../../../_/core/form-modal.core';

@Component({
  selector: 'tpc-users-modal-program-edit',
  templateUrl: './users-modal-program-edit.component.html',
  styleUrls: ['./users-modal-program-edit.component.scss']
})
export class UsersModalProgramEditComponent extends FormModalCore implements OnInit {

	modelProgram: any = {};

	programs: any [];

	modelId: number = 0;

  errors: any = {}
  errorsMessage: string = '';

  configExercices: any = webConfig.exercices;

	constructor(
  	public bsModalRef: BsModalRef,
  	private usersService: UsersService,
  	private toastrService: ToastrService,) {
    super();
  }

  ngOnInit(): void {
    console.log(this);
  }

  cancel() {
  	this.modelProgram = {};
    this.bsModalRef.hide();
  }

  save() {
    this.startLoading();

    this.usersService.updateProgram(this.modelProgram).subscribe((data: any) => {
      if (!data.errors) {
      	this.cancel();
        this.usersService.onUserUpdated.emit(true);
        this.toastrService.success('Program updated!');
      } else {
      	this.errors = data.errors;
        this.toastrService.error(data.message || 'An error has occurred');
      }
  	}, (e) => this.toastrService.error('An error has occurred'));
  }

}
