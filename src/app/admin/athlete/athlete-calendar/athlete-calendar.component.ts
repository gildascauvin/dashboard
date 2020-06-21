import { Component, OnInit, Inject, Input, SimpleChanges, HostListener } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DOCUMENT } from '@angular/common';

import { format, addHours, startOfISOWeek, startOfWeek, endOfWeek } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { webConfig } from '../../../web-config';

import { AuthService } from '../../../_/services/http/auth.service';
import { UserService } from '../../../_/services/model/user.service';
import { UsersService } from '../../../_/templates/users.service';

import { DeepDiffMapperService } from '../../../_/services/deep-diff-mapper.service';

import { TemplatesModalEditComponent } from '../../../_/templates/templates-modal/templates-modal-edit/templates-modal-edit.component';
import { TemplatesModalWorkoutDeleteComponent } from '../../../_/templates/templates-modal/templates-modal-workout-delete/templates-modal-workout-delete.component';
import { TemplatesModalExerciceDeleteComponent } from '../../../_/templates/templates-modal/templates-modal-exercice-delete/templates-modal-exercice-delete.component';
import { TemplatesModalExerciceManagerComponent } from '../../../_/templates/templates-modal/templates-modal-exercice-manager/templates-modal-exercice-manager.component';

@Component({
  selector: 'app-athlete-calendar',
  templateUrl: './athlete-calendar.component.html',
  styleUrls: ['./athlete-calendar.component.scss']
})
export class AthleteCalendarComponent implements OnInit {
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

  isHover: boolean = false;
  isLeave: boolean = false;

  copyWorkouts: any[] = [];

  selectedWorkouts: any = {};
  selectedWorkoutsData: any = {}
  selectedWorkoutsCount: number = 0;

  waitingForCopy: boolean = false;
  showFooterAction: boolean = false;
  showPasteCopiedWorkouts: boolean = false;

	workouts: any = {};

	endDay: any = endOfWeek(new Date(), {weekStartsOn: 1});

	startDay: any = startOfWeek(new Date(), {weekStartsOn: 1});

	weeks: any[] = [];

  configExercices: any = webConfig.exercices;

  ngOfWeeks: number = 7;

  isLoadingScroll: boolean = false;

  currentMonth: string = '';
  cloneWeeks: any = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private toastrService: ToastrService,
    private authService: AuthService,
    private userService: UserService,
    private usersService: UsersService,
    private deepDiffMapperService: DeepDiffMapperService,
    private modalService: BsModalService
    ) {

  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.closeAllBoxes();
  }

  ngOnInit(): void {
    this.user = this.authService.getUserData();

    this.authService.getUserInfos(true);
      setTimeout(() => {
        this.user = this.authService.getUserData();
        if (this.user && this.user.workouts) {
          this.workouts = _.cloneDeep(this.user.workouts);
        }

        this._init(true);
      }, 1000);

    this.sub.onWorkoutSaved = this.usersService.onWorkoutSaved.subscribe((o) => {
      console.log('o', o);
      this.authService.getUserInfos(true);
      setTimeout(() => {
        this.user = this.authService.getUserData();
      }, 1000)
    });

    console.log('this.user', this.user);
    if (this.user && this.user.workouts) {
      this.workouts = _.cloneDeep(this.user.workouts);
    }

    this.userService.onUpdate.subscribe((user) => {
      this.user = this.authService.getUserData();
      if (this.user && this.user.workouts) {
        this.workouts = _.cloneDeep(this.user.workouts);
      }
    });

		this._init();

		let today = startOfWeek(new Date(), {weekStartsOn: 1});
		this.currentMonth = this._getMonthName(format(today, 'MM')) + ' ' + format(today, 'yyyy');

		let navbar = this.document.getElementById("navbar-planning");
  	let sticky = navbar.offsetTop;

    let footerScroll = this.document.getElementById("footer-scroll");
		let bodyScroll = this.document.getElementById("fixed-calendar-planning");
    let bodyTop = bodyScroll.getBoundingClientRect().top;

  	bodyScroll.onscroll = () => {
			let weeksScroll = this.document.querySelectorAll(".week-scroll");
      let stickyFooter = footerScroll.offsetTop - 700;

  		weeksScroll.forEach((weekNode: any) => {
  			// let weekNodeEl = this.document.querySelector(weekNode);
        let nWeek = weekNode.getBoundingClientRect();
        // console.log(nWeek.top, nWeek, bodyTop, nWeek.top - bodyTop);
  			if (nWeek.top < 100) {
	  			this.currentMonth = weekNode.attributes['data-date'].textContent;
  			}
  		})

		  // if (window.pageYOffset > sticky) {
		  //   navbar.classList.add("sticky")
		  // } else {
		  //   navbar.classList.remove("sticky");
		  // }

		  if (window.pageYOffset >= stickyFooter && !this.isLoadingScroll) {
  			this.isLoadingScroll = true;
        // this._init();
		  }
  	}
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'workouts': {
            // this._init();
          }
        }
      }
    }
  }

  ngOnDestroy() {
    this.sub.templates && this.sub.templates.unsubscribe();
    this.sub.onWorkoutSaved && this.sub.onWorkoutSaved.unsubscribe();
  }

  private _init(reset?) {
    if (reset) {
      let today = startOfWeek(new Date(), {weekStartsOn: 1});
      this.currentMonth = this._getMonthName(format(today, 'MM')) + ' ' + format(today, 'yyyy');

      this.endDay = endOfWeek(new Date(), {weekStartsOn: 1});
      this.startDay = startOfWeek(new Date(), {weekStartsOn: 1});

      this.weeks = [];
    }

    this._addWeeks();
  }

  private _addWeeks() {
    for (let y = 0; y < 5; ++y) {
      let days = [];
      let date = new Date(this.startDay);
      for (let i = 0; i < this.ngOfWeeks; ++i) {
        let formatedDate = format(date, 'yyyy-MM-dd');
        let formatedDay = format(date, 'dd');
        let formatedMonth = format(date, 'MM');
        let formatedYear = format(date, 'yyyy');
        let currentDay = {
          name: this._getWeekName(i),
          date: formatedDate,
          day: formatedDay,
          month: formatedMonth,
          monthText: this._getMonthName(formatedMonth),
          year: formatedYear,
          workouts: []
        };


        if (this.workouts && this.workouts[formatedDate]) {
          currentDay.workouts = this.workouts[formatedDate];
        }

        days.push(currentDay);

        date = addHours(date, 24);
        this.startDay = date;
      }

      this.weeks.push(days);
    }

    this.cloneWeeks = _.cloneDeep(this.weeks);

    this.isLoadingScroll = false;
  }

  private _getWeekName(pos) {
    switch (pos) {
      case 0:
        return '#Monday'
      case 1:
        return '#Tuesday'
      case 2:
        return '#Wednesday'
      case 3:
        return '#Thurday'
      case 4:
        return '#Friday'
      case 5:
        return '#Saturday'
      case 6:
        return '#Sunday'
    }
  }

  private _getMonthName(pos) {
    switch (pos) {
      case 1:
      case '01':
        return '#January'
      case 2:
      case '02':
        return '#February'
      case 3:
      case '03':
        return '#March'
      case 4:
      case '04':
        return '#April'
      case 5:
      case '05':
        return '#May'
      case 6:
      case '06':
        return '#June'
      case 7:
      case '07':
        return '#July'
      case 8:
      case '08':
        return '#August'
      case 9:
      case '09':
        return '#September'
      case 10:
      case '10':
        return '#October'
      case 11:
      case '11':
        return '#November'
      case 12:
      case '12':
        return '#December'

    }
  }

  autoSave() {
    this.save();
  }

  save() {
    let diff = this.deepDiffMapperService.difference(this.weeks, this.cloneWeeks);

    let workoutToSave = [];

    _.forEach(this.weeks, (week) => {
      _.forEach(week, (day) => {
        if (day.workouts.length) {
          _.forEach(day.workouts, (workout) => {
            _.forEach(workout.program.exercices, (exercice) => {
              if (exercice.updated) {
                workoutToSave.push(workout);
                // exercice.updated = false;
              }
            });
          });
        }
      });
    });

    _.forEach(workoutToSave, (workout) => {

      // let body = {
      //     user_id: this.id,
      //     type_id: this.model.type.id,
      //     day: this.model.day,
      //     hour: this.model.hour,
      //     program_json: JSON.stringify(this.model),
      //     started_at: this.model.started_at,
      //   };

      if (workout.workout_id) {
        console.log('Updated');
      } else {
        console.log('Created');
        // this.usersService.createWorkout(body).subscribe((savedWorkout) => {
        //   console.log('savedWorkout', savedWorkout);
        // });
      }
    });
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

    this.markAsOver(i + '-' + y + '-' + (day.workouts.length - 1) , 'w-' + i);
    this.addExerciceToWorkout(day, day.workouts[day.workouts.length - 1].program.exercices, day.workouts[day.workouts.length - 1]);
  }

  pasteWorkout(workouts, i, y) {
    if (!this.copyWorkouts.length) {
      return;
    }

    workouts.push(this.copyWorkouts[0]);
  }

  addExerciceToWorkout(day, exercices, workout) {
    exercices.push(this.getExercice());
    this.openExerciceManagerModal(exercices[exercices.length - 1], workout, day);
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

  onDragStart(){
    this.closeAllBoxes();
  }

  openEditModal() {
    const initialState = {
      model: _.cloneDeep(this.model),
    };

    this.bsModalRef = this.modalService.show(TemplatesModalEditComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-xs'
    });
  }

  openCopiedWorkoutDeleteModal() {
    const initialState = {
      isPlanning: true,
      isMultiple: true,
      copiedWorkouts: this.selectedWorkoutsData,
      weeks: this.weeks,
      count: this.selectedWorkoutsCount
    };

    this.bsModalRef = this.modalService.show(TemplatesModalWorkoutDeleteComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-xs'
    });

  }

  openWorkoutDeleteModal(model, position, workouts) {
    console.log('++++++++++++++++++', model, position, workouts, '++++++++++++++++++');

    const initialState = {
      model: model,
      position: position,
      workouts: workouts,
      isPlanning: true,
    };

    this.bsModalRef = this.modalService.show(TemplatesModalWorkoutDeleteComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-xs'
    });
  }

  openExerciceDeleteModal(model, position, exercices, workout) {
    const initialState = {
      model: model,
      workout: workout,
      position: position,
      exercices: exercices,
      isPlanning: true,
    };

    this.bsModalRef = this.modalService.show(TemplatesModalExerciceDeleteComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-xs'
    });

  }

  openExerciceManagerModal(model, workout, day) {
    if (!model.step) {
      model.step = 1
    }

    const initialState = {
      day: day,
      model: model,
      workout: workout,
      isPlanning: true,
      userId: this.user.id
      // model: _.cloneDeep(model),
    };

    this.bsModalRef = this.modalService.show(TemplatesModalExerciceManagerComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-lg'
    });
  }

  onSelectWorkout(event) {
    event.preventDefault();
  }

  removeRestDay(day) {
    day.restDay.isRestDay=false;
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

    this.markAsOver('r-' + i + '-' + y , 'w-' + i);
  }

  closeAllBoxes() {
    let k = Object.keys(this.hover);
    for(let i=0; i < k.length; i++) {
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
    for(let i=0; i < k.length; i++) {
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

  pasteCopiedWorkouts(workouts) {
    let k = Object.keys(this.selectedWorkoutsData);
    for(let i=0; i < k.length; i++) {
      let workout = this.selectedWorkoutsData[k[i]];
      if (workout) {
        workouts.push(workout);
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
      name: 'Snatch',
      value: '2 X 3 # 75%'
    };
  }

  getExercice(withoutName?) {
    return {
      name: '',
      movements: []
    }
  }

  getWokout(day?) {
    day = day || {};
    return {
      day: day.day,
      date: day.date,
      month: day.month,
      year: day.year,
      program: {
        name: '',
        exercices: [
        ]
      }
    };
  }

  getWorkouts() {
    return {
      restDay: {
        isRestDay: false,
        description: ''
      },
      workouts: []
    };
  }

}
