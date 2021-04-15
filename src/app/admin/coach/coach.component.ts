import { Component, OnInit, Inject, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { DOCUMENT } from '@angular/common';
import { delay } from 'rxjs/operators';
import * as $ from 'jquery';
import * as _ from 'lodash';

import { AuthService } from '../../_/services/http/auth.service';
import { UserService } from '../../_/services/model/user.service';
import { ResizeService } from '../../_/services/ui/resize-service.service';

import { TemplatesModalExerciceManagerComponent } from '../../_/templates/templates-modal/templates-modal-exercice-manager/templates-modal-exercice-manager.component';
import { UsersModalChooseAthletComponent } from './coach-clients/coach-clients-modal/users-modal-choose-athlet/users-modal-choose-athlet.component';
import {CoachDashboardMenuService} from "./coach-dashboard/coach-dashboard-menu/coach-dashboard-menu.service";

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.scss']
})
export class CoachComponent implements OnInit {
  bsModalRef: BsModalRef;

  user: any = {
    data: {},
    role: {},
    clients: []
  };

  clients: any = [];

  currentUser: any = {};
  currentUserId: any = 0;

  isSelected: boolean = false;

  sub: any = {};

  size: number = 1;
  responsiveSize: number = 768;

  showLeftMenu: boolean = false;
  showRightMenu: boolean = false;

  constructor(
    private _cdr: ChangeDetectorRef,
    private authService: AuthService,
    private userService: UserService,
    private modalService: BsModalService,
    private resizeSvc: ResizeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private elementRef: ElementRef,
    private coachDashboardMenuService: CoachDashboardMenuService,
    @Inject(DOCUMENT) private _document) { }

  ngOnInit(): void {
    this._document.body.style.background = '#FFF';

    this.user = this.authService.getUserData();

    if (this.user.role_id == 1) {
      this.router.navigateByUrl('/athlete/dashboard');
    }

    this.currentUser = this.authService.getCurrentAthlet() || {};
    this.currentUserId = this.authService.getCurrentAthletId() || 0;

    this.sub.onUpdate = this.userService.onUpdate.subscribe((user) => {
      this.currentUser = this.authService.getCurrentAthlet();
      this.user = this.authService.getUserData();

      if (this.user.role_id == 1) {
        this.router.navigateByUrl('/athlete/dashboard');
      }
    });

    this.detectScreenSize();

    this.isSelected = false;
    let paths = this.router.url.split('/');

    if (paths.length >= 4 && paths[2] !== 'settings' && paths[2] !== 'programs' && paths[2] !== 'dashboard') {
      this.isSelected = true;
    }

    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          this.isSelected = false;
          this.currentUser = {};
          this.currentUserId = 0;

          let paths = this.router.url.split('/');
          if (paths.length >= 4 && paths[2] !== 'settings' && paths[2] !== 'programs' && paths[2] !== 'dashboard') {
            this.isSelected = true;
            this.currentUser = this.authService.getCurrentAthlet() || {};
            this.currentUserId = this.authService.getCurrentAthletId() || 0;
          }
        }
      }
    );
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
      userId: this.currentUserId,
      isFromUrl: false,
      // model: _.cloneDeep(model),
    };

    this.bsModalRef = this.modalService.show(TemplatesModalExerciceManagerComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-lg'
    });
  }

  openClientManagerModal() {
    const initialState = {
      user: this.user,
      currentUser: this.currentUser,
    };

    this.bsModalRef = this.modalService.show(UsersModalChooseAthletComponent, {
      keyboard: false,
      initialState: initialState,
      class: 'modal-sm'
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

  onChangeUser(userId) {
    this.currentUserId = userId && parseInt('' + userId) || 0;
    this.authService.setCurrentAthletId(this.currentUserId);

    if (this.currentUserId) {
      this.router.navigateByUrl("/coach/athlet/dashboard", { skipLocationChange: true });
    } else {
      this.router.navigateByUrl("/coach/dashboard", { skipLocationChange: true });
    }
  }

  setActiveTab(tab) {
    console.log('emit from team menu nav');
    this.coachDashboardMenuService.onTabChanged.emit(tab);
  }

  // private _initClient(isInit?) {
  //   this.user = this.authService.getUserData() || {
  //     data: {},
  //     role: {},
  //     clients: []
  //   };
  //   console.log('this.user', this.user.clients);

  //   // if (!isInit) {
  //   this.clients = _.cloneDeep(this.user.clients) || [];
  //   // }
  //   console.log('this.clients', this.clients);

  //   this.clients = this.clients.filter((client) => {
  //     return client.profile;
  //   });

  //   console.log('this.clients', this.clients);
  //   this._cdr.detectChanges();

  //   // this.currentUserId = parseInt('' + this.authService.getCurrentAthletId());

  // }

  private detectScreenSize() {
    const currentSize = this._document.body.clientWidth;

    this.size = currentSize;
    this.resizeSvc.onResize(currentSize);
  }
}
