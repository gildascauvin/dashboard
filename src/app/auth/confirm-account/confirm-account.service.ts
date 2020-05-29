import { Injectable } from '@angular/core';

import { AuthService } from '../../_/services/http/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConfirmAccountService {

	constructor(
		private authService: AuthService,
	){}

	check(token, email) {
		return this.authService.confirmAccount(token, email);
	}
}
