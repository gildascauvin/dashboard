import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private _document ) { }

  ngOnInit(): void {
  	this._document.body.style.background = '#000000';
  }

}
