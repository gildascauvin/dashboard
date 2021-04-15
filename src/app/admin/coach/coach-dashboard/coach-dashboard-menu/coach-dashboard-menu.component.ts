import {Component, Input, OnInit,} from "@angular/core";
import {UsersModalInvitationCreateComponent} from "../../coach-clients/coach-clients-modal/users-modal-invitation-create/users-modal-invitation-create.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CoachDashboardMenuService} from "./coach-dashboard-menu.service";

@Component({
  selector: "app-coach-dashboard-menu",
  templateUrl: "./coach-dashboard-menu.component.html",
  styleUrls: ["./coach-dashboard-menu.component.scss"],
})
export class CoachDashboardMenuComponent implements OnInit {
  @Input() isFromUrl = true;
  @Input() activeTab = 'planning';

  bsModalRef: BsModalRef;
  user: any = {};

  links : any = {
    planning: ['/coach', 'dashboard'],
    performance: ['/coach', 'dashboard', 'performance']
  };

  constructor(
    private modalService: BsModalService,
    private coachDashboardMenuService: CoachDashboardMenuService
  ) {

  }

  ngOnInit(): void {
    if (this.isFromUrl === false) {
      this.links = {
        planning: ['/athlete', 'team'],
        performance: ['/athlete', 'performance']
      };
    }
  }
  ngOnDestroy(): void {}

  setActiveTab(tab) {
    this.activeTab = tab;
    this.coachDashboardMenuService.onTabChanged.emit(tab);
  }

  openInvitationCreateModal() {
    const initialState = {
      modelId: this.user.id,
    };

    this.bsModalRef = this.modalService.show(
      UsersModalInvitationCreateComponent,
      {
        keyboard: false,
        initialState: initialState,
        class: "modal-xs",
      }
    );
  }
}
