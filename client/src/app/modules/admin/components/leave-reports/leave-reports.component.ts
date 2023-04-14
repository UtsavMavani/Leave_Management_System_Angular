import { Component } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-leave-reports',
  templateUrl: './leave-reports.component.html',
  styleUrls: ['./leave-reports.component.css']
})
export class LeaveReportsComponent {
  title: string = 'Leave Reports';
  leaveReportList: any = [];

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems = this.leaveReportList.length;

  constructor (
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.studentService.leaveReport().subscribe({
      next: (result) => {
        this.leaveReportList = result.leaveReportList;
      }
    })
  }

  onPageChange(event: any) {
    this.currentPage = event;
  }

  onItemChange(items: any) {
    this.itemsPerPage = items;
    this.currentPage = 1;
  }
}
