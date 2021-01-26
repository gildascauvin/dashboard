import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login/login.service';

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
    private loginService: LoginService,
  	private route: ActivatedRoute,) { }

  ngOnInit(): void {
  	this.sub.route = this.route.params.subscribe(params => {
      this.token = params['token'];

      this.loginService.setUserToken(this.token);

      this.router.navigateByUrl('/');
    });
  }

  ngOnDestroy(): void {
  	this.sub.route && this.sub.route.unsubscribe();
  }
}
