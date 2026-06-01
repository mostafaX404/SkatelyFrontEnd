import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { JsonPipe } from '@angular/common';
import {InputText} from "../../../shared/components/input-text/input-text"
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatCard, MatButton,JsonPipe,
    InputText 
],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private snack = inject(SnackbarService);
  validationErrors? : string[];

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
  this.accountService.register(this.registerForm.value).subscribe({
    next: () => {
      this.snack.success('Registration successful - you can now login');
      this.router.navigateByUrl('/account/login');
    },
    error: (err) => {
      if (err.error && err.error.errors) {
        this.validationErrors = err.error.errors;
      } else {
        this.validationErrors = [err.error || 'Registration failed'];
      }
    }
  });
}

}