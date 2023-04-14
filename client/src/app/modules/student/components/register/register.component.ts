import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService 
  ) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      cpassword: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{10}$")]),
      address: new FormControl('', [Validators.required]),
      grNumber: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
      class: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.registerForm.patchValue({
        image: file
      });
    }
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('name', this.registerForm.get('name')?.value);
    formData.append('email', this.registerForm.get('email')?.value);
    formData.append('password', this.registerForm.get('password')?.value);
    formData.append('cpassword', this.registerForm.get('cpassword')?.value);
    formData.append('gender', this.registerForm.get('gender')?.value);
    formData.append('phone', this.registerForm.get('phone')?.value);
    formData.append('address', this.registerForm.get('address')?.value);
    formData.append('grNumber', this.registerForm.get('grNumber')?.value);
    formData.append('department', this.registerForm.get('department')?.value);
    formData.append('class', this.registerForm.get('class')?.value);
    formData.append('image', this.registerForm.get('image')?.value);

    this.authService.register(formData).subscribe({
      next: (result) => { 
        this.toastr.success(result.message);
        this.router.navigate(["/login"]);
      },
      error: (err) => { 
        this.toastr.error(err.error.message);
      }
    });
  }
}
