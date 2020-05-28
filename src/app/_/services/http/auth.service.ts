import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest } from '@angular/common/http';

import { HttpService } from './http.service'
import { UserService } from '../model/user.service'

import { webConfig } from '../../../web-config';

let config = {
  baseApi: webConfig.baseApi + 'api/',
  prefixApp: 'dg_'
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  cachedRequests: Array<HttpRequest<any>> = [];

  baseAuth: string = config.baseApi;

  constructor(private httpService: HttpService, private router: Router, private userService: UserService) { }

  collectFailedRequest(request): void {
    this.cachedRequests.push(request);
  }

  retryFailedRequests(): void {
    // retry the requests. this method can
    // be called after the token is refreshed
  }

  auth(data) {
    return this.httpService.auth(data);
  }

  login(email, password) {
    return this.auth({
      // "grant_type": "password",
      // "client_id": config.prefixApp + "web_app",
      "username": email,
      "password": password
    });
  }

  signup(data) {
    return this.httpService.signup(data);
  }

  refreshToken() {
    return this.httpService.refreshToken();
  }

  isLoggedIn() {
    let token: string = localStorage.getItem(config.prefixApp + 'token');
    return !!token;
  }

  isAthlet() {
    return localStorage.getItem(config.prefixApp + 'user_type') == '1';
  }

  isCoach() {
    return localStorage.getItem(config.prefixApp + 'user_type') == '3';
  }

  setUserType(typeId) {
    localStorage.setItem(config.prefixApp + 'user_type', typeId);
  }

  getUserPath() {
    return this.isAthlet() ? '/athlete/dashboard' : this.isCoach() ? '/coach/dashboard' : '';
  }

  checkForgotPassword(email) {
    return this.httpService.checkForgotPassword(email);
  }

  checkResetPassword(password, token) {
    return this.httpService.checkResetPassword(password, token);
  }

  logout(redirectTo?) {
    redirectTo = redirectTo || '/';

    localStorage.removeItem(config.prefixApp + 'token');
    localStorage.removeItem(config.prefixApp + 'user');

    this.router.navigateByUrl(redirectTo);
  }

  setUserToken(token) {
    token && localStorage.setItem(config.prefixApp + 'token', token);
  }

  setUserRefreshToken(refreshToken) {
    refreshToken && localStorage.setItem(config.prefixApp + 'refresh_token', refreshToken);
  }

  resetUserProfile() {
    let token = localStorage.getItem(config.prefixApp + 'token');

    // this._initUserFromToken(token)
  }

  private _initUserFromToken(token) {
    this.httpService
      .get('user').subscribe((userInfos) => {
        this.userService.initUserInfos(userInfos);
      });
  }
}
