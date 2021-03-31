import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UsersService } from '../../users.service';
import { ToastrService } from 'ngx-toastr';

import { webConfig } from '../../../../web-config';
import { FormModalCore } from '../../../core/form-modal.core';
import {AthleteProfileService} from "../../../../admin/athlete/athlete-profile/athlete-profile.service";
import {AuthService} from "../../../services/http/auth.service";

@Component({
  selector: 'tpc-metrics-modal-create',
  templateUrl: './metrics-modal-create.component.html',
  styleUrls: ['./metrics-modal-create.component.scss']
})
export class MetricsModalCreateComponent extends FormModalCore implements OnInit {

	modelMetric: any = {};

  templates: any [] = [];
  selectedTemplate: any = {};

	modelId: number = 0;
	groupName: any = '';
  metricDate: any;

  errors: any = {}

  sub: any;

	constructor(
  	public bsModalRef: BsModalRef,
  	private usersService: UsersService,
  	private toastrService: ToastrService,
    private athleteProfileService: AthleteProfileService,
    private authService: AuthService,
  ) {
    super();
  }

  ngOnInit(): void {
	  console.log(this.groupName);
	  this.modelMetric.group = this.groupName;
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }

  cancel() {
  	this.modelMetric = {};
    this.bsModalRef.hide();
  }

  onDateMetricChange(model) {
    this.metricDate =  model.day + "/" + model.month + "/" + model.year;
  }

  save() {
	  this.startLoading();

    let clientId = this.authService.getCurrentAthletId();

	  this.modelMetric.user_id = this.modelId;
    this.modelMetric.date = this.metricDate;

      this.usersService.createMetric(clientId, this.modelMetric).subscribe((data: any) => {
      if (!data.errors) {
      	this.cancel();
        this.athleteProfileService.onCreatedMetric.emit(true);
        this.toastrService.success('Metric created !');
      } else {
      	this.errors = data.errors;
        this.toastrService.error(data.message || 'An error has occurred');
      }
  	}, (e) => this.toastrService.error('An error has occurred'));

  }
}
