import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UsersService } from '../../users.service';
import { ToastrService } from 'ngx-toastr';
import { FormModalCore } from '../../../../_/core/form-modal.core';

@Component({
  selector: 'tpc-users-modal-program-athlete-manager-me',
  templateUrl: './users-modal-program-athlete-manager-me.component.html',
  styleUrls: ['./users-modal-program-athlete-manager-me.component.scss']
})
export class UsersModalProgramAthleteManagerMeComponent extends FormModalCore implements OnInit {

  model: any = {};
  currentActive: any = [];
  program: any = {};
  athletes: any = [];

  athlete: any = {
  	client_id: 0
  };

	modelId: number = 0;

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

    console.log(this);
  }

  ngOnDestroy(): void {
    this.sub.activeClientToProgram && this.sub.activeClientToProgram.unsubscribe();
  }

  onDateSelect(date, userId) {
    console.log(date, userId);
  }

  save() {
    let dayStart = 1;
    let dateStart = null;

    if (this.athlete.dateStart) {
      dayStart = this.athlete.dayStart;
      dateStart = this.athlete.dateStart.year + '-' + this.athlete.dateStart.month + '-' + this.athlete.dateStart.day + ' 00:00:00' ;
    }

    this.sub.activeClientToProgram = this.usersService
      .activeClientToProgramToMe(
        this.modelId,
        this.athlete.client_id,
        true,
        dateStart,
        dayStart)
      .subscribe((data: any) => {
        if (!data.errors) {
          this.usersService.onUserUpdated.emit(true);
          this.toastrService.success('Done');
          this.cancel();
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
