import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '../../modules/login/services/login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/api/login')) {
      return next.handle(req);
    }

    return from(this.loginService.getToken()).pipe(
      take(1),
      switchMap(token => {
        let modifiedReq = req;

        if (token) {
          modifiedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}` 
            }
          });
        }

        return next.handle(modifiedReq);
      }),
      catchError(error => this.handleAuthError(error))
    );
  }

  private handleAuthError(error: any): Observable<never> {
    if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
      console.log('Token inválido o expirado. Cerrando sesión...');
      this.loginService.logout().then(() => {
        this.router.navigate(['/login']);
      });
    }
    return throwError(() => error);
  }
}
