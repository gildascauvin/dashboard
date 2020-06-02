import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from '../../../users.service';
import { webConfig } from '../../../../../web-config';

import * as _ from 'lodash';

@Component({
  selector: 'tpc-inputs-exercice-type-time',
  templateUrl: './inputs-exercice-type-time.component.html',
  styleUrls: ['./inputs-exercice-type-time.component.scss']
})
export class InputsExerciceTypeTimeComponent implements OnInit {
	@Input() model: any = {};
  configExercices: any = webConfig.exercices;
  movements: any[] = [];
  varyingStyle: any[] = [12, 8, 5];
  sub: any;

  constructor(
  	private usersService: UsersService,
  	) { }

  ngOnInit(): void {
  	this.model.time_style = this.model.time_style  || 1;
    this.model.time_style_fixed = this.model.time_style_fixed  || 3;
    this.model.time_style_varying = this.model.time_style_varying  || '12 8 5';
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }

  onSelectedItem(item) {
  	item.unit = 1;
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

  updateVaryingStyle(value) {
    this.varyingStyle = value && value.replace(',', ' ')
      .replace('-', ' ')
      .replace(';', ' ')
      .replace('_', ' ')
      .split(' ').filter((el) => {
        let res = parseInt('' + el) || null;
         if (res) {
           return res;
         }
      }) || [];
  }
}
