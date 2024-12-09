import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isLoggedIn()) {
      const userRole:any = this.authService.getRole(); 
      const requiredRoles = route.data['roles'] as Array<number>;

      if (requiredRoles && userRole !== null && requiredRoles.includes(userRole)) {
        return true; 
      } else {
        this.router.navigate(['/forbidden']); // Redirect if access is denied
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
