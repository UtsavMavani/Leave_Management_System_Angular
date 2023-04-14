import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{
  userData: any;
  role: string = '';

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userData = this.authService.getLoginUser();
    this.role = this.userData?.roles.name;
  }
}
