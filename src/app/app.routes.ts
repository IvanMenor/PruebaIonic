import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ROLES } from './core/constants/roles';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage)
  },

  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./pages/admin/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [AuthGuard],
    data: {
      roles: [ROLES.ADMIN]
    }
  },

  {
    path: 'teacher/dashboard',
    loadComponent: () =>
      import('./pages/teacher/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [AuthGuard],
    data: {
      roles: [ROLES.TEACHER]
    }
  },

  {
    path: 'student/dashboard',
    loadComponent: () =>
      import('./pages/student/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [AuthGuard],
    data: {
      roles: [ROLES.STUDENT]
    }
  },

  {
    path: 'courses',
    loadComponent: () =>
      import('./pages/courses/courses.page').then(m => m.CoursesPage),
    canActivate: [AuthGuard]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];