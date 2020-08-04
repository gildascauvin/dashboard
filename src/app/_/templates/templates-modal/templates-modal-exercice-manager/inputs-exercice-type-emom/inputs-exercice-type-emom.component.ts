import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from '../../../users.service';
import { webConfig } from '../../../../../web-config';

import * as _ from 'lodash';

@Component({
  selector: 'tpc-inputs-exercice-type-emom',
  templateUrl: './inputs-exercice-type-emom.component.html',
  styleUrls: ['./inputs-exercice-type-emom.component.scss']
})
export class InputsExerciceTypeEmomComponent implements OnInit {
	@Input() model: any = {};
  @Input() isPlanning: boolean = false;
  @Input() profil: any[] = [];

  configExercices: any = webConfig.exercices;
  movements: any[] = [];
  sub: any;
  typeChoice: number = 5;

  constructor(
  	private usersService: UsersService,
  	) { }

  ngOnInit(): void {
  	this.model.emom_scoring = this.model.emom_scoring || 1;
  	this.model.emom_duration = this.model.emom_duration || 9;
  	this.model.emom_seconds = this.model.emom_seconds || 60;

    this._initMax();
  }

  private _initMax() {
    _.forEach(this.model.movements, (mvt) => {
      console.log('mvt', mvt);
      let profil = _.find(this.profil, {
        movement_id: mvt.movement_id
      });

      if (profil && !mvt.max_value) {
        mvt.max_unit = profil.record_unit;
        mvt.max_value = profil.record;
      }
    })
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }

  onTypeChoiceChanged(event) {
    let name = event === 3
      ? 'AMRAP'
      : event === 4
        ? 'For time'
        : 'EMOM';

    this.model.type = {
      id: event,
      name: name
    };
  }

  onSelectedItem(item) {
  	let clone = _.cloneDeep(item);

    clone.unit = 1;
    clone.sets = [{
      unit: 3
    }];

    let profil = _.find(this.profil, {
      movement_id: clone.movement_id
    });

    if (profil) {
      clone.max_unit = profil.record_unit;
      clone.max_value = profil.record;
    }

    this.model.movements.push(clone);
  }

  onChangeSearch(val) {
    if (val) {
      this.sub && this.sub.unsubscribe();

      this.sub = this.usersService.getAllMovements(val).subscribe((response: any) => {
        console.log('response', response);
        if (response && response.content) {
          this.movements = response.content;
        }
      });
    }
  }

  removeMovement(index) {
    _.pullAt(this.model.movements, [index]);
  }
}
