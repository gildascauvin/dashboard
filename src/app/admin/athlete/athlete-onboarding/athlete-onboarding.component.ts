import {Component, Inject, Input, OnInit,} from "@angular/core";
import { AthleteDashboardService } from '../athlete-dashboard/athlete-dashboard.service';
import {AuthService} from "../../../_/services/http/auth.service";
import {UsersService} from "../../../_/templates/users.service";
import * as _ from "lodash";
import { UserService } from 'src/app/_/services/model/user.service';
import {Router} from "@angular/router";
import {LoginService} from "../../../auth/login/login.service";
import {RegisterService} from "../../../auth/register/register.service";
import {ResizeService} from "../../../_/services/ui/resize-service.service";
import {DOCUMENT} from "@angular/common";
import {ToastrService} from "ngx-toastr";
import {webConfig} from "../../../web-config";

@Component({
  selector: "app-athlete-onboarding",
  templateUrl: "./athlete-onboarding.component.html",
  styleUrls: ["./athlete-onboarding.component.scss"],
})
export class AthleteOnboardingComponent implements OnInit {
  @Input() isFromUrl = true;
  @Input() hideCalendar = true;

  isLogged: boolean = false;
  config = webConfig;

  size: number = 768;
  responsiveSize: number = 768;

  onboardingStep: any = {
    'firstSession' : false,
    'energyScore' : false,
    'signup': false,
    'skip': false
  };

  errors: any = {}
  sub: any = {};
  user: any = [];
  coach: any = [];

  constructor(
    private router: Router,
    private loginService: LoginService,
    private usersService: UsersService,
    private userService: UserService,
    private authService: AuthService,
    private signupService: RegisterService,
    private athleteDashboardService: AthleteDashboardService,
    private resizeSvc: ResizeService,
    private toastrService: ToastrService,
    @Inject(DOCUMENT) private _document,
  ) {

  }

  ngOnInit(): void {
    this.detectScreenSize();

    if (this.signupService.isLogged() === false) {
      this.subscribeLater();
    } else {

      this.isFromUrl = this.authService.isAthlet();

      if (this.isFromUrl) {
        this.sub.userInfo = this.usersService.getUser().subscribe((user: any) => {
          this._initData(user);
          this._checkOnboardingStatus();
        });
      } else {

        this.sub.userInfo = this.usersService.getUser().subscribe((user: any) => {
          this._initCoachData(user);
          this.authService.setCurrentAthletId(this.coach.clients[0].client_id);

          this.sub.userClientInfo = this.usersService.getUserClient(this.coach.clients[0].client_id).subscribe((user: any) => {
            this._initData(user);
            this._checkOnboardingStatus();
          });
        });
      }
    }

    this.sub.onWorkoutUpdated = this.athleteDashboardService.onWorkoutUpdated.subscribe(() => {
          this.onboardingStep.firstSession = true;
          this.updateOnboarding();
      }
    );

    this.sub.onEnergyScoreUpdated = this.athleteDashboardService.onEnergyScoreUpdated.subscribe(() => {
        this.onboardingStep.energyScore = true;
        this.updateOnboarding();
      }
    );

    this.sub.onStartSessionEnded = this.athleteDashboardService.onStartSessionEnded.subscribe(() => {
      if (this.onboardingStep.firstSession === true && this.onboardingStep.energyScore === true) {
        this.skip();
      }
    });
  }

  private _checkOnboardingStatus() {
    if (this.user.onboarding) {
      this.onboardingStep = this.user.onboarding;
    }

    if(this.user.onboarding !== null && (
      (
        this.user.plan_id === 6 && this.user.onboarding.signup == true)
      || (this.user.plan_id !== 6 && this.user.onboarding.skip === true)
    )
    ) {
      this.router.navigateByUrl(this.signupService.getUserPath());
    }
  }

  ngOnDestroy() {
    this.sub.userInfo && this.sub.userInfo.unsubscribe();
    this.sub.userClientInfo && this.sub.userClientInfo.unsubscribe();
    this.sub.onWorkoutUpdated && this.sub.onWorkoutUpdated.unsubscribe();
    this.sub.onEnergyScoreUpdated && this.sub.onEnergyScoreUpdated.unsubscribe();
    this.sub.onStartSessionEnded && this.sub.onStartSessionEnded.unsubscribe();
  }

  updateOnboarding() {
    if (this.isFromUrl) {
      let model = {
        data: {},
        onboarding: this.onboardingStep
      };

      this.usersService.updateUser(model).subscribe((res) => {
        this._initUser();
      });
    } else {
      let model = {
        id: this.authService.getCurrentAthletId(),
        data: {},
        onboarding: this.onboardingStep
      };

      this.usersService.updateClientUser(model).subscribe((res) => {
        this._initUser();
      });
    }
  }

  skip() {
    if (this.user.plan_id == 6) {
      this.onboardingStep.signup = true;
    } else {
      this.onboardingStep.skip = true;
    }

    this.updateOnboarding();
  }

  private _initUser() {
    this.sub.userInfo && this.sub.userInfo.unsubscribe();

    if (this.isFromUrl) {
      this.sub.userInfo = this.usersService.getUser().subscribe((user: any) => {
        this._initData(user);
      });
    } else {
      let userClientId = this.authService.getCurrentAthletId();

      this.sub.userInfo = this.usersService.getUserClient(userClientId).subscribe((user: any) => {
        this._initData(user);
      });
    }
  }

  private subscribeLater() {

    this.signupService.signupDemo().subscribe((data: any) => {
      if (data.errors) {
        this.errors = data.errors;
        this.toastrService.error(data.message || 'An error has occurred');
      } else {
        if (data.user) {
          this.signupService.setUserToken(data.user.token);
          this.signupService.setUserRefreshToken(data.user.refresh_token);
          this.signupService.setUserType(data.user.role_id);
          this.loginService.setUserId(data.user_id);
          this.isFromUrl = this.signupService.isAthlet();
          this._initUser();
        }
      }
    });
  }

  private _initData(user) {
    if (user && user.data) {
      this.user = _.cloneDeep(user);

      if (this.isFromUrl) {
        this.userService.initUserInfos(user);
      } else {
        this.userService.initUserClientInfos(user);
      }

      this.onboardingStep = this.user.onboarding;
      this.isLogged = true;

      if (this.onboardingStep.signup == true) {
        this.router.navigateByUrl(this.loginService.getUserPath());
      } else if (this.onboardingStep.skip == true) {
        this.authService.setCurrentAthletId(0);
        this.authService.setCurrentAthlet({});
        this.router.navigateByUrl(this.loginService.getUserPath());
      }
    }
  }

  private _initCoachData(user) {
    if (user && user.data) {
      this.coach = _.cloneDeep(user);
    }
  }

  private detectScreenSize() {
    const currentSize = this._document.body.clientWidth;
    this.size = currentSize;
    this.resizeSvc.onResize(currentSize);
  }
}
