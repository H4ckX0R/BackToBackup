import { Routes } from '@angular/router';
import { LoginPageComponent } from './core/auth/login-page/login-page.component';
import { RegisterPageComponent } from './core/auth/register-page/register-page.component';
import { HomePageComponent } from './core/dashboard/home-page/home-page.component';
import { authGuard } from './core/auth/auth.guard';
import { AdminUsersPageComponent } from './core/dashboard/admin/admin-users-page/admin-users-page.component';
import { AdminRolesPageComponent } from './core/dashboard/admin/admin-roles-page/admin-roles-page.component';
import { MyDevicesPageComponent } from './core/dashboard/devices/my-devices-page/my-devices-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent, canActivate: [authGuard] },
  { path: 'register', component: RegisterPageComponent, canActivate: [authGuard] },
  { path: 'home', component: HomePageComponent, canActivate: [authGuard] },

  { path: 'devices/my-devices', component: MyDevicesPageComponent, canActivate: [authGuard] },

  { path: 'admin/users', component: AdminUsersPageComponent, canActivate: [authGuard] },
  { path: 'admin/roles', component: AdminRolesPageComponent, canActivate: [authGuard] }
];
