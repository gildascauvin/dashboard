import { Component } from '@angular/core';
import { DoorgetsTranslateService } from 'doorgets-ng-translate';
import {LoginService} from "./auth/login/login.service";
import {AuthService} from "./_/services/http/auth.service";
import {Router} from "@angular/router";

declare let pendo: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private router: Router,
    private doorgetsTranslateService: DoorgetsTranslateService,
    private loginService: LoginService,
    private authService: AuthService) {}

  ngOnInit() {
    this.doorgetsTranslateService.init({
      languages: ['en', 'fr'],
      current: 'en',
      default: 'en'
    });

    if (this.loginService.isLogged()) {

      let user = this.authService.isCoach() ? this.authService.getUserData() : this.authService.getUserClientData();

      let coachId = user.id;
      let coachEmail = user.username;

      if (this.authService.isAthlet()) {
        if (user.coachs && user.coachs[0]) {
          coachId = user.coachs[0].user_id;
          coachEmail = user.coachs[0].coach.username;
        }
      }

      pendo.initialize({
        visitor: {
          id: 'visitor_' + user.id,
          role: this.authService.isCoach() ? 'coach' : 'athlete',
          registered_at: user.registered_at
        },
        account: {
          id: coachId,
          email: coachEmail
        }
      });

      if(user.onboarding !== null && user.onboarding.signup == false && user.onboarding.skip === false) {
        this.router.navigateByUrl('/onboarding');
      }
    }
  }
}

