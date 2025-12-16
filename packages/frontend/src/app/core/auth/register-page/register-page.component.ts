import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { NgIcon } from '@ng-icons/core';
import { provideIcons } from '@ng-icons/core';
import { bootstrapEyeFill, bootstrapEyeSlashFill } from '@ng-icons/bootstrap-icons';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthSessionService } from '../auth-session.service';
import { DividerModule } from 'primeng/divider';


@Component({
  selector: 'app-register-page',
  imports: [InputTextModule, PasswordModule, ButtonModule, NgIcon, FormsModule, InputGroupModule, InputGroupAddonModule, RouterLink, ReactiveFormsModule, DividerModule],
  providers: [provideIcons({bootstrapEyeFill, bootstrapEyeSlashFill})],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  showPassword: boolean = false;

  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  private readonly authSessionService = inject(AuthSessionService);
  private readonly router = inject(Router);

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  register() {
    if (this.registerForm.invalid) return;
    this.authSessionService.register({
      body: {
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      }
    }).subscribe(() => {
      this.router.navigate(['/home']);
    });
  }

}
