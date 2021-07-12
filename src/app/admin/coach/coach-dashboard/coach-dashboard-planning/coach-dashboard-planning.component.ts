import { DOCUMENT } from "@angular/common";
import {Component, ElementRef, HostListener, Inject, Input, OnInit,} from "@angular/core";
import { DoorgetsTranslateService } from "doorgets-ng-translate";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { webConfig } from "../../../../web-config";
import { AuthService } from "../../../../_/services/http/auth.service";
import { UserService } from "../../../../_/services/model/user.service";
import { ResizeService } from "../../../../_/services/ui/resize-service.service";
import { UsersModalProgramCreateComponent } from "../../../../_/templates/programs/users-modal-program-create/users-modal-program-create.component";
import { TemplatesModalExerciceManagerComponent } from "../../../../_/templates/templates-modal/templates-modal-exercice-manager/templates-modal-exercice-manager.component";
import { UsersService } from "../../../../_/templates/users.service";
import { UsersModalInvitationCreateComponent } from "../../coach-clients/coach-clients-modal/users-modal-invitation-create/users-modal-invitation-create.component";
import {FatigueManagementComputerService} from "../../../../_/services/stats/fatigue-management-computer.service";
import * as _ from "lodash";
import {CustomerStatsService} from "../../../../_/components/ui/customer-stats-range/customer-stats-range.service";
import {endOfWeek, startOfWeek} from "date-fns";

@Component({
  selector: "app-coach-dashboard-planning",
  templateUrl: "./coach-dashboard-planning.component.html",
  styleUrls: ["./coach-dashboard-planning.component.scss"],
})
export class CoachDashboardPlanningComponent implements OnInit {
  @Input() isFromUrl = true;

  bsModalRef: BsModalRef;

  sub: any = {};
  user: any = {};
  userWorkouts: any = {};

  workouts: any = [];
  flatWorkouts: any = [];

  configExercices: any = webConfig.exercices;

  isEmpty = false;
  isLoading = false;

  size: number = 768;
  responsiveSize: number = 768;

  totalColumn: number = 3;
  rowNumbers: number[];

  dateStartOn: any;
  dateEndOn: any;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private resizeSvc: ResizeService,
    private usersService: UsersService,
    private modalService: BsModalService,
    private doorgetsTranslateService: DoorgetsTranslateService,
    private elementRef: ElementRef,
    private fatigueManagementComputer: FatigueManagementComputerService,
    private customerStatsService: CustomerStatsService,
    @Inject(DOCUMENT) private _document
  ) {}

  ngOnInit(): void {
    this.detectScreenSize();
    this._computeResponsiveGrid();

    this.customerStatsService.onRefreshStats.emit();

    if (this.isFromUrl) {
      this.authService.setCurrentAthletId(0);
      this.authService.setCurrentAthlet({});

      this.sub.onWorkoutSaved = this.usersService.onWorkoutSaved.subscribe(
        (o) => {
          this._initUser();
        }
      );

      this.sub.onUpdate = this.userService.onUpdate.subscribe((user) => {
        this.user = this.authService.getUserData();
        this._checkEmpty();
      });

      this.sub.onUserUpdated = this.usersService.onUserUpdated.subscribe(() => {
        this.user = this.authService.getUserData();
        this._checkEmpty();
      });

    }

    this.sub.onStatsUpdated = this.customerStatsService.onStatsUpdated.subscribe(
      (component) => {
        this.dateStartOn = component.startDay;
        this.dateEndOn = component.endDay;

        this._initUser();
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.onUpdate && this.sub.onUpdate.unsubscribe();
    this.sub.userInfo && this.sub.userInfo.unsubscribe();
    this.sub.resizeSvc && this.sub.resizeSvc.unsubscribe();
    this.sub.onUserUpdated && this.sub.onUserUpdated.unsubscribe();
    this.sub.onWorkoutSaved && this.sub.onWorkoutSaved.unsubscribe();
    this.sub.onStatsUpdated && this.sub.onStatsUpdated.unsubscribe();
  }

  setCurrentAthletId(clientId) {
    this.authService.setCurrentAthletId(clientId);
    this.authService.setCurrentAthlet({});
  }

  private _initUser() {
    this.isLoading = true;
    this.sub.userInfo && this.sub.userInfo.unsubscribe();

    this.sub.userInfo = this.usersService.getUser().subscribe((user: any) => {
      if (user) {
        this.user = user;

        this._initWorkouts();

        this.userService.initUserInfos(user);
        this.isLoading = false;

        this._checkEmpty();
      }
    });
  }

  private _initWorkouts() {

    let monthStartOn = this.dateStartOn.getMonth() + 1;
    let dayStartOn = this.dateStartOn.getDate();
    let startOn = this.dateStartOn.getFullYear() + "-" + ((monthStartOn < 10) ? '0':'') + monthStartOn + "-" + ((dayStartOn < 10) ? '0':'') + dayStartOn;

    let monthEndOn = this.dateEndOn.getMonth() + 1;
    let dayEndOn = this.dateEndOn.getDate();
    let endOn = this.dateEndOn.getFullYear() + "-" + ((monthEndOn < 10) ? '0':'') + monthEndOn + "-" + ((dayEndOn < 10) ? '0':'') + dayEndOn;

    if (this.isFromUrl) {
      this.usersService
        .getAllUserWorkouts(this.user.id, startOn, endOn)
        .subscribe((userWorkouts) => {
          this.workouts = (userWorkouts && Object.keys(userWorkouts)) || [];
          this.userWorkouts = userWorkouts;
          this.flatWorkouts = [];

          this.workouts.map((date) => {
            let _date = date.split("-");

            this.flatWorkouts.push({
              date: date,
              label: _date[2] + " " + this._getMonthName(_date[1]) + " " + _date[0],
            });

            return date;
          });
          this._checkEmpty();
        });
    } else {

      this.workouts = [];
      this.flatWorkouts = [];
      this.userWorkouts = [];

      for (let i in this.user.coachs) {
        let coachId = this.user.coachs[i].user_id;

        this.usersService
          .getAllUserWorkouts(coachId, startOn, endOn)
          .subscribe((userWorkouts) => {
            let userWorkoutsKeys = (userWorkouts && Object.keys(userWorkouts)) || [];

            for(let key in userWorkoutsKeys) {
              if (this.workouts.indexOf(userWorkoutsKeys[key]) < 0) {
                this.workouts.push(userWorkoutsKeys[key]);
              }
            }

            if (this.userWorkouts.length == 0) {
              this.userWorkouts = userWorkouts;
            } else {
              for(let workoutKey in userWorkouts) {
                this.userWorkouts[workoutKey] = _.concat(this.userWorkouts[workoutKey], userWorkouts[workoutKey]);
              }
            }

            this.flatWorkouts = [];

            this.workouts.map((date) => {
              let _date = date.split("-");

              this.flatWorkouts.push({
                date: date,
                label: _date[2] + " " + this._getMonthName(_date[1]) + " " + _date[0],
              });

              return date;
            });
            this._checkEmpty();
          });
      }
    }

  }

  private _checkEmpty() {
    this.isEmpty = false;
    if (!this.flatWorkouts.length) {
      this.isEmpty = true;
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

  private _computeResponsiveGrid() {
    if (this.size < this.responsiveSize) {
      this.totalColumn = 2;
    }

    this.rowNumbers = Array.from({length: this.totalColumn}, (_, i) => i);
  }

  computeFatigueManagementData(workout) {
    let fatigueManagement = this.fatigueManagementComputer.compute(workout);
    return fatigueManagement;
  }

  openExerciceManagerModal() {
    let model: any = {
      movements: [],
      step: 1,
    };

    const initialState = {
      model: model,
      workout: this.getWokout(),
      isPlanning: true,
      showDate: true,
      userId: this.user.id,
      // model: _.cloneDeep(model),
    };

    this.bsModalRef = this.modalService.show(
      TemplatesModalExerciceManagerComponent,
      {
        keyboard: false,
        initialState: initialState,
        class: "modal-lg",
      }
    );
  }

  openProgramCreateModal() {
    const initialState = {
      modelId: this.user.id,
      programs: this.user.programs,
    };

    this.bsModalRef = this.modalService.show(UsersModalProgramCreateComponent, {
      keyboard: false,
      initialState: initialState,
      class: "modal-xs",
    });
  }

  openInvitationCreateModal() {
    const initialState = {
      modelId: this.user.id,
    };

    this.bsModalRef = this.modalService.show(
      UsersModalInvitationCreateComponent,
      {
        keyboard: false,
        initialState: initialState,
        class: "modal-xs",
      }
    );
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

  @HostListener("window:resize", [])
  private onResize() {
    this.detectScreenSize();
  }

  private detectScreenSize() {
    const currentSize = this._document.body.clientWidth;
    this.size = currentSize;
    this.resizeSvc.onResize(currentSize);
  }
  checkIsToday (someDate){
    let date = new Date(someDate);
    const today = new Date()
    return date.getDate() == today.getDate() &&
      date.getMonth() == today.getMonth() &&
      date.getFullYear() == today.getFullYear()
  }
  getCardioUnitLabel(key) {
    const labelObj = this.configExercices.unit.find(obj => obj.id == key);
    return labelObj.name;
  }
}
