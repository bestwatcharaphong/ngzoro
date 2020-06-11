import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
/** HTTP */
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
/** RxJS */
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

/** Interceptor URL Match list */
export const InterceptorMatchList = [
  // new RegExp(`(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?/api/*`),
  new RegExp(`.*`),
];
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  /** Constructor */
  constructor(private router: Router) {}

  /** Matches function */

  /** Matches function */
  private match = (url: string): boolean => {
    for (const pattern of InterceptorMatchList) {
      if (Array.isArray(url.match(pattern))) {
        return true;
      }
    }
    return false;
  };

  intercept = (
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> => {
    if (this.match(request.url)) {
      /** Attach token even if token is available */
      const token = localStorage.getItem('token');
      const tokenType = localStorage.getItem('type');
      if (token && tokenType) {
        if (token && tokenType) {
          request = request.clone({
            setHeaders: {
              Authorization: `${tokenType} ${token}`,
            },
          });
        }
      }
    }
    /** Return interceptor request */
    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          localStorage.clear();
        }
        // } else if (err instanceof HttpErrorResponse && err.status === 500) {
        //     this.router.navigateByUrl('/error', { state: Err500 });
        // }
        return throwError(err);
      })
    );
  };
}
