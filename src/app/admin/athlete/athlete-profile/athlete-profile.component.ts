import {Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {NgbDateStruct, NgbAccordion} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { webConfig } from '../../../web-config';
import { AuthService } from '../../../_/services/http/auth.service';
import { UserService } from '../../../_/services/model/user.service';
import { UsersService } from '../../../_/templates/users.service';
import * as _ from 'lodash';
import {MetricsModalCreateComponent} from "../../../_/templates/metrics/metrics-modal-create/metrics-modal-create.component";
import {AthleteProfileService} from "./athlete-profile.service";
import {MetricsModalEditComponent} from "../../../_/templates/metrics/metrics-modal-edit/metrics-modal-edit.component";

@Component({
  selector: 'app-athlete-profile',
  templateUrl: './athlete-profile.component.html',
  styleUrls: ['./athlete-profile.component.scss']
})
export class AthleteProfileComponent implements OnInit {
  @Output() onSelectedMetric: EventEmitter<any> = new EventEmitter();
  @ViewChildren('acc') accordions: QueryList<NgbAccordion>;

  @Input() isFromUrl = true;

  newResult: any = {};
  newResultDate: any;
  currentGroupsOpened: any = [];

  bsModalRef: BsModalRef;

  sub: any = {};

  user: any = {
  	data: {},
    profil: []
  };

  metrics: any = [];
  metricSelected: any = {};

  isLoading = false;

  configMrv = webConfig.mrv;

  birthdayModel: NgbDateStruct = {
    day: 1,
    month: 1,
    year: 2002
  };

  constructor(
    private authService: AuthService,
    private modalService: BsModalService,
    private userService: UserService,
    private usersService: UsersService,
    private toastrService: ToastrService,
    private athleteProfileService: AthleteProfileService
  	) { }

  ngOnInit(): void {
  	this.user = this.isFromUrl
      ? this.authService.getUserData()
      : this.authService.getUserClientData();

    this._initMetrics();

    this.sub.createMetric = this.athleteProfileService.onCreatedMetric.subscribe(() => {
      this._initMetrics();
    });

    this.sub.metricUnSelected = this.athleteProfileService.onUnSelectedMetric.subscribe(() => {
      this.metricSelected = {};
    });
  }

  _initMetrics() {
    this.usersService.getAllClientMetrics(this.user.id).subscribe((metricsGroups: any) => {
      this.metrics = metricsGroups;

      _.forEach(metricsGroups, (metricsGroup) => {

        if (this.isLoading === false) {
          this.currentGroupsOpened.push('group-' + metricsGroup.group_id);
          this.isLoading = true;
        }

        _.forEach(metricsGroup.metrics, (metric) => {

          if (metric.metric_id == this.metricSelected.metric_id) {
            this.metricSelected = metric;
            this.athleteProfileService.onSelectedMetric.emit(this.metricSelected);
          }
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.sub.createMetric && this.sub.createMetric.unsubscribe();
    //this.sub.subjectUpdateUsers && this.sub.subjectUpdateUsers.unsubscribe();
  }

  toggle(id:string): void {
    this.accordions.forEach((accordion) => {
      accordion.panels.forEach((panel) => {
        if (panel.id == id) {
          accordion.toggle(id);

          const index = this.currentGroupsOpened.indexOf(id);
          if (index > -1) {
            this.currentGroupsOpened.splice(index, 1);
          } else {
            this.currentGroupsOpened.push(id);
          }
        }
      });
    });
  }

  openMetricCreateModal(groupName?) {
    const initialState = {
      modelId: this.user.id,
      groupName: groupName
    };
    this.bsModalRef = this.modalService.show(MetricsModalCreateComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-xs'
    });
  }

  openMetricEditModal(metric) {
    const initialState = {
      model: metric
    };
    this.bsModalRef = this.modalService.show(MetricsModalEditComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-xs'
    });
  }

  removeMetric(metric) {
    let clientId = this.authService.getCurrentAthletId();

    this.usersService.removeMetric(clientId, metric.metric_id).subscribe((data: any) => {
      if (!data.errors) {
        this._initMetrics();
        this.toastrService.success('Metric removed !');
      } else {
        this.toastrService.error('An error has occurred');
      }
    }, (e) => {
      this.toastrService.error('An error has occurred');
    });
  }

  removeMetricResult(metricResult) {
    let clientId = this.authService.getCurrentAthletId();

    this.usersService.removeMetricResult(clientId, metricResult.metric_result_id).subscribe((data: any) => {
      if (!data.errors) {
        this._initMetrics();
        this.toastrService.success('Result removed !');
      } else {
        this.toastrService.error('An error has occurred');
      }
    }, (e) => {
      this.toastrService.error('An error has occurred');
    });
  }

  selectMetric(metric) {
    this.metricSelected = metric;
    this.athleteProfileService.onSelectedMetric.emit(this.metricSelected);
  }

  onDateNewResultChange(model) {
    this.newResultDate =  model.day + "/" + model.month + "/" + model.year;
  }

  saveNewResult() {
    let clientId = this.authService.getCurrentAthletId();

    this.newResult.metric_id = this.metricSelected.metric_id;
    this.newResult.user_id = clientId;
    this.newResult.date = this.newResultDate;

    this.usersService.createMetricResult(clientId, this.newResult).subscribe((data: any) => {
      if (!data.errors) {
        this._initMetrics();
        this.toastrService.success('Metric created !');
      } else {
        this.toastrService.error(data.message || 'An error has occurred');
      }
    }, (e) => this.toastrService.error('An error has occurred'));
  }
}
