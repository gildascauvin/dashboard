import { Injectable } from '@angular/core';
import { Http, Headers, Response  } from '@angular/http';
import { HttpClient  } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


import { webConfig } from '../../../web-config';

let config = webConfig;

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  baseApi: string = config.baseApi + '';

  baseAuth: string = config.base + 'login_check';
  baseSingup: string = config.base + 'register';
  baseRefreshToken: string = config.base + 'token-refresh';

  baseForgotPassword: string = config.baseApi;
  baseResetPassword: string = config.baseApi;

  private _hasHeaders: boolean = false;

  token: any;

  public headers: Headers;

  constructor (private http: HttpClient) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  get(path) {
    return this.http.get(this.baseApi + path)
      .map(this.extractData);
  }

  post(path, data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8');

    return this.http.post(this.baseApi + path, data);
  }

  put(path, data) {
    return this.http.put(this.baseApi + path, data);
  }

  patch(path, data) {
    return this.http.patch(this.baseApi + path, data);
  }

  delete(path) {
    return this.http.delete(this.baseApi + path);
  }

  auth(data) {
    console.log('data', data);
    return this.http.post(this.baseAuth, data);
  }

  signup(data) {
    return this.http.post(this.baseSingup, data);
  }

  refreshToken() {
    let refreshToken = localStorage.getItem('dg_refresh_token');
    console.log('refreshToken', refreshToken);
    if (!refreshToken) {
      return Observable.of([]);
    }

    let data = {
      refresh_token: refreshToken
    };

    return this.http.post(this.baseRefreshToken, data);
  }

  checkForgotPassword(email) {
    let data = {
      attributes: {
        email: email
      }
    };

    return this.http.post(this.baseForgotPassword, data);
  }

  checkResetPassword(password, token) {
    let data = {
      attributes: {
        password: password
      }
    };

    return this.http.put(this.baseResetPassword + '/' + token, data);
  }

  setHeaders(token?) {
    if (this._hasHeaders) {
      return this;
    }

    token = token || localStorage.getItem('dg_token');

    if (!token) {
      return this;
    }

    this._hasHeaders = true;

    this.headers.append('Accept', 'application/json');
    this.headers.append('Authorization', 'Bearer ' + token);
    this.headers.append('Cache-Control', 'no-cache');
    this.headers.append('Content-Type', 'application/json');

    return this;
  }

  removeHeaders() {
    if (this._hasHeaders) {
      this._hasHeaders = false;

      this.headers.delete('accept');
      this.headers.delete('authorization');
      this.headers.delete('cache-control');
      this.headers.delete('content-type');
    }

    return this;
  }

  extractData(res: Response) {
    return res || {};
  }

  handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  private _checkLastConnexion() {
  }

  private _getNoCacheHeaders() {
    let headers = new Headers();

    headers.append('Accept', 'application/json');
    headers.append('Cache-Control', 'no-cache');
    headers.append('Content-Type', 'application/json');

    return headers;
  }
}
