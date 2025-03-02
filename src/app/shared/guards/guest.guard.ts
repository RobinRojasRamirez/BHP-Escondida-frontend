import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../../modules/login/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuthentication();
  }

  private async checkAuthentication(): Promise<boolean | UrlTree> {
    const token = await this.loginService.getToken();
    if (token && !this.loginService.isTokenExpired(token)) {
      // Si está autenticado, redirigir a /dashboard
      return this.router.parseUrl('/dashboard');
    }
    // Si no está autenticado, permitir acceso
    return true;
  }
}