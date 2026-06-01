import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AccountService } from '../../../core/services/account.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private accounService = inject(AccountService);
  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);
  returnUrl = '/shop';

  constructor() {
    const url = this.activatedRoute.snapshot.queryParams['returnUrl'];
    if (url) this.returnUrl = url;
  }




  loginForm = this.fb.group({
    email: [''],
    password: ['']
  });



  onSubmit() {
    this.accounService.login(this.loginForm.value).subscribe({
      next: () => {
        // console.log(this.loginForm.value)
        this.accounService.getUserInfo().subscribe();
        this.router.navigateByUrl('/shop');
        // console.log(this.accounService.currentUser)

      }
    })
  }

}
