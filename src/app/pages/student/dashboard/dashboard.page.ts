import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  bookOutline,
  checkmarkCircleOutline,
  closeOutline,
  cloudUploadOutline,
  logOutOutline,
  refreshOutline,
  ribbonOutline,
  schoolOutline,
  timeOutline
} from 'ionicons/icons';

import {
  StudentWorkspace,
  StudentWorkspaceActivity,
  StudentWorkspaceCourse,
  StudentWorkspaceTimelineItem
} from '../../../core/models/student-workspace.model';
import { StudentWorkspaceService } from '../../../core/services/student-workspace.service';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonChip,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonProgressBar,
    IonRefresher,
    IonRefresherContent,
    IonSegment,
    IonSegmentButton,
    IonSpinner,
    IonTextarea,
    IonTitle,
    IonToolbar
  ]
})
export class DashboardPage implements OnInit {

  workspace: StudentWorkspace | null = null;
  activeSegment: 'overview' | 'courses' | 'activities' | 'timeline' = 'overview';
  isLoading = true;
  errorMessage = '';
  selectedActivity: StudentWorkspaceActivity | null = null;
  submission = {
    comentarioAlumno: '',
    archivoUrl: ''
  };

  constructor(
    private workspaceService: StudentWorkspaceService,
    private storage: StorageService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({
      alertCircleOutline,
      bookOutline,
      checkmarkCircleOutline,
      closeOutline,
      cloudUploadOutline,
      logOutOutline,
      refreshOutline,
      ribbonOutline,
      schoolOutline,
      timeOutline
    });
  }

  ngOnInit(): void {
    void this.loadWorkspace();
  }

  async loadWorkspace(showLoading = true): Promise<void> {
    if (showLoading) {
      this.isLoading = true;
    }

    this.errorMessage = '';

    try {
      this.workspace = await firstValueFrom(this.workspaceService.getWorkspace());
    } catch (error) {
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  async refresh(event: CustomEvent): Promise<void> {
    await this.loadWorkspace(false);
    const target = event.target as HTMLIonRefresherElement;
    await target.complete();
  }

  openSubmission(activity: StudentWorkspaceActivity): void {
    this.selectedActivity = activity;
    this.submission = {
      comentarioAlumno: activity.delivery?.studentComment ?? '',
      archivoUrl: activity.delivery?.fileUrl ?? ''
    };
  }

  closeSubmission(): void {
    this.selectedActivity = null;
    this.submission = {
      comentarioAlumno: '',
      archivoUrl: ''
    };
  }

  async submitSelectedActivity(): Promise<void> {
    if (!this.selectedActivity) {
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Enviando actividad...'
    });
    await loading.present();

    try {
      await firstValueFrom(
        this.workspaceService.submitActivity(this.selectedActivity.id, this.submission)
      );

      this.closeSubmission();
      await this.loadWorkspace(false);
      await this.showToast('Actividad enviada correctamente.', 'success');
    } catch (error) {
      await this.showToast(this.getErrorMessage(error), 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async logout(): Promise<void> {
    await this.storage.clear();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  pendingActivities(activities: StudentWorkspaceActivity[]): StudentWorkspaceActivity[] {
    return activities.filter((activity) => this.canSubmit(activity));
  }

  canSubmit(activity: StudentWorkspaceActivity): boolean {
    const status = activity.status.toUpperCase();
    return !activity.delivery && !['ENTREGADO', 'REVISADO', 'CALIFICADA', 'CALIFICADO'].includes(status);
  }

  activityButtonLabel(activity: StudentWorkspaceActivity): string {
    return this.canSubmit(activity) ? 'Entregar' : 'Ver detalle';
  }

  formatDate(value: string | null): string {
    if (!value) {
      return 'Sin fecha';
    }

    return new Date(value).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatGrade(value: number | null): string {
    return value === null ? '--' : value.toFixed(1);
  }

  statusColor(status: string | null): string {
    const normalized = (status ?? '').toUpperCase();

    if (['CALIFICADA', 'CALIFICADO', 'REVISADO'].includes(normalized)) {
      return 'success';
    }

    if (['ENTREGADO', 'ATRASADO'].includes(normalized)) {
      return 'primary';
    }

    if (normalized === 'VENCIDA') {
      return 'danger';
    }

    return 'warning';
  }

  trackCourse(_index: number, course: StudentWorkspaceCourse): number {
    return course.matriculaId;
  }

  trackActivity(_index: number, activity: StudentWorkspaceActivity): number {
    return activity.id;
  }

  trackTimeline(_index: number, item: StudentWorkspaceTimelineItem): string {
    return item.id;
  }

  private async showToast(message: string, color: 'success' | 'danger'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2600,
      color,
      position: 'top'
    });

    await toast.present();
  }

  private getErrorMessage(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const response = error as { error?: { mensaje?: string; message?: string; error?: string } | string };

      if (typeof response.error === 'string') {
        return response.error;
      }

      return response.error?.mensaje ?? response.error?.message ?? response.error?.error ?? 'No se pudo cargar la informacion.';
    }

    return 'No se pudo cargar la informacion.';
  }

}
