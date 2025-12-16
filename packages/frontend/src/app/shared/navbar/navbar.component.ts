import { Component, inject } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { provideIcons } from '@ng-icons/core';
import {
  bootstrapChevronDown,
  bootstrapPersonFill,
  bootstrapShieldShaded,
  bootstrapDoorOpen,
  bootstrapPersonBadge,
  bootstrapGearWideConnected,
  bootstrapPcDisplay,
} from '@ng-icons/bootstrap-icons';
import { NgIcon } from '@ng-icons/core';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { MenubarModule } from 'primeng/menubar';
import { RouterLink } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { AuthSessionService } from '../../core/auth/auth-session.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  imports: [
    NgIcon,
    MenubarModule,
    BadgeModule,
    RouterLink,
    MenuModule,
    AvatarModule,
    ButtonModule,
  ],
  providers: [
    provideIcons({
      bootstrapChevronDown,
      bootstrapPersonFill,
      bootstrapShieldShaded,
      bootstrapDoorOpen,
      bootstrapPersonBadge,
      bootstrapPcDisplay,
      bootstrapGearWideConnected,
    }),
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly authSessionService = inject(AuthSessionService);
  items: MenuItem[] = [
    {
      label: 'Mis Dispositivos',
      icon: 'bootstrapPcDisplay',
      routerLink: '/devices/my-devices',
    },
  ];

  profileItems: MenuItem[] = [
    {
      label: 'Usuario no autenticado',
    },
    {
      separator: true,
    },
    {
      label: 'Cerrar Sesión',
      icon: 'bootstrapDoorOpen',
      command: () => this.authSessionService.logout(),
    },
  ];

  ngOnInit() {
    this.authSessionService.getUserData().subscribe((user) => {
      this.profileItems[0].label = user?.firstName + ' ' + user?.lastName;

      if (user?.effectivePermissions?.adminUsers?.includes('read')) {
        this.getAdminMenu()?.push({
          label: 'Usuarios',
          icon: 'bootstrapPersonFill',
          routerLink: '/admin/users',
        });
      }

      if (user?.effectivePermissions?.adminRoles?.includes('read')) {
        this.getAdminMenu()?.push({
          label: 'Roles',
          icon: 'bootstrapPersonBadge',
          routerLink: '/admin/roles',
        });
      }

      if (user?.effectivePermissions?.adminSystem?.includes('read')) {
        this.getAdminMenu()?.push({
          label: 'Sistema',
          icon: 'bootstrapGearWideConnected',
          routerLink: '/admin/system',
        });
      }
    });
  }

  getAdminMenu() {
    let adminMenu = this.items.filter(
      (item) => item.label === 'Administración'
    )[0];

    if (adminMenu) return adminMenu.items;

    this.items.push({
      label: 'Administración',
      icon: 'bootstrapShieldShaded',
      items: [],
    });

    return this.items.filter(
      (item) => item.label === 'Administración'
    )[0].items;
  }
}
