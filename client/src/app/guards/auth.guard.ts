import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService, 
    private toastr: ToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (this.authService.isLoggedIn()) {
        // Get the full url of page
        const url = state.url;
        const urlSegments: any = url.split('/');

        const loginUser = this.authService.getLoginUser();
        const loginUserRole = loginUser.roles.name;
        
        if (loginUserRole === urlSegments[1]) {
          return true;
        }

        this.toastr.warning("You don't have access");
        this.router.navigate([loginUserRole]);
        return false;
        
      }

      this.router.navigate(['login']);
      return false;
    }
  
}
