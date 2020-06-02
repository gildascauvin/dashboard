import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TemplatesService } from '../../templates.service';
import { ToastrService } from 'ngx-toastr';
import { FormModalCore } from '../../../../_/core/form-modal.core';

@Component({
  selector: 'tpc-templates-modal-duplicate',
  templateUrl: './templates-modal-duplicate.component.html',
  styleUrls: ['./templates-modal-duplicate.component.scss']
})
export class TemplatesModalDuplicateComponent extends FormModalCore implements OnInit {
	model: any = {};

	errors: any = {};

	constructor(
  	public bsModalRef: BsModalRef,
		private templatesService: TemplatesService,
  	private toastrService: ToastrService,) { super(); }

  ngOnInit(): void {
  	this.model.name = this.model.name + ' copy';
  }

  cancel() {
		this.model = {};
    this.bsModalRef.hide();
  }

  save() {
    this.startLoading();

    this.model.duplicate = true;

    this.templatesService.create(this.model).subscribe((data: any) => {
      if (!data.errors) {
        this.cancel();
        this.templatesService.onListUpdated.emit(true);
        this.toastrService.success('Template created!');
      } else {
      	this.errors = data.errors;
        this.toastrService.error(data.message || 'An error has occurred');
      }
  	}, error => this.toastrService.error('An error has occurred'));
  }
}
