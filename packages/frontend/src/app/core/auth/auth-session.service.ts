import { Injectable } from '@angular/core';
import { Observable, of, tap, catchError, map } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../../api/services';
import { AuthControllerLogin$Params } from '../../api/fn/auth/auth-controller-login';
import { UserDto } from '../../api/models';
import { AuthControllerRegister$Params } from '../../api/fn/auth/auth-controller-register';

/**
 * Servicio para llevar el estado de la sesión.
 *
 * - `null`  → aún no sabemos si hay sesión (estado inicial)
 * - `true`  → usuario autenticado
 * - `false` → no autenticado
 */
@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  isAuth: boolean | null = sessionStorage.getItem('isAuth') === 'true' ? true : null;

  constructor(
    private apiAuth: AuthService,   // endpoints /login y /refresh
    private router: Router
  ) {}

  /** Comprueba/renueva la sesión al iniciar la app */
  bootstrap(): Observable<boolean> {
    return this.apiAuth.authControllerRefreshToken().pipe(
      map(() => {
        this.markAsAuthenticated();
        return true;
      }),
      catchError(() => {
        this.markAsNotAuthenticated();
        return of(false);
      })
    );
  }

  /** Login simple: emite `true` cuando el backend responde 200 */
  login(credentials: AuthControllerLogin$Params): Observable<UserDto> {
    return this.apiAuth.authControllerLogin(credentials).pipe(
      map((res) => res as UserDto),
      tap((res) => sessionStorage.setItem('user', JSON.stringify(res))),
      tap(() => this.markAsAuthenticated())
    );
  }

  register(credentials: AuthControllerRegister$Params): Observable<UserDto> {
    return this.apiAuth.authControllerRegister(credentials).pipe(
      map((res) => res as UserDto),
      tap((res) => sessionStorage.setItem('user', JSON.stringify(res))),
      tap(() => this.markAsAuthenticated())
    );
  }

  /** Cierra sesión y redirige al login (opcional) */
  logout(redirect = true): void {
    //Llamar al endpoint de /logout para que nos borre las cookies
    this.apiAuth.authControllerLogout().subscribe(() => {
      this.markAsNotAuthenticated();
      sessionStorage.removeItem('user');
      if (redirect) this.router.navigate(['/login']);
    });
  }

  /** Utilidad para el interceptor cuando renueva el token con éxito */
  markAsAuthenticated(): void {
    this.isAuth = true;
    sessionStorage.setItem('isAuth', 'true');
  }

  markAsNotAuthenticated(): void {
    this.isAuth = false;
    sessionStorage.setItem('isAuth', 'false');
  }

  getLocalUserData(): UserDto | null {
    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  getRemoteUserData(): Observable<UserDto> {
    return this.apiAuth.authControllerGetMe().pipe(
      map((res) => res as UserDto),
      tap((res) => sessionStorage.setItem('user', JSON.stringify(res))),
      tap(() => this.markAsAuthenticated())
    );
  }

  getUserData(): Observable<UserDto | null> {
    if (this.getLocalUserData()) {
      return of(this.getLocalUserData());
    } else {
      return this.getRemoteUserData().pipe(
        tap(() => this.markAsAuthenticated())
      );
    }
  }
}
