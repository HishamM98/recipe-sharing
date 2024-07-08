import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../../../shared/validators/password.validator';
import { AuthService } from '../../services/auth/auth-service.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {
  private subscriptions = new Subscription();
  isRegister: boolean = true;
  private auth$ = inject(AuthService);
  private router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
  });

  signupForm = new FormGroup(
    {
      fullname: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
      confirmPassword: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
    },
    { validators: confirmPasswordValidator }
  );

  onLoginSubmit() {
    const { email, password } = this.loginForm.value;
    this.subscriptions.add(this.auth$.login(email, password).subscribe({
      next: (res) => {
        if (this.auth$.isLoggedIn()) {
          this.router.navigateByUrl('');
        }
      },
      error: (err) => { console.error(err.message); }
    }));
  }

  onRegisterSubmit() {
    const { fullname, email, password } = this.signupForm.value;
    this.subscriptions.add(this.auth$.register(fullname!, email!, password!).subscribe({
      next: (res) => {
        this.openSnackBar("Registration successful!");
        this.isRegister = !this.isRegister;
      },
      error: (err) => {
        console.error(err.message);
        this.openSnackBar("Registration Failed...Try again later");
      }
    }));
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "Close", {
      duration: 3000
    });
  }

  togglePanel() {
    this.isRegister = !this.isRegister;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
