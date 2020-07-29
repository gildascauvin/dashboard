import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { webConfig } from '../../../../../web-config';
import { UsersService } from '../../../../../_/templates/users.service';

@Component({
  selector: 'app-athlete-profile-modal-profile-edit',
  templateUrl: './athlete-profile-modal-profile-edit.component.html',
  styleUrls: ['./athlete-profile-modal-profile-edit.component.scss']
})
export class AthleteProfileModalProfileEditComponent implements OnInit {

  modelId: number = 0;
	model: any = {
    record_unit: 1,
    movement: {}
  };

  errors: any = {}
  errorsMessage: string = '';

  sub: any;
  movements: any[] = [];
  configExercices: any = webConfig.exercices;

  constructor(
  	public bsModalRef: BsModalRef,
  	private usersService: UsersService,
  	private toastrService: ToastrService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }

  cancel() {
		this.model = {
	    record_unit: 1,
	    movement: {}
    };

    this.bsModalRef.hide();
  }

  save() {
    this.usersService.updateUserProfile(this.model).subscribe((data: any) => {
      if (!data.errors) {
        this.cancel();
        this.usersService.onUserUpdated.emit(true);
        this.toastrService.success('Review updated!');
      } else {
      	this.errors = data.errors;
        this.toastrService.error(data.message || 'An error has occurred');
      }
  	}, (e) => this.toastrService.error('An error has occurred'));
  }

}
