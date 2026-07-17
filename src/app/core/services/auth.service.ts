//Guarda el toke, usuario, rol y redirige 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

import { LoginRequest, LoginResponse } from '../models/auth.models';
import { StorageService } from './storage.service';
import { User } from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await firstValueFrom(
      this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
    );

    await this.storage.saveToken(response.token);

    const user: User = {
      id: response.userId,
      email: response.email,
      name: response.name,
      role: response.role
    };

    await this.storage.saveUser(user);
    await this.storage.saveRole(response.role);

    return response;
  }

  async logout() {
    await this.storage.clear();
  }

}