import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { PasswordForgotService } from './password-forgot.service';
import { FormCore } from '../../_/core/form.core';

@Component({
  selector: 'app-password-forgot',
  templateUrl: './password-forgot.component.html',
  styleUrls: ['./password-forgot.component.scss']
})
export class PasswordForgotComponent extends FormCore implements OnInit {

	email: string = '';

	isSent: boolean = false;
	sub: any = {};

  errors: any = {}
  errorsMessage: string = '';

  constructor(
  	private toastrService: ToastrService,
  	private passwordForgotService: PasswordForgotService) {
  	super();
  }

  ngOnInit(): void {
  }

  check() {
  	if (this.email) {
  		this.startLoading();

	  	this.sub.passwordForgot = this.passwordForgotService.check(this.email).subscribe((data: any) => {
	  		console.log('data', data);
	  		if (data.errors) {
	        this.errors = data.errors;
	        this.toastrService.error(data.message || 'An error has occurred');
	      } else {
	      	this.isSent = true;
	      }
	  	});
  	}
  }

  ngOnDestroy(): void {
  	this.sub.passwordForgot && this.sub.passwordForgot.unsubscribe();
  }

}
