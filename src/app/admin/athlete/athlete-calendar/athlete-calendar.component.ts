import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { DOCUMENT } from "@angular/common";
import {
  Component,
  HostListener,
  Inject,
  Input,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
} from "@ng-bootstrap/ng-bootstrap";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { addHours, endOfWeek, format, startOfWeek } from "date-fns";
import { DoorgetsTranslateService } from "doorgets-ng-translate";
import * as _ from "lodash";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { TemplatesModalStartSessionComponent } from "src/app/_/templates/templates-modal/templates-modal-start-session/templates-modal-start-session.component";
import { webConfig } from "../../../web-config";
import { DeepDiffMapperService } from "../../../_/services/deep-diff-mapper.service";
import { AuthService } from "../../../_/services/http/auth.service";
import { UserService } from "../../../_/services/model/user.service";
import { TemplatesModalEditComponent } from "../../../_/templates/templates-modal/templates-modal-edit/templates-modal-edit.component";
import { TemplatesModalExerciceDeleteComponent } from "../../../_/templates/templates-modal/templates-modal-exercice-delete/templates-modal-exercice-delete.component";
import { TemplatesModalExerciceManagerComponent } from "../../../_/templates/templates-modal/templates-modal-exercice-manager/templates-modal-exercice-manager.component";
import { TemplatesModalWorkoutDeleteComponent } from "../../../_/templates/templates-modal/templates-modal-workout-delete/templates-modal-workout-delete.component";
import { TemplatesService } from "../../../_/templates/templates.service";
import { UsersService } from "../../../_/templates/users.service";

@Component({
  selector: "app-athlete-calendar",
  templateUrl: "./athlete-calendar.component.html",
  styleUrls: ["./athlete-calendar.component.scss"],
})
export class AthleteCalendarComponent implements OnInit {
  @Input() isFromUrl = true;

  bsModalRef: BsModalRef;

  id: number = 0;

  user: any = {};

  sub: any = {};
  model: any = {};

  notFound: boolean = false;

  isSelectedBox: boolean = false;

  hideLocalBox: boolean = false;

  hover: any = {};
  timer: any = {};

  startedAtModel: NgbDateStruct = {
    day: 1,
    month: 1,
    year: 2002,
  };

  isHover: boolean = false;
  isLeave: boolean = false;

  copyWorkouts: any[] = [];

  selectedWorkouts: any = {};
  selectedWorkoutsData: any = {};
  selectedWorkoutsCount: number = 0;

  waitingForCopy: boolean = false;
  showFooterAction: boolean = false;
  showPasteCopiedWorkouts: boolean = false;

  workouts: any = {};

  endDay: any = endOfWeek(new Date(), { weekStartsOn: 1 });
  startDay: any = startOfWeek(new Date(), { weekStartsOn: 1 });

  weeks: any[] = [];

  configExercices: any = webConfig.exercices;

  ngOfWeeks: number = 7;

  isLoadingScroll: boolean = false;

  currentMonth: string = "";
  cloneWeeks: any = [];

  isLoading: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private toastrService: ToastrService,
    private authService: AuthService,
    private userService: UserService,
    private usersService: UsersService,
    private deepDiffMapperService: DeepDiffMapperService,
    private modalService: BsModalService,
    private templatesService: TemplatesService,
    private doorgetsTranslateService: DoorgetsTranslateService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
  ) {}

  @HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    this.closeAllBoxes();
  }

  ngOnInit(): void {

    let todayCalendar = new Date();

    this.startedAtModel.year = todayCalendar.getFullYear();
    this.startedAtModel.month = todayCalendar.getMonth() + 1;
    this.startedAtModel.day = todayCalendar.getDate();

    this.user = this.isFromUrl
      ? this.authService.getUserData()
      : this.authService.getUserClientData();

    this._syncWorkouts();

    this.sub.onWorkoutSaved = this.usersService.onWorkoutSaved.subscribe(
      (o) => {
        console.log(o);
        this._syncWorkouts(null, true);
      }
    );

    this.sub.workoutsGroupReset = this.templatesService.onWorkoutsGroupReset.subscribe(
      () => {
        this.closeFooterActions();
      }
    );

    this.sub.onUpdate = this.userService.onUpdate.subscribe((user) => {
      this.user = this.isFromUrl
        ? this.authService.getUserData()
        : this.authService.getUserClientData();
      this._syncWorkouts(null, true);
    });

    this._init();
    this._initDate();



    let bodyScroll = this.document.getElementById("fixed-calendar-planning");

    bodyScroll.onscroll = () => {
      let weeksScroll = this.document.querySelectorAll(".week-scroll");

      weeksScroll.forEach((weekNode: any) => {
        // let weekNodeEl = this.document.querySelector(weekNode);
        let nWeek = weekNode.getBoundingClientRect();
        // console.log(nWeek.top, nWeek, bodyTop, nWeek.top - bodyTop);
        if (nWeek.top < 100) {
          this.currentMonth = weekNode.attributes["data-date"].textContent;
        }
      });

      // if (window.pageYOffset > sticky) {
      //   navbar.classList.add("sticky")
      // } else {
      //   navbar.classList.remove("sticky");
      // }

      /*if (
        window.pageYOffset >= stickyFooter &&
        !this.isLoadingScroll &&
        this.weeks.length < 30
      ) {
        this.isLoadingScroll = true;
        this._init();
      }*/
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case "workouts": {
            // this._init();
          }

          case "weeks": {
            // console.log('weeks');
            // this._init();
          }
        }
      }
    }
  }

  ngOnDestroy() {
    this.sub.templates && this.sub.templates.unsubscribe();
    this.sub.onWorkoutSaved && this.sub.onWorkoutSaved.unsubscribe();
    this.sub.onGetAllWorkout && this.sub.onGetAllWorkout.unsubscribe();
    this.sub.onUpdate && this.sub.onUpdate.unsubscribe();
    this.sub.workoutsGroupReset && this.sub.workoutsGroupReset.unsubscribe();
  }

  private _init(reset?) {
    if (reset) {
      let today = startOfWeek(new Date(), { weekStartsOn: 1 });
      this.currentMonth =
        this._getMonthName(format(today, "MM")) + " " + format(today, "yyyy");

      this.endDay = endOfWeek(new Date(), { weekStartsOn: 1 });
      this.startDay = startOfWeek(new Date(), { weekStartsOn: 1 });

      this.weeks = [];
    }

    this._addWeeks();
  }

  private _refreshWeeksWithWorkouts() {
    _.forEach(this.weeks, (week, idWeek) => {
      const weekWorkout = this.weeks[idWeek];
      _.forEach(week, (days, idDay) => {
          if (this.workouts[days.date]) {
            days.workouts = this.workouts[days.date];
          }
      });
    });
  }

  private _addWeeks() {
    for (let y = 0; y < 5; ++y) {
      let days = [];
      let date = new Date(this.startDay);
      for (let i = 0; i < this.ngOfWeeks; ++i) {
        let formatedDate = format(date, "yyyy-MM-dd");
        let formatedDay = format(date, "dd");
        let formatedMonth = format(date, "MM");
        let formatedYear = format(date, "yyyy");
        let currentDay = {
          name: this._getWeekName(i),
          date: formatedDate,
          day: formatedDay,
          month: formatedMonth,
          monthText: this._getMonthName(formatedMonth),
          year: formatedYear,
          workouts: [],
        };

        if (this.workouts && this.workouts[formatedDate]) {
          currentDay.workouts = this.workouts[formatedDate];
        }

        days.push(currentDay);

        let nbHours =
          formatedDate === "2020-10-25" || formatedDate === "2021-10-30"
            ? 25
            : 24;
        date = addHours(date, nbHours);
        this.startDay = date;
      }

      this.weeks.push(days);
    }

    this.cloneWeeks = _.cloneDeep(this.weeks);

    this.isLoadingScroll = false;
  }

  private _initDate(startedAtModel?) {
    this.startedAtModel = startedAtModel ? startedAtModel : this.startedAtModel;
    let today = startOfWeek(
      new Date(
        this.startedAtModel.year,
        this.startedAtModel.month - 1,
        this.startedAtModel.day
      ),
      { weekStartsOn: 1 }
    );

    this.currentMonth =
      this._getMonthName(format(today, "MM")) + " " + format(today, "yyyy");

    this.endDay = endOfWeek(
      new Date(
        this.startedAtModel.year,
        this.startedAtModel.month - 1,
        this.startedAtModel.day
      ),
      { weekStartsOn: 1 }
    );
    this.startDay = startOfWeek(
      new Date(
        this.startedAtModel.year,
        this.startedAtModel.month - 1,
        this.startedAtModel.day
      ),
      { weekStartsOn: 1 }
    );

    this.weeks = [];
  }

  private _getWeekName(pos) {
    switch (pos) {
      case 0:
        return this.doorgetsTranslateService.instant("#Monday");
      case 1:
        return this.doorgetsTranslateService.instant("#Tuesday");
      case 2:
        return this.doorgetsTranslateService.instant("#Wednesday");
      case 3:
        return this.doorgetsTranslateService.instant("#Thurday");
      case 4:
        return this.doorgetsTranslateService.instant("#Friday");
      case 5:
        return this.doorgetsTranslateService.instant("#Saturday");
      case 6:
        return this.doorgetsTranslateService.instant("#Sunday");
    }
  }

  private _getMonthName(pos) {
    switch (pos) {
      case 1:
      case "01":
        return this.doorgetsTranslateService.instant("#January");
      case 2:
      case "02":
        return this.doorgetsTranslateService.instant("#February");
      case 3:
      case "03":
        return this.doorgetsTranslateService.instant("#March");
      case 4:
      case "04":
        return this.doorgetsTranslateService.instant("#April");
      case 5:
      case "05":
        return this.doorgetsTranslateService.instant("#May");
      case 6:
      case "06":
        return this.doorgetsTranslateService.instant("#June");
      case 7:
      case "07":
        return this.doorgetsTranslateService.instant("#July");
      case 8:
      case "08":
        return this.doorgetsTranslateService.instant("#August");
      case 9:
      case "09":
        return this.doorgetsTranslateService.instant("#September");
      case 10:
      case "10":
        return this.doorgetsTranslateService.instant("#October");
      case 11:
      case "11":
        return this.doorgetsTranslateService.instant("#November");
      case 12:
      case "12":
        return this.doorgetsTranslateService.instant("#December");
    }
  }

  autoSave() {
    this.save();
  }

  save() {
    const diff = this.deepDiffMapperService.difference(
      this.weeks,
      this.cloneWeeks
    );

    const workoutToSave = [];

    _.forEach(diff, (week, idWeek) => {
      const weekWorkout = this.weeks[idWeek];
      _.forEach(week, (days, idDay) => {
        const dayWorkout = weekWorkout[idDay];
        if (days) {
          _.forEach(days.workouts, (workout, indexWorkout) => {
            const workoutFromCLone = dayWorkout.workouts[indexWorkout];
            if (workoutFromCLone) {
              console.log(workoutFromCLone);
              console.log(diff);
              workoutToSave.push(workoutFromCLone);
            }
          });
        }
      });
    });

    _.forEach(workoutToSave, (workout) => {
      const body = {
        name: workout.name,
        user_id: workout.user_id,
        type_id: workout.type_id,
        day: workout.day,
        hour: workout.hour,
        program_json: JSON.stringify(workout.program),
        started_at: workout.started_at,
        workout_id: workout.workout_id,
      };
      if (workout.workout_id) {
        console.log("success");
        this.usersService
          .updateClientWorkout(body)
          .subscribe((savedWorkout) => {
            
            this.cloneWeeks = _.cloneDeep(this.weeks);
          });
      } else {
        console.log("Created");
        this.usersService.createWorkout(body).subscribe((savedWorkout) => {
          console.log("savedWorkout", savedWorkout);
          this.cloneWeeks = _.cloneDeep(this.weeks);
        });
      }
    });
  }

  onDateSelected($event) {
    this._initDate($event);
    this._syncWorkouts($event, true);
  }

  duplicateWorkout(workout) {
    this.copyWorkouts = [];
    this.copyWorkouts.push(workout);
  }

  clearDuplicate() {
    this.copyWorkouts = [];
  }

  addWorkoutToWeek(day, i, y) {
    day.workouts.push(this.getWokout(day));

    this.markAsOver(i + "-" + y + "-" + (day.workouts.length - 1), "w-" + i);
    this.addExerciceToWorkout(
      day,
      day.workouts[day.workouts.length - 1].program.exercices,
      day.workouts[day.workouts.length - 1]
    );
  }

  pasteWorkout(workouts, i, y) {
    if (!this.copyWorkouts.length) {
      return;
    }

    workouts.push(_.cloneDeep(this.copyWorkouts[0]));
  }

  addExerciceToWorkout(day, exercices, workout) {
    exercices.push(this.getExercice());
    this.openExerciceManagerModal(
      exercices[exercices.length - 1],
      workout,
      day
    );
  }

  addSetToExercice(movements) {
    movements.push(this.getMovement());
  }

  remove() {
    if (this.weeks.length > 1) {
      this.weeks.pop();
      this.autoSave();
    }
  }

  allowDropFunction() {
    return (dragData: any) => true;
  }

  onDragStart($event) {
    this.closeAllBoxes();

    console.log("onDragStart", $event);
  }

  onDropSuccess($event) {
    console.log("onDropSuccess", $event);
  }

  openEditModal() {
    const initialState = {
      model: _.cloneDeep(this.model),
    };

    this.bsModalRef = this.modalService.show(TemplatesModalEditComponent, {
      keyboard: false,
      initialState: initialState,
      class: "modal-xs",
    });
  }

  openCopiedWorkoutDeleteModal() {
    const initialState = {
      isPlanning: true,
      isMultiple: true,
      copiedWorkouts: this.selectedWorkoutsData,
      weeks: this.weeks,
      count: this.selectedWorkoutsCount,
      isFromUrl: this.isFromUrl,
    };

    this.bsModalRef = this.modalService.show(
      TemplatesModalWorkoutDeleteComponent,
      {
        keyboard: false,
        initialState: initialState,
        class: "modal-xs",
      }
    );
  }

  openWorkoutDeleteModal(model, position, workouts) {
    const initialState = {
      model: model,
      position: position,
      workouts: workouts,
      isPlanning: true,
      isFromUrl: this.isFromUrl,
    };

    this.bsModalRef = this.modalService.show(
      TemplatesModalWorkoutDeleteComponent,
      {
        keyboard: false,
        initialState: initialState,
        class: "modal-xs",
      }
    );
  }

  openExerciceDeleteModal(model, position, exercices, workout) {
    const initialState = {
      model: model,
      workout: workout,
      position: position,
      exercices: exercices,
      isPlanning: true,
      isFromUrl: this.isFromUrl,
    };

    this.bsModalRef = this.modalService.show(
      TemplatesModalExerciceDeleteComponent,
      {
        keyboard: false,
        initialState: initialState,
        class: "modal-xs",
      }
    );
  }

  openExerciceManagerModal(model, workout, day) {
    if (!model.step) {
      model.step = 1;
    }

    const initialState = {
      day: day,
      model: model,
      workout: workout,
      isPlanning: true,
      userId: this.user.id,
      profil: this.user.profil || [],
      isFromUrl: this.isFromUrl,
      // model: _.cloneDeep(model),
    };

    console.log(initialState);

    this.bsModalRef = this.modalService.show(
      TemplatesModalExerciceManagerComponent,
      {
        keyboard: false,
        initialState: initialState,
        class: "modal-lg",
      }
    );
  }

  onSelectWorkout(event) {
    event.preventDefault();
  }

  removeRestDay(day) {
    day.restDay.isRestDay = false;
    this.closeAllBoxes();
  }

  markAsOver(id, weekId) {
    this.closeAllBoxes();

    this.hover[id] = true;
    this.hover[weekId] = true;
  }

  markAsLeave(id) {
    this.hover[id] = false;
  }

  markAsRestDay(day, i, y) {
    day.restDay.isRestDay = true;

    this.markAsOver("r-" + i + "-" + y, "w-" + i);
  }

  closeAllBoxes() {
    let k = Object.keys(this.hover);
    for (let i = 0; i < k.length; i++) {
      this.hover[k[i]] = false;
    }

    this.autoSave();
  }

  onChangeSelection(event, id, workout) {
    this.copyWorkouts = [];

    if (this.selectedWorkouts[id]) {
      this.selectedWorkoutsData[id] = workout;
    } else {
      if (this.selectedWorkoutsData[id]) {
        delete this.selectedWorkoutsData[id];
      }
    }

    this.selectedWorkoutsCount = 0;

    let hasSelection = false;
    let k = Object.keys(this.selectedWorkouts);
    for (let i = 0; i < k.length; i++) {
      if (this.selectedWorkouts[k[i]]) {
        this.selectedWorkoutsCount++;

        if (!hasSelection) {
          hasSelection = true;
        }
      }
    }

    if (hasSelection !== this.showFooterAction) {
      this.showFooterAction = !this.showFooterAction;
    }
  }

  pasteCopiedWorkouts(workouts, day) {
    let k = Object.keys(this.selectedWorkoutsData);
    for (let i = 0; i < k.length; i++) {
      let workout = _.cloneDeep(this.selectedWorkoutsData[k[i]]);
      workout.workout_id = 0;
      workout.started_at = day.date + " 00:00:00";
      workout.program_json = JSON.stringify(workout.program);
      workout.user_id = this.user.id;

      if (workout) {
        this.usersService[
          this.isFromUrl ? "createWorkout" : "createClientWorkout"
        ](workout).subscribe((response: any) => {
          // this.usersService.createWorkout(workout).subscribe((response: any) => {
          if (response.workout) {
            workouts.push(response.workout);
          }
        });
      }
    }

    this.closeFooterActions();
  }

  showCopyBoxes() {
    this.showPasteCopiedWorkouts = true;
  }

  closeFooterActions() {
    this.selectedWorkouts = {};
    this.selectedWorkoutsData = {};
    this.showFooterAction = false;
    this.showPasteCopiedWorkouts = false;
  }

  getMovement() {
    return {
      name: "Snatch",
      value: "2 X 3 # 75%",
    };
  }

  getExercice(withoutName?) {
    return {
      name: "",
      movements: [],
    };
  }

  getWokout(day?) {
    day = day || {};
    return {
      day: day.day,
      date: day.date,
      month: day.month,
      year: day.year,
      program: {
        name: "",
        exercices: [],
      },
    };
  }

  getWorkouts() {
    return {
      restDay: {
        isRestDay: false,
        description: "",
      },
      workouts: [],
    };
  }

  private _syncWorkouts(startedAtModel?, reset?) {
    this.isLoading = true;
    this.startedAtModel = startedAtModel ? startedAtModel : this.startedAtModel;

    this.sub.onGetAllWorkout && this.sub.onGetAllWorkout.unsubscribe();

    let date =
      this.startedAtModel.year +
      "-" +
      this.startedAtModel.month +
      "-" +
      this.startedAtModel.day;

    if (this.isFromUrl) {
      this.sub.onGetAllWorkout = this.usersService
        .getAllWorkout(date)
        .subscribe((workouts: any) => {
          if (workouts) {
            this.workouts = _.cloneDeep(workouts);
          }
          this.isLoading = false;
          this._init(!reset);
          this._refreshWeeksWithWorkouts();
        });
    } else {
      let clientId = this.authService.getCurrentAthletId();
      this.sub.onGetAllWorkout = this.usersService
        .getAllClientWorkout(clientId, date)
        .subscribe((workouts: any) => {
          if (workouts) {
            this.workouts = _.cloneDeep(workouts);
          }
          this.isLoading = false;
          this._init(!reset);
          this._refreshWeeksWithWorkouts();
        });
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.autoSave();
  }
  openStartSessionModal(workout, day) {
    const initialState = {
      day: day,
      step: 1,
      workout: workout,
      isPlanning: true,
      userId: this.user.id,
      profil: this.user.profil || [],
      isFromUrl: this.isFromUrl,
      // model: _.cloneDeep(model),
    };

    console.log(initialState);

    this.bsModalRef = this.modalService.show(
      TemplatesModalStartSessionComponent,
      {
        keyboard: false,
        initialState: initialState,
        class: "modal-lg",
      }
    );
  }
    validateInput(currentValue: NgbDateStruct | null, input: string): NgbDateStruct | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }

}
