import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { RegisterService } from './register.service';
import { FormCore } from '../../_/core/form.core';

import { DoorgetsTranslateService } from 'doorgets-ng-translate';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends FormCore implements OnInit {

  currentLanguage: string;
  regexp = new RegExp(/([A-Z0-9._%+-]+@([A-Z0-9.-]+\.[A-Z]{2,4}))/i);

  signupForm: FormGroup;

  constructor(
    private router: Router,
    private signupService: RegisterService,
    private doorgetsTranslateService: DoorgetsTranslateService) {
    super();
  }

  ngOnInit() {
    this.currentLanguage = this.doorgetsTranslateService.getConfig().current

    if (this.signupService.isLogged()) {
      this.router.navigateByUrl('/account');
    }

    this._initForm();
  }

  submitSignup() {
    this.isLoading = true;

    this.signupForm.controls.email.markAsTouched();
    this.signupForm.controls.password.markAsTouched();

    if (this.signupForm.invalid) {
      return this.isLoading = false;
    }

    this.signupService
      .signup(this.signupForm.controls.email.value, this.signupForm.controls.password.value)
      .subscribe((response: any)=> {
          this.signupService.setUserToken(response.token);
          this.signupService.setUserRefreshToken(response.refresh_token);
          this.router.navigateByUrl('/account');
          this.isLoading = false;
        }, (error) => {
          this._setErrors(error);
          this.isLoading = false;
        });

      return false;
  }

  changeLanguage(lang) {
    if (this.currentLanguage !== lang) {
      this.doorgetsTranslateService.setCurrent(this.currentLanguage)
    }
  }

  private _setErrors(error) {
    console.log('error', error);
    if (error && error.code === 401) {
      this._initForm();

      this.signupService.clear();

      this.errorMessage = 'Invalid credential, please try again.';
      this.showErrorMessage();
    }
  }

  private _initForm() {
    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }
}
