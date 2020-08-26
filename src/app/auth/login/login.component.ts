import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from './login.service';
import { FormCore } from '../../_/core/form.core';

import { DoorgetsTranslateService } from 'doorgets-ng-translate';
import { Observable } from 'rxjs/Observable';

import { LocalStorageService } from '../../_/services/local-storage.service';

@Component({
  selector: 'dg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends FormCore implements OnInit {

  currentLanguage: string;
  regexp = new RegExp(/([A-Z0-9._%+-]+@([A-Z0-9.-]+\.[A-Z]{2,4}))/i);

  loginForm: FormGroup;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private localStorageService: LocalStorageService,
    private doorgetsTranslateService: DoorgetsTranslateService) {
    super();
  }

  ngOnInit() {
    this.currentLanguage = this.doorgetsTranslateService.getConfig().current

    if (this.loginService.isLogged()) {
      this.router.navigateByUrl(this.loginService.getUserPath());
    }

    this._initForm();
  }

  submitLogin() {
    this.startLoading();

    this.loginForm.controls.email.markAsTouched();
    this.loginForm.controls.password.markAsTouched();

    if (this.loginForm.invalid) {
      console.log('Invalid form')
      return;
    }

    this.loginService
      .login(this.loginForm.controls.email.value, this.loginForm.controls.password.value)
      .subscribe((response: any)=> {
          if (response.status == 2) {
            this.loginService.setUserToken(response.token);
            this.loginService.setUserRefreshToken(response.refresh_token);
            this.loginService.setUserType(response.role_id);
            this.loginService.setUserId(response.user_id);

            let timer = setTimeout(() => {
              this.router.navigateByUrl(this.loginService.getUserPath());
              clearTimeout(timer);
            }, 1000);
          }

          if (response.status == 1) {
            this.router.navigateByUrl('/account-not-confirmed/' + response.email)
          }

        }, (error) => {
          this.setErrors(error);
          this.loginService.clear();
        });

      return false;
  }

  changeLanguage(lang) {
    if (this.currentLanguage !== lang) {
      this.doorgetsTranslateService.setCurrent(this.currentLanguage)
    }
  }

  setErrors(error) {
    console.log('error', error);
    if (error && error.code === 401) {
      this._initForm();

      this.loginService.clear();

      this.errorMessage = 'Invalid credential, please try again.';
      this.showErrorMessage();
    }
  }

  private _initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }
}
