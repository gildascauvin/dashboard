import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmAccountService } from './confirm-account.service';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.scss']
})
export class ConfirmAccountComponent implements OnInit {
	isValid: boolean = false;
	isLoading: boolean = true;
	sub: any = {};

	token: string = '';
	email: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private confirmAccountService: ConfirmAccountService,
  	) { }

  ngOnInit(): void {
  	this.sub.route = this.route.params.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];

      this.sub.check = this.confirmAccountService.check(this.token, this.email).subscribe((res: any) => {
    		this.isValid = !(res && res.error);
				this.isLoading = false;

				let timer = setTimeout(() => {
					this.router.navigateByUrl('/')
					clearTimeout(timer);
				}, 3000)
      });
    });
  }

  ngOnDestroy(): void {
  	this.sub.route && this.sub.route.unsubscribe();
  	this.sub.check && this.sub.check.unsubscribe();
  }

}
