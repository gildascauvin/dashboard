import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../../_/services/http/auth.service";
import {webConfig} from "../../../../web-config";
import {UserService} from "../../../../_/services/model/user.service";

@Component({
  selector: 'app-coach-settings-plan',
  templateUrl: './coach-settings-plan.component.html',
  styleUrls: ['./coach-settings-plan.component.scss']
})
export class CoachSettingsPlanComponent implements OnInit {
  configPlans: any = webConfig.plans;

  sub: any = {};

  isLoading: boolean  = false;

  user: any = {
    data: {},
    profil: []
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUserData();

    this.sub.onUpdate = this.userService.onUpdate.subscribe((user) => {
      this.user = this.authService.getUserData();
    });
  }

  ngOnDestroy(): void {
    this.sub.onUpdate && this.sub.onUpdate.unsubscribe();
  }
}
