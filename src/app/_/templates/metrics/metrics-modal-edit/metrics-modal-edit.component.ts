import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UsersService } from '../../users.service';
import { ToastrService } from 'ngx-toastr';
import { FormModalCore } from '../../../core/form-modal.core';
import {AthleteProfileService} from "../../../../admin/athlete/athlete-profile/athlete-profile.service";
import * as _ from 'lodash';
import {AuthService} from "../../../services/http/auth.service";

@Component({
  selector: 'tpc-metrics-modal-edit',
  templateUrl: './metrics-modal-edit.component.html',
  styleUrls: ['./metrics-modal-edit.component.scss']
})
export class MetricsModalEditComponent extends FormModalCore implements OnInit {

	modelMetric: any = {};

  templates: any [] = [];
  selectedTemplate: any = {};

	model: any = {};

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
	  this.modelMetric = _.cloneDeep(this.model);
	  this.modelMetric.group = this.modelMetric.group.name;

	  console.log(this.modelMetric);
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }

  cancel() {
  	this.modelMetric = {};
    this.bsModalRef.hide();
  }

  save() {
	  this.startLoading();

    let clientId = this.modelMetric.user_id;

    this.usersService.updateMetric(clientId, this.modelMetric).subscribe((data: any) => {
    if (!data.errors) {
      this.cancel();
      this.athleteProfileService.onCreatedMetric.emit(true);
      this.toastrService.success('Metric updated !');
    } else {
      this.errors = data.errors;
      this.toastrService.error(data.message || 'An error has occurred');
    }
  }, (e) => this.toastrService.error('An error has occurred'));

  }
}
