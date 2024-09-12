import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {interval, Observable, switchMap, throwError} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/api/auth`;
  private token: string | null = null;
  private username: string | null = null;

  constructor(private httpClient: HttpClient) {
    this.token = localStorage.getItem('token'); // Check if token exists in localStorage
    this.username = localStorage.getItem('username'); // Check if username exists in localStorage
    this.autoLogout();
  }

  isAuthenticated(): boolean {
    return !!this.getToken(); // Check if the token exists
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  setUsername(username: string) {
    this.username = username;
    localStorage.setItem('username', username);
  }

  getUsername(): string | null {
    if (!this.username) {
      this.username = localStorage.getItem('username');
    }
    return this.username;
  }

  login(username: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/login`;
    const body = { username, password };
    return this.httpClient.post<any>(url, body).pipe(
      tap((response) => {
        this.token = response.token;
        localStorage.setItem('token', response.token); // Save token
      }),
      catchError((error) => {
        return throwError('Login failed');
      })
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/register`;
    const body = { username, email, password };
    return this.httpClient.post<any>(url, body).pipe(
      catchError((error) => {
        if (error.status === 400 && error.error) {
          return throwError(error.error); // Return validation errors
        }
        return throwError('Registration failed');
      })
    );
  }

  activateUser(code: string): Observable<any> {
    const url = `${this.baseUrl}/activate?code=${code}`;
    return this.httpClient.get<any>(url).pipe(
      catchError((error) => {
        return throwError('Account activation failed');
      })
    );
  }

  logout(): Observable<any> {
    const url = `${this.baseUrl}/logout`;
    const token = this.getToken(); // Retrieve token

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.httpClient.post(url, {}, { headers, responseType: 'text' }).pipe(
        tap((response) => {
          if (response === 'Logout successful! Token invalidated.') {
            this.token = null;
            localStorage.removeItem('token');
          }
        }),
        catchError((error) => {
          return throwError('Logout failed');
        })
      );
    } else {
      return throwError('No token found, logout failed');
    }
  }

  autoLogout(): void {
    interval(10000) // Call every 10 seconds
      .pipe(
        tap(() => {
          console.log('Calling checkStatus...');
        }),
        switchMap(() => this.checkStatus().pipe(
          catchError((error) => {
            console.error('Error in checkStatus:', error);
            console.log('Token invalid');
            // Handle the error, logout if token is invalid
            if (this.token) {
              this.token = null;
              localStorage.removeItem('token');
              window.location.reload(); // Reload the page after logout
              console.log('Logging out');
            }
            return [];
          })
        ))
      )
      .subscribe({
        next: () => {
          console.log('Check status executed without error');
        },
        error: (err) => {
          console.error('Unexpected error in autoLogout stream:', err);
        }
      });
  }

  checkStatus(): Observable<any> {
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.httpClient.get(`${this.baseUrl}/status`, { headers, responseType: 'text' }).pipe(
        tap((response) => {
          if (response === 'OK') {
            console.log('Token is valid');
          }
        }),
        catchError((error) => {
          console.error('Token is invalid or expired:', error);
          return throwError(error);
        })
      );
    } else {
      return throwError('No token found');
    }
  }
}
