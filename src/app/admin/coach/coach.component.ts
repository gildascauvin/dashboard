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

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.scss']
})
export class CoachComponent implements OnInit {
  bsModalRef: BsModalRef;

  user: any = {
    data: {},
    role: {}
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
    @Inject(DOCUMENT) private _document) { }

  ngOnInit(): void {

    this._document.body.style.background = '#FFF';

    this.user = this.authService.getUserData();

    this.currentUserId = this.authService.getCurrentAthletId() || 0;

    this._initClient();

    this.sub.onUpdate = this.userService.onUpdate.subscribe((user) => {
      // console.log('this.authService.getUserData()', this.authService.getUserData())
      this.user = this.authService.getUserData();

      // this._initClient();
    });

    this.detectScreenSize();

    this.isSelected = false;
    let paths = this.router.url.split('/');
    console.log('paths', paths[2]);
    if (paths.length === 4 && paths[2] !== 'settings' && paths[2] !== 'programs') {
      this.isSelected = true;
    }

    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          this.isSelected = false;
          this.currentUserId = 0;

          let paths = this.router.url.split('/');
          if (paths.length === 4 && paths[2] !== 'settings' && paths[2] !== 'programs') {
            this.isSelected = true;
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

  private _initClient() {
    this.clients = this.user.clients && _.cloneDeep(this.user.clients) || [];

    this.clients = this.clients.filter((client) => {
      return client.profile;
    });

    // this.currentUserId = parseInt('' + this.authService.getCurrentAthletId());

    this._cdr.detectChanges();
  }

  private detectScreenSize() {
    const currentSize = this._document.body.clientWidth;

    this.size = currentSize;
    this.resizeSvc.onResize(currentSize);
  }
}
