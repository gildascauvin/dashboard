import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UsersService } from '../../users.service';
import { ToastrService } from 'ngx-toastr';

import { webConfig } from '../../../../web-config';
import { FormModalCore } from '../../../../_/core/form-modal.core';

@Component({
  selector: 'tpc-users-modal-program-duplicate',
  templateUrl: './users-modal-program-duplicate.component.html',
  styleUrls: ['./users-modal-program-duplicate.component.scss']
})
export class UsersModalProgramDuplicateComponent extends FormModalCore implements OnInit {

	modelProgram: any = {};

	programs: any [] = [];
  templates: any [] = [];
  selectedTemplate: any = {};

	modelId: number = 0;

  errors: any = {}
  errorsMessage: string = '';

  configExercices: any = webConfig.exercices;

  sub: any;

	constructor(
  	public bsModalRef: BsModalRef,
  	private usersService: UsersService,
  	private toastrService: ToastrService,) {
    super();
  }

  ngOnInit(): void {
  	this.modelProgram.name = this.modelProgram.name + ' copy';
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }

  onSelectedItem(item) {
    this.selectedTemplate = item;
    console.log('this.selectedTemplate', this.selectedTemplate);
  }

  onCleared(item) {
    this.selectedTemplate = {};
    console.log('this.selectedTemplate', this.selectedTemplate);
  }

  onChangeSearch(val) {
    if (val) {
      this.sub && this.sub.unsubscribe();

      this.sub = this.usersService.getAllTemplates(val).subscribe((response: any) => {
        if (response && response.content) {
          this.templates = response.content;
        }
      });
    }
  }

  cancel() {
  	this.modelProgram = {};
    this.bsModalRef.hide();
  }

  save() {
    this.startLoading();
    if (this.selectedTemplate.template_id) {
      this.modelProgram.template_id = this.selectedTemplate.template_id;
    }

    this.modelProgram.duplicate = true;

    this.usersService.createProgram(this.modelId, this.modelProgram).subscribe((data: any) => {
      if (!data.errors) {
      	this.cancel();
        this.usersService.onUserUpdated.emit(true);
        this.toastrService.success('Program created!');
      } else {
      	this.errors = data.errors;
        this.toastrService.error(data.message || 'An error has occurred');
      }
  	}, (e) => this.toastrService.error('An error has occurred'));
  }

}
