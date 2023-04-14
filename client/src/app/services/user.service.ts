import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = 'http://localhost:5000/user/';

  constructor(
    private http: HttpClient,
  ) {}

  getUserList(): Observable<any> {
    return this.http.get(this.baseUrl + 'usersList');
  }

  getUserById(id: any): Observable<any> {
    return this.http.get(this.baseUrl + `getUser/${id}`);
  }

  getStudentList(): Observable<any> {
    return this.http.get(this.baseUrl + 'usersList?role=4');
  }

  addUser(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'register', data);
  }

  updateUser(id: any, data: any): Observable<any> {
    return this.http.put(this.baseUrl + `update/${id}`, data);
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete(this.baseUrl + `delete/${id}`);
  }

  getProfile(): Observable<any> {
    return this.http.get(this.baseUrl + 'profile');
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(this.baseUrl + 'updateProfile', data);
  }

  updateImage(data: any): Observable<any> {
    return this.http.put(this.baseUrl + 'updateImage', data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'changePassword', data);
  }
}
