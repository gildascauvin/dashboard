import { Component, OnInit, Input } from '@angular/core';
import { webConfig } from '../../../../../web-config';

import * as _ from 'lodash';

@Component({
  selector: 'tpc-inputs-exercice-type-cardio',
  templateUrl: './inputs-exercice-type-cardio.component.html',
  styleUrls: ['./inputs-exercice-type-cardio.component.scss']
})
export class InputsExerciceTypeCardioComponent implements OnInit {
	@Input() model: any = {};

  configExercices: any = webConfig.exercices;

  constructor() { }

  ngOnInit(): void {
  	this.model.cardio_type = this.model.cardio_type || 1;
  	this.model.cardio_scoring = this.model.cardio_scoring || 1;
  	this.model.cardio_plan_unit = this.model.cardio_plan_unit || 1;
    this.model.cardio_cardio_movement = this.model.cardio_cardio_movement || {
      unit: 1
    };
    this.model.cardio_intervals_movement = this.model.cardio_intervals_movement || {
      sets: [{
        unit: 1
      }]
    };
  }

  addSet(sets) {
    sets.push({
      unit: 1
    });
  }

  removeSet(sets, index) {
    _.pullAt(sets, [index]);
  }

}
