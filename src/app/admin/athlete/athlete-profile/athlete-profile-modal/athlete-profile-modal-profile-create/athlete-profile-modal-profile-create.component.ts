import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { webConfig } from '../../../../../web-config';
import { UsersService } from '../../../../../_/templates/users.service';

@Component({
  selector: 'app-athlete-profile-modal-profile-create',
  templateUrl: './athlete-profile-modal-profile-create.component.html',
  styleUrls: ['./athlete-profile-modal-profile-create.component.scss']
})
export class AthleteProfileModalProfileCreateComponent implements OnInit {
  isFromUrl: boolean = true;

  modelId: number = 0;
	model: any = {
    record_unit: 1
  };

  errors: any = {}
  errorsMessage: string = '';

  sub: any;
  movements: any[] = [];
  configExercices: any = webConfig.exercices;

  userId: number = 0;

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

  onSelectedItem(item) {
    this.model.movement_id = item.movement_id;
  }

  onChangeSearch(val) {
    if (val) {
      this.errors.movement_id = false;
      this.sub && this.sub.unsubscribe();

      this.sub = this.usersService.getAllMovements(val).subscribe((response: any) => {
        if (response && response.content) {
          this.movements = response.content;
        }
      });
    }
  }

  cancel() {
		this.model = {
      record_unit: 1
    };

    this.bsModalRef.hide();
  }

  save() {
    this.model.user_id = this.userId;
    this.usersService[this.isFromUrl ? 'createUserProfile' : 'createClientUserProfile'](this.model).subscribe((data: any) => {
      if (!data.errors) {
        this.cancel();
        this.usersService.onUserUpdated.emit(true);
        this.toastrService.success('Review added!');
      } else {
      	this.errors = data.errors;
        this.toastrService.error(data.message || 'An error has occurred');
      }
  	}, (e) => this.toastrService.error('An error has occurred'));
  }

}
