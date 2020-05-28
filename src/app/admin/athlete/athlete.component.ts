import { Component, OnInit, Inject } from '@angular/core';

import { DOCUMENT } from '@angular/common';
import { AuthService } from '../../_/services/http/auth.service';

@Component({
  selector: 'app-athlete',
  templateUrl: './athlete.component.html',
  styleUrls: ['./athlete.component.scss']
})
export class AthleteComponent implements OnInit {

  constructor(
  	private authService: AuthService,
  	@Inject(DOCUMENT) private _document) { }

  ngOnInit(): void {
    this._document.body.style.background = '#FFF';
  }

  logout() {
  	this.authService.logout();
  }
}
