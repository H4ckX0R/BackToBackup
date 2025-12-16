import { Component, inject } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { NgIcon } from '@ng-icons/core';
import { provideIcons } from '@ng-icons/core';
import { bootstrapEyeFill, bootstrapEyeSlashFill } from '@ng-icons/bootstrap-icons';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { AuthSessionService } from '../auth-session.service';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  imports: [PasswordModule, InputTextModule, ButtonModule, NgIcon, FormsModule, InputGroupModule, InputGroupAddonModule, RouterLink, ReactiveFormsModule],
  providers: [provideIcons({bootstrapEyeFill, bootstrapEyeSlashFill})],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
    loginForm: FormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
    showPassword: boolean = false;

    private readonly authSessionService = inject(AuthSessionService);
    private readonly router = inject(Router);

    togglePassword() {
      this.showPassword = !this.showPassword;
    }

    login() {
      if (this.loginForm.invalid) return;
      this.authSessionService.login({
        body: {
          email: this.loginForm.value.email,
          password: this.loginForm.value.password
        }
      }).subscribe(() => {
        this.router.navigate(['/home']);
      });
    }
}
