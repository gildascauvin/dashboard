import {Component, OnInit} from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

import {UsersService} from '../../../../../_/templates/users.service';
import {AuthService} from '../../../../../_/services/http/auth.service';
import {UserService} from '../../../../../_/services/model/user.service';

@Component({
  selector: 'app-users-modal-choose-athlet',
  templateUrl: './users-modal-choose-athlet.component.html',
  styleUrls: ['./users-modal-choose-athlet.component.scss']
})
export class UsersModalChooseAthletComponent implements OnInit {
  isLoading: boolean = false;

  currentUser: any = {};

  user: any = {
    clients: []
  };

  constructor(
    public bsModalRef: BsModalRef,
    private router: Router,
    private userService: UserService,
    private usersService: UsersService,
    private authService: AuthService) {
  }

  ngOnInit() {
  }

  cancel() {
    this.user = {
      clients: []
    };

    this.bsModalRef.hide();
  }

  setCurrentAthletId(clientId) {
    this.authService.setCurrentAthletId(clientId);

    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate(['/coach/athlet/dashboard'])
    );

    this.userService.getUserInfos(true);
    this.cancel();
  }
}
