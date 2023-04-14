import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { setSessionStorageItem, clearSessionStorageItem } from 'src/app/utils/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted: boolean = false;
  userRole: string = '';

  constructor(
    private router: Router,
    private authService: AuthService, 
    private toastr: ToastrService
  ) {
    clearSessionStorageItem();
  }
  
  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (result) => {

        if (result.user && result.token) {
          this.userRole = result.user.roles.name;

          // Store login jwt token and user details in session storage
          setSessionStorageItem('access-token', result.token);
          setSessionStorageItem('user', result.user);

          this.toastr.success(result.message);

          // Role based navigation (admin, hod, faculty, student)
          this.router.navigate([this.userRole]);

        } else {
          this.toastr.error('Login failed');
        }
      },
      error: (err) => { 
        this.toastr.error(err.error.message);
      }
    });

  }

}