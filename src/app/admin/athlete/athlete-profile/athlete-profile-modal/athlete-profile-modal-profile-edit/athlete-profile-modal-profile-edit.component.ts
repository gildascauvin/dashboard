import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { webConfig } from '../../../../../web-config';
import { UsersService } from '../../../../../_/templates/users.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-athlete-profile-modal-profile-edit',
  templateUrl: './athlete-profile-modal-profile-edit.component.html',
  styleUrls: ['./athlete-profile-modal-profile-edit.component.scss']
})
export class AthleteProfileModalProfileEditComponent implements OnInit {
  isFromUrl: boolean = true;

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

  userId: number = 0;
  maxRefId: number = 0;
  isRefMax: boolean = false;

  constructor(
  	public bsModalRef: BsModalRef,
  	private usersService: UsersService,
  	private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.model.is_max_ref = this.maxRefId === this.model.movement_id;
    this.isRefMax = _.cloneDeep(this.model.is_max_ref);
    console.log(this.model);
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
    this.usersService[this.isFromUrl ? 'updateUserProfile' : 'updateClientUserProfile'](this.model).subscribe((data: any) => {
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
