import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { DoorgetsTranslateService } from 'doorgets-ng-translate';
import { Observable } from 'rxjs/Observable';

import { webConfig } from '../../web-config';
import { FormCore } from '../../_/core/form.core';

import { RegisterService } from './register.service';
import { LoginService } from '../login/login.service';
import { AuthService } from 'src/app/_/services/http/auth.service';
import * as _ from "lodash";
import {UsersService} from "../../_/templates/users.service";
import { UserService } from 'src/app/_/services/model/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends FormCore implements OnInit {
  siteKey: string = '6LfTXvwUAAAAAE-jlWk3OAvIkAxucJ-neT4bCdYM';
  recaptcha: any;
  token: any;

  config = webConfig;

  baseColor = '#FFF';
  strength: number = 0;

  barLabel: string = "Password strength:";
  myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];

  currentLanguage: string;
  regexp = new RegExp(/([A-Z0-9._%+-]+@([A-Z0-9.-]+\.[A-Z]{2,4}))/i);

  signupForm: FormGroup;

  birthdayModel: NgbDateStruct = {
    day: 1,
    month: 1,
    year: 2002
  };

  model: any = {
    // lastname: 'Rquiba',
    // firstname: 'Mounir',
    // email: 'mounir.rquiba@gmail.com',
    // password: 'Mounir!123',
    data: {},
    role_id: 0,
    timezone: '+00:00',
    gender: 1,
    body_units: 1,
  };

  subjectRoles;
  roles: any[] = [];

  errors: any = {}
  errorsMessage: string = '';

  timezone: any[] = webConfig.timezone;
  configMrv: any = webConfig.mrv;

  sub: any = {};
  isDemoAccount: boolean = false;

  constructor(
    private router: Router,
    private usersService: UsersService,
    private userService: UserService,
    private authService: AuthService,
    private calendar: NgbCalendar,
    private toastrService: ToastrService,
    private signupService: RegisterService,
    private loginService: LoginService,
    private reCaptchaV3Service: ReCaptchaV3Service,
    private doorgetsTranslateService: DoorgetsTranslateService) {
    super();
  }

  ngOnInit() {
    this.currentLanguage = this.doorgetsTranslateService.getConfig().current

    if (this.signupService.isLogged()) {
      let user = this.authService.isCoach() ? this.authService.getUserData() : this.authService.getUserClientData();

      if( user.plan_id == 6 && user.onboarding !== undefined && user.onboarding.signup === true) {
        this.isDemoAccount = true;
      } else {
        this.isDemoAccount = false;
        this.router.navigateByUrl(this.signupService.getUserPath());
      }
    }

    // this.reCaptchaV3Service.execute(this.siteKey, 'homepage', (token) => {
    //   console.log('This is your token: ', token);
    //   this.token = token;
    // }, {
    //   useGlobalDomain: false
    // });
  }

  save() {
    this.startLoading();

    this.model.birthday = `${this.birthdayModel.year}-${this.birthdayModel.month}-${this.birthdayModel.day}`;

    if (this.isDemoAccount === false) {
      this.signupService.signup(this.model).subscribe((data: any) => {
        if (data.errors) {
          this.errors = data.errors;
          this.toastrService.error(data.message || 'An error has occurred');
        } else {
          if (data.user) {
            this.signupService.setUserToken(data.user.token);
            this.signupService.setUserRefreshToken(data.user.refresh_token);
            this.signupService.setUserType(data.user.role_id);
            this.loginService.setUserId(data.user_id);
          }

          this.router.navigateByUrl('/onboarding');
        }
      });
    } else {

      let user = this.authService.isCoach() ? this.authService.getUserData() : this.authService.getUserClientData();

      let data = {
        'user': user,
        'model': this.model
      };

      this.signupService.confirmSignupDemo(data).subscribe((data: any) => {

        if (data.errors) {
          this.errors = data.errors;
          this.toastrService.error(data.message || 'An error has occurred');
        } else {

          if (data.user) {

            localStorage.removeItem(this.config.prefixApp + 'athlet_id');
            localStorage.removeItem(this.config.prefixApp + 'user');
            localStorage.removeItem(this.config.prefixApp + 'user_client');

            this.signupService.setUserToken(data.user.token);
            this.signupService.setUserRefreshToken(data.user.refresh_token);
            this.signupService.setUserType(data.user.role_id);
            this.loginService.setUserId(data.user_id);
          }

          this.router.navigateByUrl(this.loginService.getUserPath());
        }
      });
    }
  }

  handleSuccessCaptcha(e) {
    console.log('handleSuccessCaptcha', e);
  }

  changeLanguage(lang) {
    if (this.currentLanguage !== lang) {
      this.doorgetsTranslateService.setCurrent(this.currentLanguage)
    }
  }

  strengthChanged(strength: number) {
    console.log('strength', strength);
    this.strength = strength;
  }
}
