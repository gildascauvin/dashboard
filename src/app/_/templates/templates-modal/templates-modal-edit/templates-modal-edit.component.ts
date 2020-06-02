import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TemplatesService } from '../../templates.service';
import { ToastrService } from 'ngx-toastr';
import { FormModalCore } from '../../../../_/core/form-modal.core';

@Component({
  selector: 'tpc-templates-modal-edit',
  templateUrl: './templates-modal-edit.component.html',
  styleUrls: ['./templates-modal-edit.component.scss']
})
export class TemplatesModalEditComponent extends FormModalCore implements OnInit {
	model: any = {};

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

  save() {
    this.startLoading();
    console.log('this.model', this.model);
    this.templatesService.update(this.model).subscribe((data: any) => {
      if (!data.errors) {
        this.cancel();
        this.templatesService.onTemplateUpdated.emit(true);
        this.templatesService.onListUpdated.emit(true);
        this.toastrService.success('Template updated!');
      } else {
      	this.errors = data.errors;
        this.toastrService.error(data.message || 'An error has occurred');
      }
  	}, error => this.toastrService.error('An error has occurred'));
  }
}
