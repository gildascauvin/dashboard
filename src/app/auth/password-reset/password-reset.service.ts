import { Injectable } from '@angular/core';

import { AuthService } from '../../_/services/http/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

	constructor(
		private authService: AuthService,
	){}

	check(token, email, password) {
		return this.authService.resetPassword(token, email, password);
	}
}
