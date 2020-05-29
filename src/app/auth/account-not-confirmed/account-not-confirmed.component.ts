import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountNotConfirmedService } from './account-not-confirmed.service';
import { FormCore } from '../../_/core/form.core';

@Component({
  selector: 'app-account-not-confirmed',
  templateUrl: './account-not-confirmed.component.html',
  styleUrls: ['./account-not-confirmed.component.scss']
})
export class AccountNotConfirmedComponent extends FormCore implements OnInit {
	email: string = '';

	isSent: boolean = false;
	sub: any = {};

  errors: any = {}
  errorsMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  	private toastrService: ToastrService,
  	private AccountNotConfirmedService: AccountNotConfirmedService) {
  	super();
  }

  ngOnInit(): void {
  	this.sub.route = this.route.params.subscribe(params => {
      this.email = params['email'];
    });
  }

  check() {
  	if (this.email) {
  		this.startLoading();

	  	this.sub.passwordForgot = this.AccountNotConfirmedService.check(this.email).subscribe((data: any) => {
	  		console.log('data', data);
	  		if (data.error) {
	        this.errorsMessage = data.error;
	        this.toastrService.error(this.errorsMessage || 'An error has occurred');


	        if (data.code === 2) {
	        	this.router.navigateByUrl('/');
	        }
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
