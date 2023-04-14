import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {
  isComponentShow: boolean = false;

  constructor(
    private router: Router
  ) {}

  ngDoCheck(): void {
    const currentUrl = this.router.url;
    this.isComponentShow = !['/login', '/student/register'].includes(currentUrl);
  }
}
