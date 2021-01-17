import { Component, OnInit, Inject, ElementRef, HostListener } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { DOCUMENT } from '@angular/common';
import { delay } from 'rxjs/operators';
import * as $ from 'jquery';

import { AuthService } from '../../_/services/http/auth.service';
import { UserService } from '../../_/services/model/user.service';
import { ResizeService } from '../../_/services/ui/resize-service.service';

import { TemplatesModalExerciceManagerComponent } from '../../_/templates/templates-modal/templates-modal-exercice-manager/templates-modal-exercice-manager.component';

@Component({
  selector: 'app-athlete',
  templateUrl: './athlete.component.html',
  styleUrls: ['./athlete.component.scss']
})
export class AthleteComponent implements OnInit {
  bsModalRef: BsModalRef;
  currentUser: any = {};

  user: any = {
    data: {},
    role: {}
  };

  sub: any = {};

  size: number = 1;
  responsiveSize: number = 768;

  showLeftMenu: boolean = false;
  showRightMenu: boolean = false;

  constructor(
  	private authService: AuthService,
    private userService: UserService,
    private modalService: BsModalService,
    private resizeSvc: ResizeService,
    private router: Router,
    private elementRef: ElementRef,
  	@Inject(DOCUMENT) private _document) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentAthlet() || {};
    this._document.body.style.background = '#FFF';
    this.user = this.authService.getUserData();

    if (this.user.role_id == 3) {
      this.router.navigateByUrl('/coach/dashboard');
    }

    this.sub.onUpdate = this.userService.onUpdate.subscribe((user) => {
      this.user = this.authService.getUserData();
    });

    this.detectScreenSize();
  }

  ngOnDestroy(): void {
    this.sub.onUpdate && this.sub.onUpdate.unsubscribe();

    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#sidebar-wrapper").toggleClass("toggled");
    });
  }

  logout() {
  	this.authService.logout();
  }

  openExerciceManagerModal() {
    let model: any = {
      movements: [],
      step: 1
    };

    const initialState = {
      model: model,
      workout: this.getWokout(),
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

  getExercice(withoutName?) {
    return {
      name: '',
      movements: []
    }
  }

  getWokout(day?) {
    day = day || {};
    return {
      day: day.day,
      date: day.date,
      month: day.month,
      year: day.year,
      program: {
        name: '',
        exercices: [
        ]
      }
    };
  }

  @HostListener("window:resize", [])
  private onResize() {
    // this.detectScreenSize();
  }

  ngAfterViewInit() {
    // this.detectScreenSize();
  }

  toogleLeftMenu() {
    this.showLeftMenu = !this.showLeftMenu;
    if (this.showRightMenu) {
      this.showRightMenu = false;
    }
  }

  toogleRightMenu() {
    this.showRightMenu = !this.showRightMenu;
    if (this.showLeftMenu) {
      this.showLeftMenu = false;
    }
  }

  hiddenMenu() {
    this.showRightMenu = false;
    this.showLeftMenu = false;
  }

  private detectScreenSize() {
    const currentSize = this._document.body.clientWidth;
    console.log('detectScreenSize');
    this.size = currentSize;
    this.resizeSvc.onResize(currentSize);
  }
}
