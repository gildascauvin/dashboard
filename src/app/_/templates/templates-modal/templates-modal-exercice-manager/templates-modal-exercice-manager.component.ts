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

  workouts: any[] = [];

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

	constructor(
  	public bsModalRef: BsModalRef,
  	private usersService: UsersService,
    private templatesService: TemplatesService,
  	private toastrService: ToastrService,) {
    super();
  }

  ngOnInit(): void {
    this.modelClone = _.cloneDeep(this.model);

    console.log('workouts', this.workouts);
    let today = new Date();

    this.startedAtModel.year = today.getFullYear();
    this.startedAtModel.month = today.getMonth()+1;
    this.startedAtModel.day = today.getDate();

    this.model.sets = this.model.sets || 1;
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

    this.model.step = 2;
    // this.model.sets = sets;

    console.log(this.model);
    // this.templatesService.onTemplateUpdated.emit(true);


    // if (this.isPlanning) {
    //   // this.usersService.onWorkoutSaved.emit({});
    //   this.model.started_at = `${this.startedAtModel.year}-${this.startedAtModel.month}-${this.startedAtModel.day} 00:00:00`;

    //   this.model.day = `${this.startedAtModel.year}-${this.startedAtModel.month}-${this.startedAtModel.day}`;

    //   this.model.hour = ``;

    //   let body = {
    //     user_id: this.userId,
    //     type_id: this.model.type.id,
    //     day: this.model.day,
    //     hour: this.model.hour,
    //     program_json: JSON.stringify(this.model),
    //     started_at: this.model.started_at,
    //   };

    //   this.usersService.createWorkout(body).subscribe((response) => {
    //     this.toastrService.success('#Workout created!');
    //     this.usersService.onUserUpdated.emit(true);
    //   });
    // }

    this.bsModalRef.hide();
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

  selectType(id, name) {
    this.model.step = 2;

    this.model.type = {
      id: id,
      name: name
    };
  }
}
