import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title: string = 'Student Dashboard';
  myAllLeave: any;
  // totalLeave: any = 0;
  leaveList: any = {
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  }

  constructor (
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.studentService.getMyLeave().subscribe({
      next: (result) => {
        this.myAllLeave = result.leave;

        this.myAllLeave.forEach((leave: any) => {
          this.leaveList[leave.status] += 1;
          this.leaveList['total'] += 1;
        });
      }
    });
  }
}
