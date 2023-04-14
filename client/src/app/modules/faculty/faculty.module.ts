import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacultyRoutingModule } from './faculty-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LeaveApprovalComponent } from './components/leave-approval/leave-approval.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent,
    LeaveApprovalComponent
  ],
  imports: [
    CommonModule,
    FacultyRoutingModule,
    ReactiveFormsModule
  ]
})
export class FacultyModule { }
