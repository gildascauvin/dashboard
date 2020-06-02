import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TemplatesService } from '../../templates.service';
import { ToastrService } from 'ngx-toastr';
import { FormModalCore } from '../../../../_/core/form-modal.core';
import * as _ from 'lodash';

@Component({
  selector: 'tpc-templates-modal-exercice-delete',
  templateUrl: './templates-modal-exercice-delete.component.html',
  styleUrls: ['./templates-modal-exercice-delete.component.scss']
})
export class TemplatesModalExerciceDeleteComponent extends FormModalCore implements OnInit {
	model: any = {};
	position: number = -1;
  exercices: any[] = [];

	errors: any = {};

	constructor(
  	public bsModalRef: BsModalRef,
		private templatesService: TemplatesService,
  	private toastrService: ToastrService,) { super(); }

  ngOnInit(): void {
  }

  cancel() {
		this.model = {};
    this.bsModalRef.hide();
  }

  delete() {
    this.startLoading();

    _.pullAt(this.exercices, [this.position]);

    this.cancel();
    this.templatesService.onTemplateUpdated.emit(true);
  }
}
