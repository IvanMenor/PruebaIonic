import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { Router } from '@angular/router';

import {
  IonContent,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';

import { eyeOutline, eyeOffOutline, schoolOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

import { AuthService } from '../../core/services/auth.service';
import { ROLES } from '../../core/constants/roles';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    IonContent,
    IonInput,
    IonButton,
    IonCard,
    IonCardContent,
    IonIcon
  ]
})
export class LoginPage {

  loginForm: FormGroup;

  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {

    addIcons({
      eyeOutline,
      eyeOffOutline,
      schoolOutline
    });

    this.loginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]

    });

  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...'
    });

    await loading.present();

    try {
      const credentials = this.loginForm.value;
      const response = await this.authService.login(credentials);

      let targetRoute = '/login';
      if (response.role === ROLES.ADMIN) {
        targetRoute = '/admin/dashboard';
      } else if (response.role === ROLES.TEACHER) {
        targetRoute = '/teacher/dashboard';
      } else if (response.role === ROLES.STUDENT) {
        targetRoute = '/student/dashboard';
      }

      await this.router.navigateByUrl(targetRoute, { replaceUrl: true });
    } catch (error) {
      await this.toastCtrl.create({
        message: 'Credenciales incorrectas o error de conexión.',
        duration: 3000,
        color: 'danger'
      }).then(toast => toast.present());
    } finally {
      await loading.dismiss();
    }
  }

}