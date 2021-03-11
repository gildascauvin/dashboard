import { Component, Input, OnInit } from "@angular/core";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import * as _ from "lodash";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { webConfig } from "../../../../web-config";
import { FormModalCore } from "../../../../_/core/form-modal.core";
import { TemplatesService } from "../../templates.service";
import { UsersService } from "../../users.service";

@Component({
  selector: "tpc-templates-modal-exercice-manager",
  templateUrl: "./templates-modal-exercice-manager.component.html",
  styleUrls: ["./templates-modal-exercice-manager.component.scss"],
})
export class TemplatesModalExerciceManagerComponent
  extends FormModalCore
  implements OnInit {
  model: any = {
    movements: [],
    name: "",
    step: 1,
  };
  @Input() test: any;

  startedAtModel: NgbDateStruct = {
    day: 1,
    month: 1,
    year: 2002,
  };

  modelClone: any = {};

  isPlanning: boolean = false;

  modelId: number = 0;

  movements: any[] = [];

  errors: any = {};
  errorsMessage: string = "";

  configExercices: any = webConfig.exercices;

  sub: any;

  varyingStyle: string = "";

  step: number = 1;

  seeMore: boolean = false;

  userId: number = 0;
  workout: any = {};

  day: any = [];

  showDate: boolean = false;

  profil: any[] = [];

  isFromUrl: boolean = true;

  @Input() workoutInput: any;
  @Input() modelInput: any;

  constructor(
    public bsModalRef: BsModalRef,
    private usersService: UsersService,
    private templatesService: TemplatesService,
    private toastrService: ToastrService
  ) {
    super();
  }
  ngOnChanges() {
    /**********THIS FUNCTION WILL TRIGGER WHEN PARENT COMPONENT UPDATES 'someInput'**************/
    //Write your code here

    if (this.modelInput) {
      this.model = this.modelInput;
    }
    if (this.workoutInput) {
      this.workout = this.workoutInput;
    }
    console.log("this.model change", this.model);
  }

  ngOnInit(): void {
    if (this.modelInput) {
      this.model = this.modelInput;
    }
    if (this.workoutInput) {
      this.workout = this.workoutInput;
    }

    this.modelClone = _.cloneDeep(this.model);

    let today: any;
    if (this.showDate || !this.workout.date) {
      today = new Date();
    } else {
      today = new Date(this.workout.date);
    }

    this.startedAtModel.year = today.getFullYear();
    this.startedAtModel.month = today.getMonth() + 1;
    this.startedAtModel.day = today.getDate();

    this.model.sets = this.model.sets || 5;
    this.model.updated = true;

    console.log(this);
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
        movement.value = 0;
      }
      console.log('movement',)
      this.setUnitLabel(movement, "unit", "unit_label");

      let sets = movement.sets.map((set) => {
        this.setUnitLabel(set, "unit", "unit_label");

        return {
          unit: parseInt("" + set.unit) || 3,
          set: set.set || 1,
          rep: set.rep || 1,
          value: set.value || 0,
          quantity: set.quantity || 1,
          unit_label: set.unit_label,
          rep_unit: set.rep_unit || 1
        };
      });

      movement.sets = sets;

      return movement;
    });

    // Cardio
    if (this.model.type.id === 7) {
      if (this.model.cardio_scoring === 1) {
        this.setCardioUnitLabel(
          this.model.cardio_cardio_movement,
          "unit",
          "unit_label"
        );
      } else if (this.model.cardio_scoring === 2) {
        let sets = this.model.cardio_intervals_movement.sets.map((set) => {
          this.setCardioUnitLabel(set, "unit", "unit_label");

          return {
            unit: parseInt("" + set.unit) || 1,
            set: set.set || 1,
            interval: set.interval || 1,
            value: set.value || 0,
            quantity: set.quantity || 1,
            unit_label: set.unit_label,
          };
        });

        this.model.cardio_intervals_movement.sets = sets;
      }
    }

    this.model.step = 2;

    // this.model.sets = sets;
    this.templatesService.onTemplateUpdated.emit(true);

    //this.model.name = this.workout.name;

    if (this.isPlanning) {
      if (this.showDate) {
        this.workout.day = `${this.startedAtModel.year}-${this.startedAtModel.month}-${this.startedAtModel.day}`;
        this.workout.date = `${this.workout.day}`;

        this.workout.program = {
          exercices: [this.model],
        };
      }

      this.workout.program.name = this.workout.name;

      let body: any = {
        user_id: this.userId,
        day: this.workout.day,
        date: this.workout.date,
        hour: this.workout.hour,
        month: this.workout.month,
        name: this.workout.name,
        program_json: JSON.stringify(this.workout.program),
        started_at: `${this.workout.date} 00:00:00`, //this.workout.started_at,
      };

      if (!this.workout.workout_id) {
        this.usersService[
          this.isFromUrl ? "createWorkout" : "createClientWorkout"
        ](body).subscribe((response: any) => {
          if (response.errors) {
            this.toastrService.error(response.message);
          } else {
            this.toastrService.success("#Workout created!");
            this.workout.workout_id = response.workout.workout_id;
            this.workout.program_id = response.workout.program_id;

            this.usersService.onWorkoutSaved.emit(this.workout);
            this.bsModalRef.hide();
          }
        });
      } else {
        body.workout_id = this.workout.workout_id;
        body.started_at = this.workout.started_at;

        this.usersService[
          this.isFromUrl ? "updateWorkout" : "updateClientWorkout"
        ](body).subscribe((response: any) => {
          if (response.errors) {
            this.toastrService.error(response.message);
          } else {
            this.toastrService.success("#Workout updated!");
            this.usersService.onWorkoutSaved.emit(this.workout);
            this.bsModalRef.hide();
          }
        });
      }
    } else {
      this.usersService.onWorkoutSaved.emit({});
      this.bsModalRef.hide();
    }
  }

  onSelectedItem(item) {
    item.sets = [
      {
        unit: 1,
      },
    ];

    this.model.movements.push(item);
  }

  onChangeSearch(val) {
    if (val) {
      this.sub && this.sub.unsubscribe();

      this.sub = this.usersService
        .getAllMovements(val)
        .subscribe((response: any) => {
          if (response && response.content) {
            this.movements = response.content;
          }
        });
    }
  }

  setUnitLabel(model, key, labelKey) {
    model[labelKey] = "%";
    switch (model[key]) {
      case 1:
      case "1":
        model[labelKey] = "kg";
        break;
      case 2:
      case "2":
        model[labelKey] = "lbs";
        break;
      case 3:
      case "3":
        model[labelKey] = "%";
        break;
      case 4:
      case "4":
        model[labelKey] = "RPE";
        break;
      case 5:
      case "5":
        model[labelKey] = "km/h";
        break;

      default:
        model[labelKey] = "%";
        break;
    }

    console.log(model[key]);
    console.log(model[labelKey]);
  }

  setCardioUnitLabel(model, key, labelKey) {
    model[labelKey] = "Meters";
    switch (model[key]) {
      case 2:
      case "2":
        model[labelKey] = "Miles";
        break;
      case 3:
      case "3":
        model[labelKey] = "Yards";
        break;
      case 4:
      case "4":
        model[labelKey] = "Minutes";
        break;
      case 5:
      case "5":
        model[labelKey] = "Seconds";
        break;

      default:
        model[labelKey] = "Meters";
        break;
    }
  }

  selectType(id, name) {
    this.model.step = 2;

    this.model.type = {
      id: id,
      name: name,
    };
  }
}
