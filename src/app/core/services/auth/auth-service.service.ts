import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment as env } from '../../../../environments/environment.development';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User } from '../../../shared/models/user';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private url = env.apiUrl;
  private router = inject(Router);

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.url}/users/login`, { email, password }).pipe(
      map(response => {
        // Store JWT token in secure storage (e.g., local storage with HttpOnly flag)
        this.setToken(response.userToken);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  register(fullname: string, email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.url}/users/signup`, { fullname, email, password })
      .pipe(
        catchError(this.handleError)
      );
  }

  getUserProfile() {
    return this.http.get<User>(`${this.url}/users`).pipe(
      catchError(this.handleError)
    );
  }

  logout() {
    this.removeToken();
    this.router.navigateByUrl('/auth');
  }

  isLoggedIn() {
    // Check if token exists and is not expired (consider using jwt-decode)
    const token = this.getToken();
    if (token) {
      if (this.isTokenExpired(token)) {
        this.logout();
        return false;
      }
      else {
        return true;
      }
    }
    return false;
  }

  private isTokenExpired(token: string): boolean {
    const decodedToken = jwtDecode(token);
    const expirationTime = decodedToken.exp! * 1000; // Convert to milliseconds
    const now = Date.now();
    return now < expirationTime ? false : true;
  }

  getToken() {
    return localStorage.getItem('auth_token'); // Replace with secure storage
  }

  private setToken(token: string) {
    localStorage.setItem('auth_token', token); // Replace with secure storage
  }

  private removeToken() {
    localStorage.removeItem('auth_token'); // Replace with secure storage
  }

  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      errorMessage = `Backend returned code ${error.status}: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
