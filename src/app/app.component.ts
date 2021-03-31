import { Component } from '@angular/core';
import { DoorgetsTranslateService } from 'doorgets-ng-translate';
import {LoginService} from "./auth/login/login.service";
import {AuthService} from "./_/services/http/auth.service";

declare let pendo: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private doorgetsTranslateService: DoorgetsTranslateService,
    private loginService: LoginService,
    private authService: AuthService) {}

  ngOnInit() {
    this.doorgetsTranslateService.init({
      languages: ['en', 'fr'],
      current: 'fr',
      default: 'fr'
    });

    if (this.loginService.isLogged()) {

      let user = this.authService.isCoach() ? this.authService.getUserClientData() : this.authService.getUserData();

      pendo.initialize({
        visitor: {
          id: 'visitor_' + user.id
        },
        account: {
          id: user.id,
          email: user.username
        }
      });

    }
  }
}

