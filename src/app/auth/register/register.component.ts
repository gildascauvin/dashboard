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

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends FormCore implements OnInit {
  siteKey: string = '6LfTXvwUAAAAAE-jlWk3OAvIkAxucJ-neT4bCdYM';
  recaptcha: any;
  token: any;

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

  constructor(
    private router: Router,
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
      this.router.navigateByUrl(this.signupService.getUserPath());
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

    this.signupService.signup(this.model).subscribe((data: any) => {
      if (data.errors) {
        this.errors = data.errors;
        this.toastrService.error(data.message || 'An error has occurred');
      } else {
        this.signupService.setUserToken(data.token);
        this.signupService.setUserRefreshToken(data.refresh_token);
        this.signupService.setUserType(this.model.role_id);

        this.router.navigateByUrl(this.loginService.getUserPath());
      }
    });
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
