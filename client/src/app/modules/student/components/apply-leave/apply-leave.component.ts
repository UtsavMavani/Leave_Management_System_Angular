import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css']
})
export class ApplyLeaveComponent {
  applyLeaveForm!: FormGroup;
  submitted: boolean = false;
  isAddMode: boolean = true;
  id: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.applyLeaveForm = new FormGroup({
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      reason: new FormControl('', [Validators.required]),
      leaveType: new FormControl('', [Validators.required]),
      requestToId: new FormControl('', [Validators.required]),
    });

    if (!this.isAddMode) {
      this.studentService.getLeaveById(this.id).subscribe({
        next: (result) => { 
          let { startDate, endDate } = result.leave;

          result.leave.startDate = new Date(startDate).toISOString().slice(0, 10);
          result.leave.endDate = new Date(endDate).toISOString().slice(0, 10);

          this.applyLeaveForm.patchValue(result.leave);
        },
        error: (err) => { 
          this.toastr.error(err.error.message);
        }
      });
    }

  }

  // convenience getter for easy access to form fields
  get f() { return this.applyLeaveForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.applyLeaveForm.invalid) {
      return;
    }

    this.isAddMode ? this.applyLeave() : this.updateLeave();
  }

  applyLeave() {
    this.studentService.applyLeave(this.applyLeaveForm.value).subscribe({
      next: (result) => { 
        this.toastr.success(result.message);
        this.router.navigate(["student/my-leave"]);
      },
      error: (err) => { 
        this.toastr.error(err.error.message);
      }
    });
  }

  updateLeave() {
    this.studentService.updateLeave(this.id, this.applyLeaveForm.value).subscribe({
      next: (result) => { 
        this.toastr.success(result.message);
        this.router.navigate(["student/my-leave"]);
      },
      error: (err) => { 
        this.toastr.error(err.error.message);
      }
    });
  }

  onCancelClick() {
    this.router.navigate(["student/my-leave"]);
  }
}
