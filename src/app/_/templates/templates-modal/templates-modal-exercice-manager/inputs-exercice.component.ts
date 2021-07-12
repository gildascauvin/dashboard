import * as _ from "lodash";
import {Input, OnInit} from "@angular/core";
import {UsersService} from "../../users.service";
import {webConfig} from "../../../../web-config";

export class InputsExerciceComponent implements OnInit {
  @Input() isPlanning: boolean = false;
  @Input() isStartSession: boolean = false;
  @Input() profil: any[] = [];
  @Input() model: any = {};

  configExercices: any = webConfig.exercices;

  sub: any;
  movements: any[] = [];
  newMovement: any = [];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.model.amrap_timecap = this.model.amrap_timecap || 10;
    this._initMax();
    this._initMAS();
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }

  onCreatedNewMovement(item) {
    this.onCloseNewMovement();
    this.onSelectedItem(item);
  }

  addSet(movement) {
    let defaultRepUnit = (movement.has_repetitions && !movement.has_rep_unit) ? 6 : 1;

    movement.sets.push({
      unit: 3,
      rep_unit: defaultRepUnit
    });
  }

  onSelectedItem(item) {
    this.newMovement = [{name: '', categoryId: '', unit: '', imageUrl: ''}];

    if (item.type && item.type == 'new') {
      this.newMovement.name = item.name;
      this.newMovement.unit = 0;

    } else {

      let clone = _.cloneDeep(item);
      let defaultRepUnit = (item.has_repetitions && !item.has_rep_unit) ? 6 : 1;

      clone.unit = 1;
      clone.sets = [
        {
          unit: 3,
          rep_unit: defaultRepUnit
        },
      ];

      let profil = _.find(this.profil, {
        movement_id: clone.movement_id,
      });

      if (profil) {
        clone.max_unit = profil.record_unit;
        clone.max_value = profil.record;
      }

      console.log(clone);

      this.model.movements.push(clone);
    }
  }

  onChangeSearch(val) {
    if (val) {
      this.sub && this.sub.unsubscribe();

      this.sub = this.usersService
        .getAllMovements(val)
        .subscribe((response: any) => {
          if (response && response.content) {
            if (response.count > 0) {
              this.movements = response.content;
            } else {
              this.movements = [{
                name: val,
                type: 'new'
              }];
            }
          }
        });
    }
  }

  removeSet(sets, index) {
    _.pullAt(sets, [index]);
  }

  onCloseNewMovement() {
    this.newMovement = [{name: '', categoryId: '', unit: '', imageUrl: ''}];
    this.movements = [];
  }

  removeMovement(index) {
    _.pullAt(this.model.movements, [index]);
  }

  protected _initMax() {
    _.forEach(this.model.movements, (mvt) => {
      let profil = _.find(this.profil, {
        movement_id: mvt.movement_id,
      });

      if (profil && !mvt.max_value) {
        mvt.max_unit = profil.record_unit;
        mvt.max_value = profil.record;
      }
    });
  }

  protected _initMAS() {
    _.forEach(this.model.movements, (mvt) => {
      let profil = _.find(this.profil, {
        movement_id: mvt.movement_id,
      });

      if (profil && !mvt.mas_value) {
        mvt.mas_value = profil.record;
      }
    });
  }
}
