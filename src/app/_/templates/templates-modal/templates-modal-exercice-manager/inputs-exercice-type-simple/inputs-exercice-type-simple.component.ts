import { Component, Input, OnInit } from "@angular/core";
import * as _ from "lodash";
import { webConfig } from "../../../../../web-config";
import { UsersService } from "../../../users.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: "tpc-inputs-exercice-type-simple",
  templateUrl: "./inputs-exercice-type-simple.component.html",
  styleUrls: ["./inputs-exercice-type-simple.component.scss"],
})
export class InputsExerciceTypeSimpleComponent implements OnInit {
  @Input() model: any = {};
  @Input() isPlanning: boolean = false;
  @Input() profil: any[] = [];
  @Input() isStartSession: boolean = false;

  configExercices: any = webConfig.exercices;
  movements: any[] = [];
  sub: any;
  newMovement: any = [];

  constructor(
    private usersService: UsersService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.model.amrap_timecap = this.model.amrap_timecap || 10;
    this._initMax();
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }

  onCreatedNewMovement(item) {
    this.onCloseNewMovement();
    this.onSelectedItem(item);
  }

  onCloseNewMovement() {
    this.newMovement = [{name: '', categoryId: '', unit: '', imageUrl: ''}];
    this.movements = [];
  }

  onSelectedItem(item) {
    this.newMovement = [{name: '', categoryId: '', unit: '', imageUrl: ''}];

    if (item.type && item.type == 'new') {
      this.newMovement.name = item.name;
      this.newMovement.unit = 0;

    } else {
      let clone = _.cloneDeep(item);

      clone.unit = 1;
      clone.sets = [
        {
          unit: 3,
          rep_unit: 1,
        },
      ];

      let profil = _.find(this.profil, {
        movement_id: clone.movement_id,
      });

      if (profil) {
        clone.max_unit = profil.record_unit;
        clone.max_value = profil.record;
      }
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

  private _initMax() {
    _.forEach(this.model.movements, (mvt) => {
      console.log("mvt", mvt);
      let profil = _.find(this.profil, {
        movement_id: mvt.movement_id,
      });

      if (profil && !mvt.max_value) {
        mvt.max_unit = profil.record_unit;
        mvt.max_value = profil.record;
      }
    });
  }

  removeMovement(index) {
    _.pullAt(this.model.movements, [index]);
  }

  addSet(sets) {
    sets.push({
      unit: 3,
    });
  }

  removeSet(sets, index) {
    _.pullAt(sets, [index]);
  }
}
