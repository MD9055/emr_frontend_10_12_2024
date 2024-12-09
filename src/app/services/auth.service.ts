import { Injectable } from '@angular/core';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private commonService:CommonService) { }

  // Method to log in the user and set the token
  login(token: any) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Return true if the token exists
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  // Method to get the stored token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded: any = this.commonService.decodeToken(token)
      return decoded.role; 
    }
    return null;
  }
}
