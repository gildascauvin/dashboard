import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {UsersService} from '../../users.service';
import {ToastrService} from 'ngx-toastr';
import {FormModalCore} from '../../../core/form-modal.core';
import * as _ from 'lodash';
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {AthleteCalendarService} from 'src/app/admin/athlete/athlete-calendar/athlete-calendar.service';
import {webConfig} from "../../../../web-config";

@Component({
  selector: 'tpc-planning-modal-edit',
  templateUrl: './planning-modal-edit.component.html',
  styleUrls: ['./planning-modal-edit.component.scss']
})
export class PlanningModalEditComponent extends FormModalCore implements OnInit {

  model: any = {};
  modelPlanning: any = {};
  templates: any [] = [];
  selectedTemplate: any = {};
  errors: any = {};
  userId: number = 0;

  startDate: NgbDateStruct = {
    day: 1,
    month: 1,
    year: 2002,
  };

  endDate: NgbDateStruct = {
    day: 1,
    month: 1,
    year: 2002,
  };

  configPlanning: any = webConfig.planning;

  constructor(
    public bsModalRef: BsModalRef,
    private usersService: UsersService,
    private toastrService: ToastrService,
    private athleteCalendarService: AthleteCalendarService
  ) {
    super();
  }

  ngOnInit(): void {
    this.modelPlanning = _.cloneDeep(this.model);

    let startDateSplit = this.modelPlanning.start_date.split('/');
    let endDateSplit = this.modelPlanning.end_date.split('/');
    this.startDate = {
      day: parseInt(startDateSplit[0]),
      month: parseInt(startDateSplit[1]),
      year: parseInt(startDateSplit[2])
    };
    this.endDate = {day: parseInt(endDateSplit[0]), month: parseInt(endDateSplit[1]), year: parseInt(endDateSplit[2])};
  }

  ngOnDestroy(): void {}

  cancel() {
    this.model = {};
    this.userId = 0;
    this.bsModalRef.hide();
  }

  onStartDatePlanningChange(model) {
    this.modelPlanning.start_date = model.day + "/" + model.month + "/" + model.year;
  }

  onEndDatePlanningChange(model) {
    this.modelPlanning.end_date = model.day + "/" + model.month + "/" + model.year;
  }

  save() {
    this.startLoading();

    this.usersService.updatePlanning(this.userId, this.modelPlanning).subscribe((data: any) => {
      if (!data.errors) {
        this.cancel();
        this.athleteCalendarService.onUpdatedPlanning.emit(true);
        this.toastrService.success('Planning updated !');
      } else {
        this.errors = data.errors;
        this.toastrService.error(data.message || 'An error has occurred');
      }
    }, (e) => this.toastrService.error('An error has occurred'));

  }

  delete() {
    this.usersService.removePlanning(this.userId, this.modelPlanning.planning_id).subscribe((data: any) => {
      if (!data.errors) {
        this.cancel();
        this.athleteCalendarService.onRemovedPlanning.emit(true);
        this.toastrService.success('Planning removed!');
      } else {
        this.errors = data.errors;
        this.toastrService.error(data.message || 'An error has occurred');
      }
    }, (e) => this.toastrService.error('An error has occurred'));
  }
}
