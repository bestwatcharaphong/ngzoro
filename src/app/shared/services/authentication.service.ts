import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Ticket, AuthorizedResult } from '../models/auth.model';
import {
  generateSalt,
  encryptSecret,
} from 'src/app/shared/operators/crypto.operator';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private redirectUrl = '';
  private prefixUri = '/api';
  constructor(private http: HttpClient) {}
  private uri = (uri: string = ''): string => `${this.prefixUri}${uri}`;

  setRedirectUrl = (url: string): void => {
    this.redirectUrl = url;
  };

  isAuthorizedAccess(): Promise<boolean> {
    return this.http
      .get(this.uri('/auth'))
      .toPromise()
      .then(() => true)
      .catch((err) => {
        localStorage.clear();
        return false;
      });
  }

  getTicket(salt: string): Observable<any> {
    // const salt = generateSalt(32);
    const params = new HttpParams().append('salt', `${salt}`);
    return this.http.get(this.uri('/auth/ticket'), { params });
  }

  signIn(
    username: string,
    password: string,
    salt: string,
    t: Ticket
  ): Observable<any> {
    const secret = encryptSecret(
      JSON.stringify({ username, password } as object),
      salt
    );
    const data = {
      secret,
      ticket: t.ticket,
    } as object;
    return this.http.post(this.uri('/auth/signin'), data).pipe(
      tap(
        (result) => {
          console.log(`result when signin: ${result}`);
          const authorizedResult = result.result as AuthorizedResult;

          localStorage.setItem('token', authorizedResult.token);
          localStorage.setItem('type', authorizedResult.type);
        },
        () => {
          localStorage.clear();
        }
      )
    );
  }

  signOut(): Observable<any> {
    return this.http.post(this.uri('/auth/signout'), null).pipe(
      tap(() => {
        this.redirectUrl = '';
        localStorage.clear();
      })
    );
  }
}
