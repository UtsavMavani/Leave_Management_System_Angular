import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userData: any;
  role: string = '';

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userData = this.authService.getLoginUser();
    this.role = this.userData?.roles.name;
  }

  onLogout() {
    this.authService.logout();
  }
}
