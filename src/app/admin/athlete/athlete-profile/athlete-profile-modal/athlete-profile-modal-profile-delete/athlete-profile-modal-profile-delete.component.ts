import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { webConfig } from '../../../../../web-config';
import { UsersService } from '../../../../../_/templates/users.service';

@Component({
  selector: 'app-athlete-profile-modal-profile-delete',
  templateUrl: './athlete-profile-modal-profile-delete.component.html',
  styleUrls: ['./athlete-profile-modal-profile-delete.component.scss']
})
export class AthleteProfileModalProfileDeleteComponent implements OnInit {

  model: any = {
    record_unit: 1,
    movement: {}
  };

	modelId: number = 0;

  errors: any = {}
  errorsMessage: string = '';

	constructor(
  	public bsModalRef: BsModalRef,
  	private usersService: UsersService,
  	private toastrService: ToastrService,) {
  }

  ngOnInit(): void {
  }

  cancel() {
  	this.model = {
	    record_unit: 1,
    	movement: {}
  	};
    this.bsModalRef.hide();
  }

  deleteProfile() {
    this.usersService.removeUserProfile(this.model).subscribe((data: any) => {
      if (!data.errors) {
        this.cancel();
        this.usersService.onUserUpdated.emit(true);
        this.toastrService.success('Review removed!');
      } else {
        this.toastrService.error('An error has occurred');
      }
  	}, (e) => {
      this.toastrService.error('An error has occurred');
  	});
  }
}
