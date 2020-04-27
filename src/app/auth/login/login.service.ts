import { Injectable } from '@angular/core';

import { AuthService } from '../../_/services/http/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private loginService: AuthService) {}

  isLogged() {
    return this.loginService.isLoggedIn();
  }

  login(email, password) {
    return this.loginService
      .login(email, password);
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
