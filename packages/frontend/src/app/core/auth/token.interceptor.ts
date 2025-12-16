import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../api/services/auth.service';
import { AuthSessionService } from './auth-session.service';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

// Variable para controlar si se está refrescando el token
let isRefreshing = false;

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const apiAuth = inject(AuthService);
  const session = inject(AuthSessionService);
  
  // Clonamos la request con las cookies
  const authReq = req.clone({
    withCredentials: true,
  });
  
  return next(authReq).pipe(
    catchError((error) => {
      // Solo manejamos error 401 y evitamos interceptar peticiones de autenticación
      if (
        error instanceof HttpErrorResponse &&
        !req.url.includes('/auth/login') &&
        !req.url.includes('/auth/refresh') &&
        error.status === 401
      ) {
        return handle401Error(authReq, next, apiAuth, session);
      }
      return throwError(() => error);
    })
  );
};

// Función para manejar error 401 (Unauthorized)
function handle401Error(
  request: any, 
  next: any, 
  apiAuth: AuthService, 
  session: AuthSessionService
): Observable<any> {
  // Solo intentamos refrescar si no hay un refresh en curso
  if (!isRefreshing) {
    isRefreshing = true;
    
    // Verificamos si el usuario está logueado antes de intentar refresh
    if (session.isAuth) {
      return apiAuth.authControllerRefreshToken().pipe(
        switchMap(() => {
          isRefreshing = false;
          session.markAsAuthenticated();
          return next(request);
        }),
        catchError((error) => {
          isRefreshing = false;
          
          // Si el refresh falla con 401, cerramos sesión
          if (error.status === 401) {
            session.logout();
          }
          
          return throwError(() => error);
        })
      );
    }
  }
  
  // Si ya hay un refresh en curso o el usuario no está logueado,
  // simplemente dejamos pasar la request para evitar bucles
  return next(request);
}