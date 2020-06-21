import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

import { TemplatesService } from '../../templates.service';
import { UsersService } from '../../users.service';

import { ToastrService } from 'ngx-toastr';

import { webConfig } from '../../../../web-config';
import { FormModalCore } from '../../../../_/core/form-modal.core';
import * as _ from 'lodash';

@Component({
  selector: 'tpc-templates-modal-exercice-manager',
  templateUrl: './templates-modal-exercice-manager.component.html',
  styleUrls: ['./templates-modal-exercice-manager.component.scss']
})
export class TemplatesModalExerciceManagerComponent  extends FormModalCore implements OnInit {
  model: any = {
    movements: [],
    name: '',
    step: 1
  };

  startedAtModel: NgbDateStruct = {
    day: 1,
    month: 1,
    year: 2002
  };

  modelClone: any = {};

  isPlanning: boolean = false;

  modelId: number = 0;

  movements: any[] = [];

  errors: any = {}
  errorsMessage: string = '';

  configExercices: any = webConfig.exercices;

  sub: any;

  varyingStyle: string = '';

  step: number = 1;

  seeMore: boolean = false;

  userId: number = 0;
  workout: any = {};

  day: any = [];

  showDate: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    private usersService: UsersService,
    private templatesService: TemplatesService,
    private toastrService: ToastrService,) {
    super();
  }

  ngOnInit(): void {
    this.modelClone = _.cloneDeep(this.model);

    let _date = this.showDate && this.workout.date ? this.workout.date : 'now';
    let today = new Date(_date);

    this.startedAtModel.year = today.getFullYear();
    this.startedAtModel.month = today.getMonth()+1;
    this.startedAtModel.day = today.getDate();

    this.model.sets = this.model.sets || 5;
    this.model.updated = true;

    console.log('this', this);
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }

  cancel() {
    this.templatesService.onTemplateReset.emit(true);
    this.bsModalRef.hide();
  }

  save() {
    this.startLoading();

    let movements = this.model.movements.map((movement) => {
      if (!movement.value) {
        movement.value = 90;
      }

      this.setUnitLabel(movement, 'unit', 'unit_label');

      let sets = movement.sets.map((set) => {
        this.setUnitLabel(set, 'unit', 'unit_label');

        return {
          unit: parseInt('' + set.unit) || 1,
          set: set.set || 1,
          rep: set.rep || 1,
          value: set.value || 90,
          unit_label: set.unit_label,
        };
      });

      movement.sets = sets;

      return movement;
    });

    // Cardio
    if (this.model.type.id === 7) {
      if (this.model.cardio_scoring === 1) {
        this.setCardioUnitLabel(this.model.cardio_cardio_movement, 'unit', 'unit_label');
      } else if(this.model.cardio_scoring === 2) {
        console.log('Grouped');
        let sets = this.model.cardio_intervals_movement.sets.map((set) => {
          this.setCardioUnitLabel(set, 'unit', 'unit_label');

          return {
            unit: parseInt('' + set.unit) || 1,
            set: set.set || 1,
            interval: set.interval || 1,
            value: set.value || 90,
            unit_label: set.unit_label,
          };
        });

        this.model.cardio_intervals_movement.sets = sets;
      }
    }

    this.model.step = 2;
    // this.model.sets = sets;
    this.templatesService.onTemplateUpdated.emit(true);

    if (this.isPlanning) {

      this.workout.program.name = this.workout.name;

      let body: any = {
        user_id: this.userId,
        day: this.workout.day,
        date: this.workout.date,
        hour: this.workout.hour,
        month: this.workout.month,
        name: this.workout.name,
        program_json: JSON.stringify(this.workout.program),
        started_at: `${this.workout.date} 00:00:00`//this.workout.started_at,
      };

      if (!this.workout.workout_id) {
        this.usersService.createWorkout(body).subscribe((response: any) => {
          if (response.errors) {
            this.toastrService.error(response.message);
          } else {
            this.toastrService.success('#Workout created!');
            this.workout.workout_id = response.workout.workout_id;
            this.workout.program_id = response.workout.program_id;

            this.usersService.onWorkoutSaved.emit(this.workout);
            this.bsModalRef.hide();
          }
        });
      } else {
        body.workout_id = this.workout.workout_id;
        body.started_at = this.workout.started_at;

        this.usersService.updateWorkout(body).subscribe((response: any) => {
          if (response.errors) {
            this.toastrService.error(response.message);
          } else {
            this.toastrService.success('#Workout updated!');
            this.usersService.onWorkoutSaved.emit(this.workout);
            this.bsModalRef.hide();
          }
        });
      }
    }
  }

  onSelectedItem(item) {
    item.sets = [{
      unit: 1
    }];

    this.model.movements.push(item);
  }

  onChangeSearch(val) {
    if (val) {
      this.sub && this.sub.unsubscribe();

      this.sub = this.usersService.getAllMovements(val).subscribe((response: any) => {
        if (response && response.content) {
          this.movements = response.content;

        }
      });
    }
  }

  setUnitLabel(model, key, labelKey) {
    model[labelKey] = 'lbs';
    switch (model[key]) {
      case 2:
      case "2":
        model[labelKey] = 'kg';
        break;
      case 3:
      case "3":
        model[labelKey] = '%';
        break;

      default:
        model[labelKey] = 'lbs';
        break;
    }
  }

  setCardioUnitLabel(model, key, labelKey) {
    model[labelKey] = 'Meters';
    switch (model[key]) {
      case 2:
      case "2":
        model[labelKey] = 'Miles';
        break;
      case 3:
      case "3":
        model[labelKey] = 'Yards';
        break;

      default:
        model[labelKey] = 'Meters';
        break;
    }
  }

  selectType(id, name) {
    this.model.step = 2;

    this.model.type = {
      id: id,
      name: name
    };
  }
}
