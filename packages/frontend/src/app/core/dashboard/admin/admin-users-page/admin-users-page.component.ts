import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { NgIcon } from '@ng-icons/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { provideIcons } from '@ng-icons/core';
import { bootstrapPersonFill, bootstrapPersonFillDash, bootstrapPersonFillCheck, bootstrapTrashFill, bootstrapXCircle, bootstrapXLg, bootstrapPersonPlusFill, bootstrapExclamationTriangle } from '@ng-icons/bootstrap-icons';
import { UserDto, UserPageResponseDto, RoleDto } from '../../../../api/models';
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
  selector: 'app-admin-users-page',
  imports: [NavbarComponent, NgIcon, TableModule, ButtonModule, TagModule, DialogModule, InputText, FormsModule, MultiSelectModule, ConfirmPopupModule, ReactiveFormsModule],
  providers: [provideIcons({bootstrapPersonFill, bootstrapPersonFillDash, bootstrapPersonFillCheck, bootstrapTrashFill, bootstrapXCircle, bootstrapXLg, bootstrapPersonPlusFill, bootstrapExclamationTriangle}), ConfirmationService],
  templateUrl: './admin-users-page.component.html',
  styleUrl: './admin-users-page.component.css'
})
export class AdminUsersPageComponent {
  totalElements: number = 0;
  users: UserDto[] = [];
  selectedUser: UserDto[] = [];
  rolesList: RoleDto[] = [];
  modalEditUserId: string = '';
  modalEditVisible: boolean = false;
  puedoModificar: boolean = false;
  puedoEliminar: boolean = false;

  userForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    roles: new FormControl([])
  });

  constructor(private adminDashboardService: AdminDashboardService, private confirmationService: ConfirmationService, private authSessionService: AuthSessionService) { }

  ngOnInit(): void {
    this.authSessionService.getUserData().subscribe((user: UserDto | null) => {
      this.puedoModificar = user?.effectivePermissions?.adminUsers?.includes('write') || false;
    });
    this.authSessionService.getUserData().subscribe((user: UserDto | null) => {
      this.puedoEliminar = user?.effectivePermissions?.adminUsers?.includes('delete') || false;
    });
    this.adminDashboardService.getAllRoles().subscribe((response: RoleDto[]) => {
      this.rolesList = response;
    });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    this.adminDashboardService.getAllUsers(
      {
        pageNumber: (event.first || 0) / (event.rows || 10) + 1,
        pageSize: event.rows || 10,
        order: 'ASC',
      }
    ).subscribe((response: UserPageResponseDto) => {
      this.totalElements = response.totalElements;
      this.users = response.data;
    });
  }

  onRowSelect(event: any) {
    this.modalEditUserId = event.data.id;
    this.userForm.patchValue(event.data);
    this.modalEditVisible = true;
  }

  deseleccionarUsuario() {
    this.selectedUser = [];
    this.modalEditUserId = '';
    this.userForm.reset();
    this.modalEditVisible = false;
  }

  confirmEliminar(event: Event) {
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
        this.adminDashboardService.deleteUser(this.modalEditUserId).subscribe(() => {
          this.onLazyLoad({});
          this.deseleccionarUsuario();
        });
      }
    });
  }

  guardarUsuario() {
    if (this.modalEditUserId) {
      this.userForm.value.id = this.modalEditUserId;
      this.adminDashboardService.updateUser(this.userForm.value).subscribe(() => {
        this.onLazyLoad({});
        this.deseleccionarUsuario();
        this.modalEditVisible = false;
      });
    } else {
      this.adminDashboardService.createUser(this.userForm.value).subscribe(() => {
        this.onLazyLoad({});
        this.deseleccionarUsuario();
        this.modalEditVisible = false;
      });
    }
  }

  modalNuevoUsuario() {
    this.userForm.reset();
    this.modalEditVisible = true;
  }


}
