import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UsersService } from '../../users.service';
import { ToastrService } from 'ngx-toastr';
import { FormModalCore } from '../../../core/form-modal.core';
import {AthleteCalendarService} from "../../../../admin/athlete/athlete-calendar/athlete-calendar.service";
import {webConfig} from "../../../../web-config";

@Component({
  selector: 'tpc-planning-modal-create',
  templateUrl: './planning-modal-create.component.html',
  styleUrls: ['./planning-modal-create.component.scss']
})
export class PlanningModalCreateComponent extends FormModalCore implements OnInit {

	modelPlanning: any = {};
  userId: number = 0;

  templates: any [] = [];
  selectedTemplate: any = {};

  startDate: any;
  endDate: any;

  errors: any = {}

  sub: any;

  configPlanning: any = webConfig.planning;

	constructor(
  	public bsModalRef: BsModalRef,
  	private usersService: UsersService,
  	private toastrService: ToastrService,
    private athleteCalendarService: AthleteCalendarService,
  ) {
    super();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }

  cancel() {
  	this.modelPlanning = {};
  	this.userId = 0;
    this.bsModalRef.hide();
  }

  onStartDatePlanningChange(model) {
    this.startDate =  model.day + "/" + model.month + "/" + model.year;
  }

  onEndDatePlanningChange(model) {
    this.endDate =  model.day + "/" + model.month + "/" + model.year;
  }

  save() {
	  this.startLoading();

	  this.modelPlanning.user_id = this.userId;
    this.modelPlanning.start_date = this.startDate;
    this.modelPlanning.end_date = this.endDate;

    this.usersService.createPlanning(this.userId, this.modelPlanning).subscribe((data: any) => {
      if (!data.errors) {
      	this.cancel();
        this.athleteCalendarService.onCreatedPlanning.emit(true);
        this.toastrService.success('Planning created !');
      } else {
      	this.errors = data.errors;
        this.toastrService.error(data.message || 'An error has occurred');
      }
  	}, (e) => this.toastrService.error('An error has occurred'));
  }
}
