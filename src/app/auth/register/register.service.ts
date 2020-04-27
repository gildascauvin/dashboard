import { Injectable } from '@angular/core';

import { AuthService } from '../../_/services/http/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private loginService: AuthService) {}

  isLogged() {
    return this.loginService.isLoggedIn();
  }

  signup(email, password) {
    return this.loginService
      .signup({
        username: email,
        password: password
      });
  }

  logout() {
    this.loginService.logout();
  }

  setUserToken(token) {
    this.loginService.setUserToken(token)
  }

  setUserRefreshToken(refreshToken) {
    this.loginService.setUserRefreshToken(refreshToken)
  }

  clear() {
    this.loginService.logout();
  }
}
