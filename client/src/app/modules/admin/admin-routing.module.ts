import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AddUserComponent } from './components/add-user/add-user.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LeaveReportsComponent } from './components/leave-reports/leave-reports.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';

const routes: Routes = [
  { 
    path: '',
    redirectTo: '/admin/dashboard',
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
    path: 'manage-users', 
    canActivate: [AuthGuard],
    component: ManageUsersComponent
  },
  { 
    path: 'add-user', 
    canActivate: [AuthGuard],
    component: AddUserComponent
  },
  { 
    path: 'update-user/:id',
    canActivate: [AuthGuard],
    component: AddUserComponent
  },
  { 
    path: 'leave-reports', 
    canActivate: [AuthGuard],
    component: LeaveReportsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
