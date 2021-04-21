import {Component, Input, OnInit} from '@angular/core';
import {webConfig} from "../../../../web-config";
import {AuthService} from "../../../../_/services/http/auth.service";
import {UserService} from "../../../../_/services/model/user.service";

@Component({
  selector: 'app-athlete-settings-plan',
  templateUrl: './athlete-settings-plan.component.html',
  styleUrls: ['./athlete-settings-plan.component.scss']
})
export class AthleteSettingsPlanComponent implements OnInit {
  @Input() isFromUrl = true;

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
    this.user = this.authService.getUserClientData();

    this.sub.onUpdate = this.userService.onUpdate.subscribe((user) => {
      this.user = this.authService.getUserClientData();
    });
  }

  ngOnDestroy(): void {
    this.sub.onUpdate && this.sub.onUpdate.unsubscribe();
  }
}
