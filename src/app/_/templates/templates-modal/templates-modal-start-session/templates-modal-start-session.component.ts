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
  save(isEndSession?: boolean) {
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
