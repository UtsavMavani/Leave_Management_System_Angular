import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  baseUrl: string = 'http://localhost:5000/leave/';

  constructor(
    private http: HttpClient,
  ) {}

  getPendingLeaveList(): Observable<any> {
    return this.http.get(this.baseUrl + `pendingLeave`);
  }

  leaveApproval(id: any, data: any): Observable<any> {
    return this.http.put(this.baseUrl + `approveLeave/${id}`, data);
  }
}
