import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LeaveApprovalComponent } from './components/leave-approval/leave-approval.component';

const routes: Routes = [
  { 
    path: '',
    redirectTo: '/faculty/dashboard',
    pathMatch: 'full'
  },
  { 
    path: 'dashboard', 
    canActivate: [AuthGuard],
    component: DashboardComponent
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => 
      import('../common/profile/profile.module').then((m) => m.ProfileModule), 
  },
  {
    path: 'leave-approval',
    canActivate: [AuthGuard],
    component: LeaveApprovalComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacultyRoutingModule { }
