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

  signup(model) {
    return this.loginService
      .signup(model);
  }

  confirmSignupDemo(data) {
    return this.loginService.confirmSignupDemo(data);
  }

  signupDemo() {
    return this.loginService
      .signupDemo();
  }

  isAthlet() {
    return this.loginService.isAthlet();
  }

  isCoach() {
    return this.loginService.isCoach();
  }

  setUserType(typeId) {
    this.loginService.setUserType(typeId);
  }

  getUserPath() {
    return this.loginService.getUserPath();
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
