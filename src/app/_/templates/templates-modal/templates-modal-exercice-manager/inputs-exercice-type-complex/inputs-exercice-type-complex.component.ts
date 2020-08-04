import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from '../../../users.service';
import { webConfig } from '../../../../../web-config';

import * as _ from 'lodash';

@Component({
  selector: 'tpc-inputs-exercice-type-complex',
  templateUrl: './inputs-exercice-type-complex.component.html',
  styleUrls: ['./inputs-exercice-type-complex.component.scss']
})
export class InputsExerciceTypeComplexComponent implements OnInit {
	@Input() model: any = {};
  @Input() isPlanning: boolean = false;
  @Input() profil: any[] = [];

  configExercices: any = webConfig.exercices;
  movements: any[] = [];
  sub: any;

  constructor(
  	private usersService: UsersService,
  	) { }

  ngOnInit(): void {
  	this.model.amrap_timecap = this.model.amrap_timecap || 10;
    this._initMax();
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
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
        if (response && response.content) {
          this.movements = response.content;
        }
      });
    }
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

  removeMovement(index) {
    _.pullAt(this.model.movements, [index]);
  }

  addSet(sets) {
    sets.push({
      unit: 3
    });
  }

  removeSet(sets, index) {
    _.pullAt(sets, [index]);
  }
}
