import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: LoginComponent
  },
  { 
    path: 'admin',
    loadChildren: () => 
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
  { 
    path: 'faculty',
    loadChildren: () => 
      import('./modules/faculty/faculty.module').then((m) => m.FacultyModule),
  },
  { 
    path: 'student',
    loadChildren: () => 
      import('./modules/student/student.module').then((m) => m.StudentModule),
  },
  { 
    path: '**', 
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
