import { AuthService } from '@/auth/services/auth.service';
import { FormUtils } from '@/auth/utils/form-utils';
import { ValidatorPatterns } from '@/auth/validator-patterns/validator-patterns';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.html',
})
export class RegisterPage {

  fb = inject(FormBuilder);
  hasError = signal(false);
  hasRegistered = signal(false);
  isPosting = signal(false);
  router = inject(Router);
  formUtils = FormUtils;

  authService = inject(AuthService);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['', { validators: [Validators.required, this.formUtils.trimValidator, Validators.pattern(ValidatorPatterns.namePattern)], updateOn: 'blur' }],
  })

  onSubmit() {

    if (this.registerForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false)
      }, 2000);
      return;
    }

    const { email = '', password = '', fullName = '' } = this.registerForm.value;

    this.authService.singUp(email!, password!, fullName!).subscribe((isRegistered) => {
      if (isRegistered) {
        this.router.navigateByUrl('/');
        return;
      }
      this.hasRegistered.set(true);
      setTimeout(() => {
        this.hasRegistered.set(false)
      }, 2000);
    });
  }

}
