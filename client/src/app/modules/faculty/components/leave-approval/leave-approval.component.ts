import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FacultyService } from 'src/app/services/faculty.service';

@Component({
  selector: 'app-leave-approval',
  templateUrl: './leave-approval.component.html',
  styleUrls: ['./leave-approval.component.css']
})
export class LeaveApprovalComponent implements OnInit {
  title: string = 'Leave Approval'
  pendingLeaveList: any = [];
  leaveApprovalForm!: FormGroup;
  submitted: boolean = false;
  leaveApprovalId: any;

  constructor (
    private toastr: ToastrService,
    private facultyService: FacultyService
  ) {}

  ngOnInit(): void {
    this.facultyService.getPendingLeaveList().subscribe({
      next: (result) => {
        this.pendingLeaveList = result.leaveList;
      }
    });

    this.leaveApprovalForm = new FormGroup({
      status: new FormControl('', [Validators.required]),
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.leaveApprovalForm.controls; }

  leaveApproval(id: any) {
    this.leaveApprovalId = id;
    console.log("app" + this.leaveApprovalId);
  }

  onSubmit() {
    const closeBtn: any = document.getElementById('closeBtn');
    this.submitted = true;

    // stop here if form is invalid
    if (this.leaveApprovalForm.invalid) {
      return;
    }

    this.facultyService.leaveApproval(this.leaveApprovalId, this.leaveApprovalForm.value).subscribe({
      next: (result) => { 
        this.toastr.success(result.message);
        closeBtn.click();
      },
      error: (err) => { 
        this.toastr.error(err.error.message);
        this.leaveApprovalForm.reset();
        closeBtn.click();
      }
    });
  }
}
