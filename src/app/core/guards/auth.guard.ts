import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { ROLES } from '../constants/roles';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private storage: StorageService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const isLoggedIn = await this.storage.isLoggedIn();

    if (!isLoggedIn) {
      return this.router.createUrlTree(['/login']);
    }

    const role = await this.storage.getRole();
    const allowedRoles = route.data['roles'] as string[] | undefined;

    if (!allowedRoles || !role) {
      return true;
    }

    if (allowedRoles.includes(role)) {
      return true;
    }

    if (role === ROLES.ADMIN) {
      return this.router.createUrlTree(['/admin/dashboard']);
    }

    if (role === ROLES.TEACHER) {
      return this.router.createUrlTree(['/teacher/dashboard']);
    }

    if (role === ROLES.STUDENT) {
      return this.router.createUrlTree(['/student/dashboard']);
    }

    return this.router.createUrlTree(['/login']);
  }

}
