import { inject, Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  currentUser = signal<any | null>(this.loadUserFromStorage());

  private loadUserFromStorage(): any | null {
    const user = localStorage.getItem(environment.localUser);
    return user ? JSON.parse(user) : null;
  }

  signIn (email: string, password: string){
    const body = { email, password } 
    console.log(body);
    return this.http.post(`${environment.apiUrl}/auth/login` , body);
  }

  signUp(payload: any) {
    return this.http.post(`${environment.apiUrl}/auth/register`, payload);
  }

  login(token: string, response: any) {
    localStorage.setItem(environment.localSession, token);

    const { accessToken, ...userData } = response;
    localStorage.setItem(environment.localUser, JSON.stringify(userData));
    this.currentUser.set(userData);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(environment.localSession);
  }

  logout() {
    localStorage.removeItem(environment.localSession);
    localStorage.removeItem(environment.localUser);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(environment.localSession);
  }

  getUserId () {
      const userObjectString = localStorage.getItem(environment.localUser);
 
      if (userObjectString) {
        const userObject = JSON.parse(userObjectString);     
        return userObject['id'] || null;
      }
      return null;
  }

  updateUser(data:any) {    
     return this.http.put(`${environment.apiUrl}`, data);
  }

  forgotPasswordEmail(email: string): Observable<any> {
      const payload = {
        "email" : email
      }
     return this.http.post(`${environment.apiUrl}/users/forgot-password/email/v1`, payload);
  }

  /**
   * Step 2: Submit verification code and new password to complete reset.
   * @param data Payload containing email, verification code, and new password
   */
  resetPassword(email: string, code: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/reset-password`, {
      email, code, password
    });
  }
}
