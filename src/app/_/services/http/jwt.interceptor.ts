import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { AuthService } from './auth.service';

declare const document: any;

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    isRefreshing: boolean = false;

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let token = localStorage.getItem('dg_token');
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
                console.log(err);
                if (err instanceof HttpErrorResponse) {
                    console.log(err.status);
                    console.log(err.statusText);
                    if (err.status === 401) {
                        if (request.url.indexOf('token-refresh') > 0) {
                            console.log('token-refresh');
                            this.authService.logout();
                            this.isRefreshing = false;
                            return throwError('backend comm error');
                        }

                        if (!this.isRefreshing) {
                            this.authService.refreshToken().subscribe((response: any) => {
                                console.log('token refreshed', response);
                                this.authService.setUserToken(response.token);
                                this.authService.setUserRefreshToken(response.refresh_token);
                                // document.reload(false);
                                this.isRefreshing = false;
                            });
                        }
                        // redirect the user to login page
                        // 401 unauthorised user
                        this.isRefreshing = true;
                    }
                }
                return Observable.of(err);
            });
            // .pipe(
            //     catchError((err) => {
            //         if (err instanceof HttpErrorResponse) {
            //           if (err.status === 401) {
            //             console.log('HTTP STATUS 401');
            //             this.authService.refreshToken().subscribe((response: any) => {
            //                 console.log('token refreshed', response);
            //                 // this.authService.setUserRefreshToken(response.refresh_token);
            //             });
            //             // this.router.navigate(['/']);
            //           } else {
            //             // this.snack.open('Communication error: ' + err.status + ' - ' + err.statusText, null,
            //             //  {duration: 5000, panelClass: 'snack-error', verticalPosition: 'top'});
            //           }

            //           return throwError('backend comm error');
            //         }
            //       })
            // );;
    }
}
