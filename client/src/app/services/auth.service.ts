import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { getSessionStorageItem, clearSessionStorageItem } from 'src/app/utils/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = 'http://localhost:5000/user/';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastrService
  ) {}

  login(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'login', data);
  }

  register(data: FormData): Observable<any> {
    return this.http.post(this.baseUrl + 'register', data);
  }

  isLoggedIn() {
    return getSessionStorageItem('access-token')!==null;
  }

  getAccessToken() {
    return getSessionStorageItem('access-token');
  }

  getLoginUser() {
    return getSessionStorageItem('user');
  }

  logout() {
    clearSessionStorageItem();
    this.toast.success('Logout successfully');
    this.router.navigate(['login']);
  }
}
