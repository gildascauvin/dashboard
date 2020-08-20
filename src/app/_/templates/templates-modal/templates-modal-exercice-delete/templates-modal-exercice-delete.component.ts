import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';

import { TemplatesService } from '../../templates.service';
import { FormModalCore } from '../../../../_/core/form-modal.core';
import { UsersService } from '../../users.service';

@Component({
  selector: 'tpc-templates-modal-exercice-delete',
  templateUrl: './templates-modal-exercice-delete.component.html',
  styleUrls: ['./templates-modal-exercice-delete.component.scss']
})
export class TemplatesModalExerciceDeleteComponent extends FormModalCore implements OnInit {
  model: any = {};
  position: number = -1;
  exercices: any[] = [];

  workout: any = {};

  isPlanning: boolean = false;
  isFromUrl: boolean = true;

  errors: any = {};

	constructor(
  	public bsModalRef: BsModalRef,
		private templatesService: TemplatesService,
    private usersService: UsersService,
  	private toastrService: ToastrService,) { super(); }

  ngOnInit(): void {
  }

  cancel() {
		this.model = {};
    this.bsModalRef.hide();
  }

  delete() {
    this.startLoading();

    _.pullAt(this.exercices, [this.position]);

    this.cancel();
    this.templatesService.onTemplateUpdated.emit(true);

    console.log('Workout', this.workout);

    if (!this.workout.workout_id) {
      this.usersService.onWorkoutSaved.emit(true);
      this.cancel();
      return;
    }

    if (this.isPlanning) {
      let body: any = {
        date: this.workout.date,
        hour: this.workout.hour,
        month: this.workout.month,
        workout_id: this.workout.workout_id,
        program_json: JSON.stringify(this.workout.program),
      };

      this.usersService.updateWorkout(body).subscribe((response: any) => {
        if (response.errors) {
          this.toastrService.error(response.message);
        } else {
          this.toastrService.success('#Workout updated!');
          this.usersService.onWorkoutSaved.emit(true);
          this.cancel();
        }
      });
    } else {
      this.cancel();
      this.templatesService.onTemplateUpdated.emit(true);
    }
  }
}
