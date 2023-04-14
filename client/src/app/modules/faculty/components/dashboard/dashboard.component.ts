import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FacultyService } from 'src/app/services/faculty.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title: string = 'Faculty Dashboard'
  leaveRequest: any = 0;
  totalStudent: any = 0;

  constructor (
    private facultyService: FacultyService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.facultyService.getPendingLeaveList().subscribe({
      next: (result) => {
        this.leaveRequest = result.leaveList.length;
      }
    });

    this.userService.getStudentList().subscribe({
      next: (result) => {
        this.totalStudent = result.userList.length;
      }
    })
  }
}
