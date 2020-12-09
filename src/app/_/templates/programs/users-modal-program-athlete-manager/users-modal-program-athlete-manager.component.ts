import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UsersService } from '../../users.service';
import { ToastrService } from 'ngx-toastr';
import { FormModalCore } from '../../../../_/core/form-modal.core';

@Component({
  selector: 'tpc-users-modal-program-athlete-manager',
  templateUrl: './users-modal-program-athlete-manager.component.html',
  styleUrls: ['./users-modal-program-athlete-manager.component.scss']
})
export class UsersModalProgramAthleteManagerComponent extends FormModalCore implements OnInit {

  model: any = {};
  currentActive: any = [];
  program: any = {};
  athletes: any = [];

	modelId: number = 0;
	programId: number = 0;

  errors: any = {}
  errorsMessage: string = '';

  Arr = Array;

  sub: any = {};

  constructor(
  	public bsModalRef: BsModalRef,
  	private usersService: UsersService,
  	private toastrService: ToastrService,) {
    super();
  }

  ngOnInit(): void {
    if (this.program.linked) {
      this.currentActive = this.program.linked.map((user) => {
        this.model[user.linked_user_id] = user.is_active || false;
        return user.linked_user_id;
      });
    }
  }

  ngOnDestroy(): void {
    this.sub.activeClientToProgram && this.sub.activeClientToProgram.unsubscribe();
  }

  onDateSelect(date, userId) {
    console.log(date, userId);
  }

  onChangeActive(newValue, athlete) {
    console.log('athlete', athlete);

    let dayStart = 1;
    let dateStart = null;

    if (athlete.dateStart) {
      dayStart = athlete.dayStart;
      dateStart = athlete.dateStart.year + '-' + athlete.dateStart.month + '-' + athlete.dateStart.day + ' 00:00:00' ;
    }

    this.sub.activeClientToProgram = this.usersService
      .activeClientToProgram(
        this.modelId,
        this.programId,
        athlete.client_id,
        newValue,
        dateStart,
        dayStart)
      .subscribe((data: any) => {
        console.log('data', data, newValue);
        if (!data.errors) {
          this.usersService.onUserUpdated.emit(true);
          this.toastrService.success(newValue ? 'Athlete added!' : 'Athlete removed!');
        } else {
          this.errors = data.errors;
          this.toastrService.error(data.message || 'An error has occurred');
        }
      }, (e) => this.toastrService.error('An error has occurred'));
  }

  cancel() {
  	this.modelId = 0;
		this.model = {};

    this.bsModalRef.hide();
  }
}
