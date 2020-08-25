import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { UsersModalProgramCreateComponent } from '../../../_/templates/programs/users-modal-program-create/users-modal-program-create.component';
import { UsersModalProgramEditComponent } from '../../../_/templates/programs/users-modal-program-edit/users-modal-program-edit.component';
import { UsersModalProgramDeleteComponent } from '../../../_/templates/programs/users-modal-program-delete/users-modal-program-delete.component';

import { UsersModalProgramAthleteManagerComponent } from '../../../_/templates/programs/users-modal-program-athlete-manager/users-modal-program-athlete-manager.component';

import { UsersModalProgramDuplicateComponent } from '../../../_/templates/programs/users-modal-program-duplicate/users-modal-program-duplicate.component';
import { UsersModalProgramAssignComponent } from '../../../_/templates/programs/users-modal-program-assign/users-modal-program-assign.component';

import { UsersService } from '../../../_/templates/users.service';
import { AuthService } from '../../../_/services/http/auth.service';

@Component({
  selector: 'app-coach-programs',
  templateUrl: './coach-programs.component.html',
  styleUrls: ['./coach-programs.component.scss']
})
export class CoachProgramsComponent implements OnInit {

  bsModalRef: BsModalRef;

  id: number = 0;

  isLoading: boolean = false;

  sub: any = {};

  programs: any = [];

  user: any = {
    data: {},
    profil: [],
    clients: []
  };

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private modalService: BsModalService,
    private usersService: UsersService) { }

  ngOnInit(): void {
    this.user = this.authService.getUserData();

  	this._syncPrograms();

    this.sub.updateUsers = this.usersService.onUserUpdated.subscribe(() => {
      this._syncPrograms();
    });
  }

  ngOnDestoy(): void {
  	this.sub.onGetAllPrograms && this.sub.onGetAllPrograms.unsubscribe();
  }

	selectProgram(e, i) {}

  private _syncPrograms(strict?) {
    this.isLoading = true;

    this.sub.onGetAllPrograms = this.usersService.getAllPrograms()
      .subscribe((programs: any) => {
      	console.log(programs);
      	this.programs = programs.content;
      });
	}

  openProgramCreateModal() {
    const initialState = {
      modelId: this.id,
      programs: this.programs,
    };
    this.bsModalRef = this.modalService.show(UsersModalProgramCreateComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-xs'
    });
  }

  openProgramEditModal(program) {
    const initialState = {
      modelId: this.id,
      modelProgram: _.cloneDeep(program),
    };
    this.bsModalRef = this.modalService.show(UsersModalProgramEditComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-xs'
    });
  }

  openProgramDuplicateModal(program) {
    const initialState = {
      modelId: this.id,
      modelProgram: _.cloneDeep(program)
    };
    this.bsModalRef = this.modalService.show(UsersModalProgramDuplicateComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-xs'
    });
  }

  openProgramDeleteModal(program) {
    const initialState = {
      modelId: this.id,
      modelProgram: _.cloneDeep(program)
    };
    this.bsModalRef = this.modalService.show(UsersModalProgramDeleteComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-xs'
    });
  }

  openProgramAthleteManagerModal(program) {
    const initialState = {
      modelId: program.program_id,
      athletes: this.user.clients,
      program: _.cloneDeep(program)
    };

    this.bsModalRef = this.modalService.show(UsersModalProgramAthleteManagerComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-xs'
    });
  }

}
