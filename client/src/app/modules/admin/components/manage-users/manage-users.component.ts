import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  title: string = 'Manage Users';
  userList: any = [];

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems = this.userList.length;

  constructor (
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getUserList().subscribe({
      next: (result) => {
        this.userList = result.userList;
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event;
  }

  onItemChange(items: any) {
    this.itemsPerPage = items;
    this.currentPage = 1;
  }

  deleteUser(id: any) {
    Swal.fire({
      title: 'Are you sure ?',
      text: 'Do you want to delete this user ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, cancel',
      confirmButtonColor: 'green',
      cancelButtonColor: 'red'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
          next: (result) => { 
            this.toastr.success(result.message);
          },
          error: (err) => { 
            this.toastr.error(err.error.message);
          }
        });
      }
    });
  }

}