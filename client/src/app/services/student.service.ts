import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  baseUrl: string = 'http://localhost:5000/leave/';

  constructor(
    private http: HttpClient,
  ) {}

  getMyLeave(): Observable<any> {
    return this.http.get(this.baseUrl + `leaveStatus`);
  }

  getLeaveById(id: any): Observable<any> {
    return this.http.get(this.baseUrl + `getLeave/${id}`);
  }

  applyLeave(data: any): Observable<any> {
    return this.http.post(this.baseUrl + `leaveRequest`, data);
  }

  updateLeave(id: any, data: any): Observable<any> {
    return this.http.put(this.baseUrl + `updateLeave/${id}`, data);
  }

  deleteLeave(id: any): Observable<any> {
    return this.http.delete(this.baseUrl + `deleteLeave/${id}`);
  }

  leaveReport(): Observable<any> {
    return this.http.get(this.baseUrl + `leaveReport`);
  }
}
