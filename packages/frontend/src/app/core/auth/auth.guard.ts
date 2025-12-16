import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionService } from './auth-session.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const session = inject(AuthSessionService);
  const router = inject(Router);
  const isLoginOrRegister = state.url === '/login' || state.url === '/register';

  // Rutas de login o registro
  if (isLoginOrRegister) {
    // Si ya está autenticado, redirige al home
    if (session.isAuth) {
      return router.createUrlTree(['/home']);
    }

    // Si no está autenticado, intenta obtener los datos remotos del usuario
    return session.getRemoteUserData().pipe(
      map((user) => {
        // Si existen datos de usuario, redirigir al home
        if (user) {
          return router.createUrlTree(['/home']);
        }
        // Si no hay datos de usuario, permitir acceso al login o register
        return true;
      }),
      catchError(() => {
        // En caso de error al obtener datos, también permitir acceso al login o register
        return of(true);
      })
    );
  }

  // Resto de rutas
  // Si está autenticado, permite el acceso
  if (session.isAuth) {
    return true;
  }

  // No autenticado, intenta obtener datos remotos
  return session.getRemoteUserData().pipe(
    map((user) => {
      // Si existen datos de usuario, permitir acceso
      if (user) {
        return true;
      }
      // Si no hay datos de usuario, redirigir al login
      return router.createUrlTree(['/login']);
    }),
    catchError(() => {
      // En caso de error al obtener datos, redirigir al login
      return of(router.createUrlTree(['/login']));
    })
  );
};
