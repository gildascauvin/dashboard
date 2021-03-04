import { Component, Input, OnInit } from "@angular/core";
import * as _ from "lodash";
import { webConfig } from "../../../../../web-config";
import { UsersService } from "../../../users.service";

@Component({
  selector: "tpc-inputs-exercice-type-amrap",
  templateUrl: "./inputs-exercice-type-amrap.component.html",
  styleUrls: ["./inputs-exercice-type-amrap.component.scss"],
})
export class InputsExerciceTypeAmrapComponent implements OnInit {
  @Input() model: any = {};
  @Input() isPlanning: boolean = false;
  @Input() isStartSession: boolean = false;
  @Input() profil: any[] = [];

  configExercices: any = webConfig.exercices;
  movements: any[] = [];
  sub: any;
  typeChoice: number = 3;
  newMovement: any = [];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.model.amrap_timecap = this.model.amrap_timecap || 10;
    this._initMax();
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
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

  onTypeChoiceChanged(event) {
    let name = event === 3 ? "AMRAP" : event === 4 ? "For time" : "EMOM";

    this.model.type = {
      id: event,
      name: name,
    };
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
          rep_unit: 1
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

  removeMovement(index) {
    _.pullAt(this.model.movements, [index]);
  }
}
