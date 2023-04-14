import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-leave',
  templateUrl: './my-leave.component.html',
  styleUrls: ['./my-leave.component.css']
})
export class MyLeaveComponent implements OnInit{
  title: string = 'My Leave';
  myLeave: any = [];

  constructor (
    private router: Router,
    private toastr: ToastrService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.studentService.getMyLeave().subscribe({
      next: (result) => { 
        this.myLeave = result.leave;
      },
      error: (err) => { 
        this.toastr.error(err.error.message);
      }
    });
  }

  updateLeave(id: any, status: string) {
    if (["approved", "rejected"].includes(status)) {
      this.toastr.error(`You can't update this leave because of this leave has already ${status}`);
    } else {
      this.router.navigate([`student/update-leave/${id}`]);
    }
  }

  deleteLeave(id: any, status: string) {
    Swal.fire({
      title: 'Are you sure ?',
      text: 'Do you want to delete this leave ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, cancel',
      confirmButtonColor: 'green',
      cancelButtonColor: 'red'
    }).then((result) => {
      if (result.isConfirmed) {
        if (["approved", "rejected"].includes(status)) {
          this.toastr.error(`You can't delete this leave because of this leave has already ${status}`);
        } else {
          this.studentService.deleteLeave(id).subscribe({
            next: (result) => { 
              this.toastr.success(result.message);
            },
            error: (err) => { 
              this.toastr.error(err.error.message);
            }
          });
        }
      }
    });
  }
   
}
