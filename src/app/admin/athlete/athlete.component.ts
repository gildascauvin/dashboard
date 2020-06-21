import { Component, OnInit, Inject } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { DOCUMENT } from '@angular/common';

import { AuthService } from '../../_/services/http/auth.service';
import { UserService } from '../../_/services/model/user.service';

import { TemplatesModalExerciceManagerComponent } from '../../_/templates/templates-modal/templates-modal-exercice-manager/templates-modal-exercice-manager.component';

@Component({
  selector: 'app-athlete',
  templateUrl: './athlete.component.html',
  styleUrls: ['./athlete.component.scss']
})
export class AthleteComponent implements OnInit {
  bsModalRef: BsModalRef;

  user: any = {
    data: {},
    role: {}
  };

  constructor(
  	private authService: AuthService,
    private userService: UserService,
    private modalService: BsModalService,
  	@Inject(DOCUMENT) private _document) { }

  ngOnInit(): void {
    this._document.body.style.background = '#FFF';
    this.user = this.authService.getUserData();

    this.userService.onUpdate.subscribe((user) => {
      this.user = this.authService.getUserData();
      console.log(this.user);
    });
  }

  logout() {
  	this.authService.logout();
  }

  openExerciceManagerModal() {
    let model: any = {
      step: 1
    };

    const initialState = {
      day: '2020-12-06',
      model: {},
      workout: {},
      isPlanning: true,
      showDate: true,
      userId: this.user.id
      // model: _.cloneDeep(model),
    };

    this.bsModalRef = this.modalService.show(TemplatesModalExerciceManagerComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-lg'
    });
  }
}
