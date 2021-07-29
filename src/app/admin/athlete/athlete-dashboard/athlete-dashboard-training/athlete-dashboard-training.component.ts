import {Component, Input, OnInit,} from "@angular/core";
import {UsersService} from "../../../../_/templates/users.service";
import {AuthService} from "../../../../_/services/http/auth.service";
import {UserService} from "../../../../_/services/model/user.service";

@Component({
  selector: "app-athlete-dashboard-training",
  templateUrl: "./athlete-dashboard-training.component.html",
  styleUrls: ["./athlete-dashboard-training.component.scss"],
})
export class AthleteDashboardTrainingComponent implements OnInit {
  @Input() isFromUrl = true;
  activeTab : any = 'training';

  sub: any = {};

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {

    if (!this.isFromUrl) {
      this.userService.getUserInfos(true);
    }
  }
}
