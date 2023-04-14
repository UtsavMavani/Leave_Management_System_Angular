import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title: string = 'Admin Dashboard';
  userList: any = [];
  roleList: any = {
    admin: 0,
    hod: 0,
    faculty: 0,
    student: 0,
  }
  
  constructor (
    private userService: UserService
  ) {}

  ngOnInit(): void {
      this.userService.getUserList().subscribe({
        next: (result) => {
          this.userList = result.userList;

          this.userList.forEach((user: any) => {
            this.roleList[user.roles.name] += 1;
          });
        }
      })
  }
}
