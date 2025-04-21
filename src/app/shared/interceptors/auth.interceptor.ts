import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { LoginService } from '../../modules/login/services/login.service';
import { Router } from '@angular/router';
import { from, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  const excludedUrls = ['/api/login', '/api/verificar-codigo'];
  const isExcluded = excludedUrls.some(url => req.url.includes(url));

  if (isExcluded) {
    return next(req); // No modificar la request
  }

  return from(loginService.getToken()).pipe(
    take(1),
    switchMap(token => {
      let modifiedReq = req;
      if (token) {
        modifiedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      return next(modifiedReq);
    }),
    catchError(error => {
      if (error.status === 401 || error.status === 403) {
        console.log('Token inválido o expirado. Cerrando sesión...');
        loginService.logout().then(() => {
          router.navigate(['/login']);
        });
      }
      return throwError(() => error);
    })
  );
};