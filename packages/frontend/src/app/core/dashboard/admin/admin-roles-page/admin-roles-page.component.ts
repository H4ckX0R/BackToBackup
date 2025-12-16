import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { NgIcon } from '@ng-icons/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { provideIcons } from '@ng-icons/core';
import { bootstrapPersonFillDash, bootstrapTrashFill, bootstrapXCircle, bootstrapXLg, bootstrapPeopleFill, bootstrapExclamationTriangle, bootstrapPeople, bootstrapPersonLinesFill } from '@ng-icons/bootstrap-icons';
import { RoleDto, UserDto } from '../../../../api/models';
import { ButtonModule } from 'primeng/button';
import { AdminDashboardService } from '../admin-dashboard.service';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { AuthSessionService } from '../../../auth/auth-session.service';

@Component({
  selector: 'app-admin-roles-page',
  imports: [NavbarComponent, NgIcon, TableModule, ButtonModule, TagModule, DialogModule, InputText, FormsModule, MultiSelectModule, ConfirmPopupModule, ReactiveFormsModule],
  providers: [provideIcons({bootstrapPersonFillDash, bootstrapTrashFill, bootstrapXCircle, bootstrapXLg, bootstrapPeopleFill, bootstrapExclamationTriangle, bootstrapPeople, bootstrapPersonLinesFill}), ConfirmationService],
  templateUrl: './admin-roles-page.component.html',
  styleUrl: './admin-roles-page.component.css'
})
export class AdminRolesPageComponent {
  totalElements: number = 0;
  rolesList: RoleDto[] = [];
  selectedRole: RoleDto[] = [];
  puedoModificar: boolean = false;
  puedoEliminar: boolean = false;
  modalEditRoleId: string = '';
  modalEditVisible: boolean = false;
  tiposPermisos: string[] = ['read', 'write', 'delete'];


  roleForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    adminUsers: new FormControl([]),
    adminRoles: new FormControl([]),
    adminSystem: new FormControl([])
  });

  constructor(private adminDashboardService: AdminDashboardService, private confirmationService: ConfirmationService, private authSessionService: AuthSessionService) { }

  ngOnInit(): void {
    this.authSessionService.getUserData().subscribe((user: UserDto | null) => {
      this.puedoModificar = user?.effectivePermissions?.adminRoles?.includes('write') || false;
    });
    this.authSessionService.getUserData().subscribe((user: UserDto | null) => {
      this.puedoEliminar = user?.effectivePermissions?.adminRoles?.includes('delete') || false;
    });
    this.adminDashboardService.getAllRoles().subscribe((response: RoleDto[]) => {
      this.rolesList = response;
    });
  }



  onLazyLoad(event: TableLazyLoadEvent) {
    this.adminDashboardService.getAllRoles().subscribe((response: RoleDto[]) => {
      this.rolesList = response;
      this.totalElements = response.length;
    });
  }

  onRowSelect(event: any) {
    this.modalEditRoleId = event.data.id;
    this.modalEditVisible = true;
    this.roleForm.patchValue(event.data);
  }

  deseleccionarRol() {
    this.selectedRole = [];
    this.modalEditRoleId = '';
    this.modalEditVisible = false;
    this.roleForm.reset();
  }

  modalNuevoRol() {
    this.roleForm.reset();
    this.modalEditVisible = true;
  }

  guardarRol() {
    if (this.modalEditRoleId) {
      this.roleForm.value.id = this.modalEditRoleId;
      this.adminDashboardService.updateRole(this.roleForm.value).subscribe(() => {
        this.onLazyLoad({});
        this.deseleccionarRol();
        this.modalEditVisible = false;
      });
    } else {
      this.adminDashboardService.createRole(this.roleForm.value).subscribe(() => {
        this.onLazyLoad({});
        this.deseleccionarRol();
        this.modalEditVisible = false;
      });
    }
  }

  confirmEliminar(event: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      acceptButtonProps: {
        label: 'Sí',
        severity: 'danger'
      },
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary'
      },
      accept: () => {
        this.adminDashboardService.deleteRole(this.modalEditRoleId).subscribe(() => {
          this.onLazyLoad({});
          this.deseleccionarRol();
          this.modalEditVisible = false;
        });
      }
    });
  }
}
