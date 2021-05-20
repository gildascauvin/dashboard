import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { FormModalCore } from '../../../core/form-modal.core';
import { UsersService } from '../../users.service';
import {AthleteCalendarService} from "../../../../admin/athlete/athlete-calendar/athlete-calendar.service";

@Component({
  selector: 'tpc-planning-modal-delete',
  templateUrl: './planning-modal-delete.component.html',
  styleUrls: ['./planning-modal-delete.component.scss']
})
export class PlanningModalDeleteComponent extends FormModalCore implements OnInit {
  model: any = {};
  planningId: number = 0;
  userId: number = 0;
  errors: any = {};

  constructor(
    public bsModalRef: BsModalRef,
    private usersService: UsersService,
    private athleteCalendarService: AthleteCalendarService,
    private toastrService: ToastrService,) { super(); }

  ngOnInit(): void {}

  cancel() {
    this.planningId = 0;
    this.userId = 0;
    this.bsModalRef.hide();
  }

  delete() {
    this.usersService.removePlanning(this.userId, this.planningId).subscribe((data: any) => {
      if (!data.errors) {
        this.cancel();
        this.athleteCalendarService.onRemovedPlanning.emit(true);
        this.toastrService.success('Planning removed!');
      } else {
        this.errors = data.errors;
        this.toastrService.error(data.message || 'An error has occurred');
      }
    }, (e) => this.toastrService.error('An error has occurred'));
  }
}
