import { Component, OnInit } from '@angular/core';
import { FormCore } from '../../_/core/form.core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { LoginService } from '../login/login.service';

import { PasswordResetService } from './password-reset.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent extends FormCore implements OnInit {
	model: any = {
		password: '',
		passwordConfirmation: '',
	}

	token: string = '';
	email: string = '';

	sub: any = {};

	isSent: boolean = false;
	errors: any = {}
  errorsMessage: string = '';

  constructor(
  	private router: Router,
    private loginService: LoginService,
  	private toastrService: ToastrService,
  	private passwordResetService: PasswordResetService,
    private route: ActivatedRoute,) {
  	super();
  }

  ngOnInit(): void {
  	this.sub.route = this.route.params.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });
  }

  check() {
  	if (this.email) {
  		this.startLoading();

	  	this.sub.passwordReset = this.passwordResetService.check(this.token, this.email, this.model.password).subscribe((data: any) => {
	  		console.log('data', data);
	  		if (data.error) {
	        this.toastrService.error(data.error || 'An error has occurred');

	        this.model = {
						password: '',
						passwordConfirmation: '',
					}
	      } else {
	      	this.isSent = true;
	      	this.connect();
	      }
	  	});
  	}
  }

  connect() {
  	this.loginService
      .login(this.email, this.model.password)
      .subscribe((response: any)=> {
          this.loginService.setUserToken(response.token);
          this.loginService.setUserRefreshToken(response.refresh_token);
          this.loginService.setUserType(response.role_id);

          this.router.navigateByUrl(this.loginService.getUserPath());
        }, (error) => {
          this.loginService.clear();
        });
  }

  ngOnDestroy(): void {
  	this.sub.route && this.sub.route.unsubscribe();
  	this.sub.passwordReset && this.sub.passwordReset.unsubscribe();
  }

}
