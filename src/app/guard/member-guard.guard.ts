import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class OnlyLoggedInUsersGuard implements CanActivate{

  constructor(private authService: AuthService){}

  canActivate() {
    console.log("Only Logged In Users Guard");
    if( this.authService.isAuthenticated){
      return true;
    } else{
      window.alert("You don't have permission to view this page");
      return false;
    }
  }
  
}