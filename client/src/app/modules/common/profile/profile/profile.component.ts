import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { setSessionStorageItem } from 'src/app/utils/utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  updateProfileForm!: FormGroup;
  changePasswordForm!: FormGroup;
  submitted: boolean = false;
  profileData: any;
  profileImageBasePath: string = 'http://localhost:5000/public/userImages/';
  profileImage: string = '';

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.profileData = this.authService.getLoginUser();
    this.profileImage = this.profileImageBasePath + (this.profileData.image ? this.profileData.image : 'user.png');

    this.updateProfileForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      gender: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{10}$")]),
      address: new FormControl('', [Validators.required])
    });

    if (this.profileData.roles.name === 'student') {
      this.updateProfileForm.addControl('grNumber', new FormControl('', [Validators.required]));
      this.updateProfileForm.addControl('class', new FormControl('', [Validators.required]));
    }

    if (this.profileData.roles.name !== 'admin') {
      this.updateProfileForm.addControl('department', new FormControl('', [Validators.required]));
    }

    this.changePasswordForm = new FormGroup({
      oldPass: new FormControl('', [Validators.required]),
      newPass: new FormControl('', [Validators.required]),
      conPass: new FormControl('', [Validators.required])
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.updateProfileForm.controls; }
  get c() { return this.changePasswordForm.controls; }

  onUpdateProfileClick() {
    this.updateProfileForm.patchValue(this.profileData);
  }

  onProfileSubmit() {
    const closeBtn: any = document.querySelector('.closeBtn');
    this.submitted = true;

    // stop here if form is invalid
    if (this.updateProfileForm.invalid) {
      return;
    }

    // Update user profile
    this.userService.updateProfile(this.updateProfileForm.value).subscribe({
      next: (result: any) => { 
        // Update the session storage user data with updated value
        this.userService.getProfile().subscribe({
          next: (result: any) => {
            setSessionStorageItem('user', result.profile);
          }
        });
        this.toastr.success(result.message);
        closeBtn.click();
      },
      error: (err) => { 
        this.toastr.error(err.error.message);
        closeBtn.click();
      }
    }); 
  }

  onPasswordSubmit() {
    const closeBtn: any = document.getElementById('closeBtn');
    this.submitted = true;

    // stop here if form is invalid
    if (this.changePasswordForm.invalid) {
      return;
    }

    // Change user password
    this.userService.changePassword(this.changePasswordForm.value).subscribe({
      next: (result: any) => { 
        this.toastr.success(result.message);
        closeBtn.click();
        this.changePasswordForm.reset();
      },
      error: (err) => { 
        this.toastr.error(err.error.message);
        closeBtn.click();
        this.changePasswordForm.reset();
      }
    });
  }

  onEditIconClick() {
    const inputFile = document.getElementById('input-file');
    inputFile?.click();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('image', file);

    this.userService.updateImage(formData).subscribe({
      next: (result) => {
        setSessionStorageItem('user', result.profile);
        this.profileImage = this.profileImageBasePath + result.profile.image;
        this.toastr.success(result.message);
      },
      error: (err) => {
        this.toastr.success(err.message);
      }
    });
  }
}
