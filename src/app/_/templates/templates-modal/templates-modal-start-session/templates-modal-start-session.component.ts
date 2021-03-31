import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/_/services/http/auth.service";
import { UserService } from "src/app/_/services/model/user.service";
import { TemplatesService } from "../../templates.service";
import { UsersService } from "../../users.service";

@Component({
  selector: "app-templates-modal-start-session",
  templateUrl: "./templates-modal-start-session.component.html",
  styleUrls: ["./templates-modal-start-session.component.scss"],
})
export class TemplatesModalStartSessionComponent implements OnInit {
  model: any;
  step: number;
  workout: any = {};
  day: any;
  index = 0;
  isFromUrl: boolean;
  onlyReadynessSurvey: boolean = false;

  scores: any;
  isPlanning: boolean;
  userId: number;
  user: any;
  rates: any;
  options: any;
  currentStep = 0;

  sub: any = {};

  constructor(
    private templatesService: TemplatesService,
    public bsModalRef: BsModalRef,
    private authService: AuthService,
    private usersService: UsersService,
    private userService: UserService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.scores = [
      { name: "Bad", value: 1 },
      { name: "Average", value: 2 },
      { name: "Good", value: 3 },
    ];

    this.rates = [
      { name: "No activity", value: 1 },
      { name: "Very light", value: 2 },
      { name: "Light", value: 3 },
      { name: "Moderate", value: 4 },
      { name: "Vigorous", value: 5 },
      { name: "Challenging", value: 6 },
      { name: "Somewhat hard", value: 7 },
      { name: "Hard", value: 8 },
      { name: "Very hard", value: 9 },
      { name: "Extremely hard", value: 10 },
    ];

    this.options = Array.from(
      { length: this.workout.program.exercices.length + 2 },
      (_, i) => i + 1
    );
  }

  cancel() {
    this.templatesService.onTemplateReset.emit(true);
    this.bsModalRef.hide();
  }
  showNextStep() {
    this.currentStep++;
    const length = this.workout.program.exercices.length;
    if (this.step === 1) {
      this.index = -1;
      this.step++;
    }

    if (this.index !== length - 1) {
      this.index++;
      this.model = this.workout.program.exercices[this.index];
    } else {
      this.step++;
    }
  }
  showPreviousStep() {
    this.currentStep--;

    const length = this.workout.program.exercices.length;

    if (this.step === 3) {
      this.step--;
      this.index = length - 1;
    } else {
      this.index--;
    }
    if (this.index >= 0) {
      this.model = this.workout.program.exercices[this.index];
    } else {
      this.step--;
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
  }

  save(isEndSession?: boolean) {

    let exercices = this.workout.program.exercices.map((exercice) => {

      let movements = exercice.movements.map((movement) => {
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
    });

    let body: any = {
      user_id: this.userId,
      program_json: JSON.stringify(this.workout.program),
      diet: this.workout.diet,
      sleep: this.workout.sleep,
      mood: this.workout.mood,
      stress: this.workout.stress,
      rate: this.workout.rate,
      energy: this.workout.energy,
      comment: this.workout.comment,
      duration: this.workout.duration
    };

    if (this.onlyReadynessSurvey === true) {
      isEndSession = true;
    }

    body.workout_id = this.workout.workout_id;
    body.started_at = this.workout.started_at;
    this.usersService[this.isFromUrl ? "updateWorkout" : "updateClientWorkout"](
      body
    ).subscribe((response: any) => {
      if (response.errors) {
        this.toastrService.error(response.message);
      } else {
        this.usersService.onWorkoutSaved.emit(this.workout);
        if (isEndSession) {
          this.bsModalRef.hide();
        } else {
          this.showNextStep();
        }
      }
    });
  }
}
