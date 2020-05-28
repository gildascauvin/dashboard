import { Injectable, Inject } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from './auth.service';
import { webConfig } from '../../../web-config';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

    constructor(
      private authService: AuthService,
      private toastrService: ToastrService,
      @Inject(DOCUMENT) private _document) {}

    isRefreshing: boolean = false;

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let token = localStorage.getItem(webConfig.prefixApp + 'token');
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request)
          .map(resp => {
            // on Response
            if (resp instanceof HttpResponse) {
              // Do whatever you want with the response.
              return resp;
            }
          }).catch(err => {
            // onError
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401) {
                if (request.url.indexOf('token-refresh') > 0) {
                  this.authService.logout();
                  this.isRefreshing = false;
                  return throwError('backend comm error');
                }

                if (!this.isRefreshing && request.url.indexOf('login_check') == -1) {
                  let refreshToken = localStorage.getItem(webConfig.prefixApp + 'refresh_token');
                  if (refreshToken) {
                   this.authService.refreshToken().subscribe((response: any) => {
                      if (!response.token) {
                        this.authService.logout();
                      } else {
                        this.authService.setUserToken(response.token);
                        this.authService.setUserRefreshToken(response.refresh_token);
                        this._document.location.reload(false);
                        this.toastrService.success('Token regenerated!');
                      }

                      this.isRefreshing = false;
                    });
                  } else {
                    this.authService.logout();
                  }
                }

                if (request.url.indexOf('login_check') > 0) {
                    this.toastrService.error('Invalid credential!');
                }
                // redirect the user to login page
                // 401 unauthorised user
                this.isRefreshing = true;
              }

              if (err.status > 400) {
                this.toastrService.error('Code: ' + err.status, err.statusText);
              }
            }
            return Observable.of(err);
          });
    }
}
