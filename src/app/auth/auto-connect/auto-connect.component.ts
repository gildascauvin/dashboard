import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { RegisterService } from '../register/register.service';
import { UserService } from '../../_/services/model/user.service';
import { AuthService } from '../../_/services/http/auth.service';

@Component({
  selector: 'app-auto-connect',
  templateUrl: './auto-connect.component.html',
  styleUrls: ['./auto-connect.component.scss']
})
export class AutoConnectComponent implements OnInit {

	token: string = '';
	sub: any = {};

  constructor(
    private router: Router,
    private signupService: RegisterService,
    private userService: UserService,
    private authService: AuthService,
    private loginService: LoginService,
  	private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.authService.logout('', true);

  	this.sub.route = this.route.params.subscribe(params => {
      this.token = params['token'];

      this.loginService.setUserToken(this.token);

      this.userService.getUserInfos(true);

      let timer = setTimeout(() => {
        this.router.navigateByUrl(this.loginService.getUserPath());
        clearTimeout(timer);
      }, 1000);
    });
  }

  ngOnDestroy(): void {
  	this.sub.route && this.sub.route.unsubscribe();
  }
}
