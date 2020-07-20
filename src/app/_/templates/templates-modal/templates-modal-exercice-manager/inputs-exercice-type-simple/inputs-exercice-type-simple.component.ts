import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from '../../../users.service';
import { webConfig } from '../../../../../web-config';

import * as _ from 'lodash';

@Component({
  selector: 'tpc-inputs-exercice-type-simple',
  templateUrl: './inputs-exercice-type-simple.component.html',
  styleUrls: ['./inputs-exercice-type-simple.component.scss']
})
export class InputsExerciceTypeSimpleComponent implements OnInit {
	@Input() model: any = {};
  @Input() isPlanning: boolean = false;

  configExercices: any = webConfig.exercices;
  movements: any[] = [];
  sub: any;

  constructor(
  	private usersService: UsersService,
  	) { }

  ngOnInit(): void {
  	this.model.amrap_timecap = this.model.amrap_timecap || 10;
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }

  onSelectedItem(item) {
    item.unit = 1;
    item.sets = [{
      unit: 3
    }];

    this.model.movements.push(item);
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

  addSet(sets) {
    sets.push({
      unit: 3
    });
  }

  removeSet(sets, index) {
    _.pullAt(sets, [index]);
  }
}
