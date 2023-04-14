import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  addUserForm!: FormGroup;
  submitted: boolean = false;
  isAddMode: boolean = true;
  id: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.addUserForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      cpassword: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{10}$")]),
      address: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
    });

    if (!this.isAddMode) {
      this.addUserForm.removeControl('password');
      this.addUserForm.removeControl('cpassword');

      this.userService.getUserById(this.id).subscribe({
        next: (result) => { 

          if (result.user.role !== 1){
            this.addUserForm.addControl('department', new FormControl('', [Validators.required]));
          }

          if (result.user.role === 4) {
            this.addUserForm.addControl('grNumber', new FormControl('', [Validators.required]));
            this.addUserForm.addControl('class', new FormControl('', [Validators.required]));
          }

          this.addUserForm.patchValue(result.user);
        },
        error: (err) => { 
          this.toastr.error(err.error.message);
        }
      });

    }
  }

  onChange(role: any) {
    if (role !== '1'){
      this.addUserForm.addControl('department', new FormControl('', [Validators.required]));
    }

    if (role === '4') {
      this.addUserForm.addControl('grNumber', new FormControl('', [Validators.required]));
      this.addUserForm.addControl('class', new FormControl('', [Validators.required]));
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.addUserForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addUserForm.invalid) {
      return;
    }

    this.isAddMode ? this.addUser() : this.updateUser();
  }

  addUser() {
    this.userService.addUser(this.addUserForm.value).subscribe({
      next: (result) => { 
        this.toastr.success(result.message);
        this.router.navigate(["admin/manage-users"]);
      },
      error: (err) => { 
        this.toastr.error(err.error.message);
      }
    });
  }

  updateUser() {
    this.userService.updateUser(this.id, this.addUserForm.value).subscribe({
      next: (result) => { 
        this.toastr.success(result.message);
        this.router.navigate(["admin/manage-users"]);
      },
      error: (err) => { 
        this.toastr.error(err.error.message);
      }
    });
  }

  onCancelClick() {
    this.router.navigate(["admin/manage-users"]);
  }
}
