import { Injectable } from '@angular/core';

import { AuthService } from '../../_/services/http/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountNotConfirmedService {

	constructor(
		private authService: AuthService,
	){

	}

	check(email) {
		return this.authService.accountNotConfirmed(email);
	}
}
