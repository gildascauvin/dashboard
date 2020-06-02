import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TemplatesService } from '../../templates.service';
import { ToastrService } from 'ngx-toastr';
import { FormModalCore } from '../../../../_/core/form-modal.core';
import * as _ from 'lodash';

@Component({
  selector: 'tpc-templates-modal-workout-delete',
  templateUrl: './templates-modal-workout-delete.component.html',
  styleUrls: ['./templates-modal-workout-delete.component.scss']
})
export class TemplatesModalWorkoutDeleteComponent extends FormModalCore implements OnInit {
  count: number = 0;
  weeks: any = [];
  copiedWorkouts: any = {};
  isMultiple: boolean = false;

	model: any = {};
	position: number = -1;
  workouts: any[] = [];

	errors: any = {};

	constructor(
  	public bsModalRef: BsModalRef,
		private templatesService: TemplatesService,
  	private toastrService: ToastrService,) { super(); }

  ngOnInit(): void {
    console.log(this.weeks);
  }

  cancel() {
		this.model = {};
    this.bsModalRef.hide();
  }

  delete() {
    this.startLoading();

    if (!this.isMultiple) {
      _.pullAt(this.workouts, [this.position]);
    } else {
      let keys = Object.keys(this.copiedWorkouts);
      for(let i=0; i < keys.length; i++) {
        let values = keys[i].split('-');
        let day = parseInt('' +values[0]);
        let week = parseInt('' +values[1]);
        let position = parseInt('' +values[2]);

        _.pullAt(this.weeks[week][day].workouts, [position]);

        this.templatesService.onWorkoutsGroupReset.emit(true);
      }
    }

    this.cancel();
    this.templatesService.onTemplateUpdated.emit(true);
  }
}
