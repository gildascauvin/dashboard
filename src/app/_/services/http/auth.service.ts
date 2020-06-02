import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest } from '@angular/common/http';

import { HttpService } from './http.service'
import { UserService } from '../model/user.service'

import { webConfig } from '../../../web-config';

let config = webConfig;

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

  confirmAccount(token, email) {
    return this.httpService.confirmAccount(token, email);
  }

  forgotPassword(email) {
    return this.httpService.forgotPassword(email);
  }

  resetPassword(token, email, password) {
    return this.httpService.resetPassword(token, email, password);
  }

  accountNotConfirmed(email) {
    return this.httpService.accountNotConfirmed(email);
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

  getUserData() {
    let user: string = localStorage.getItem(webConfig.prefixApp + 'user');
    return  !!user ? JSON.parse(user) : {
      data: {},
      role: {}
    };
  }

  getUserInfos(relaod?) {
    return this.userService.getUserInfos(relaod);
  }

  setUserType(typeId) {
    localStorage.setItem(config.prefixApp + 'user_type', typeId);
  }

  setUserId(userId) {
    localStorage.setItem(config.prefixApp + 'user_id', userId);
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
    localStorage.removeItem(config.prefixApp + 'user_id');
    localStorage.removeItem(config.prefixApp + 'type_id');
    localStorage.removeItem(config.prefixApp + 'refresh_token');

    this.router.navigateByUrl(redirectTo);
  }

  setUserToken(token) {
    if (token) {
      localStorage.setItem(config.prefixApp + 'token', token);
      this._initUserFromToken();
    }
  }

  setUserRefreshToken(refreshToken) {
    refreshToken && localStorage.setItem(config.prefixApp + 'refresh_token', refreshToken);
  }

  resetUserProfile() {
    let token = localStorage.getItem(config.prefixApp + 'token');

    // this._initUserFromToken(token)
  }

  private _initUserFromToken() {
    this.httpService
      .get('user').subscribe((userInfos) => {
        this.userService.initUserInfos(userInfos);
      });
  }
}
