//Guarda token JWT (usuario, rol y obtiene base de datos y cierra sesión)
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { User } from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';
  private readonly ROLE_KEY = 'role';

  constructor() { }

  // ==========================
  // TOKEN
  // ==========================

  async saveToken(token: string): Promise<void> {
    await Preferences.set({
      key: this.TOKEN_KEY,
      value: token
    });
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({
      key: this.TOKEN_KEY
    });

    return value;
  }

  // ==========================
  // USER
  // ==========================

  async saveUser(user: User): Promise<void> {
    await Preferences.set({
      key: this.USER_KEY,
      value: JSON.stringify(user)
    });
  }

  async getUser(): Promise<User | null> {
    const { value } = await Preferences.get({
      key: this.USER_KEY
    });

    return value ? JSON.parse(value) : null;
  }

  // ==========================
  // ROLE
  // ==========================

  async saveRole(role: string): Promise<void> {
    await Preferences.set({
      key: this.ROLE_KEY,
      value: role
    });
  }

  async getRole(): Promise<string | null> {
    const { value } = await Preferences.get({
      key: this.ROLE_KEY
    });

    return value;
  }

  // ==========================
  // SESSION
  // ==========================

  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }

  async clear(): Promise<void> {
    await Preferences.clear();
  }

}