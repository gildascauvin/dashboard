import { Component, OnInit, Inject } from '@angular/core';

import { DOCUMENT } from '@angular/common';
import { AuthService } from '../../_/services/http/auth.service';
import { UserService } from '../../_/services/model/user.service';

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.scss']
})
export class CoachComponent implements OnInit {
  user: any = {
    data: {},
    role: {}
  };

  constructor(
  	private authService: AuthService,
    private userService: UserService,
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
}
