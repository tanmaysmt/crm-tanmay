import { Injectable } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService:AuthService, private router:Router){}
  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean {
    if(!this.authService.isAuthenticated()){
      this.router.navigate(['/']);
    }
    return true;
  }
}
