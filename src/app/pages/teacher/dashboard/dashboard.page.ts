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
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  alertCircleOutline,
  bookOutline,
  checkmarkCircleOutline,
  closeOutline,
  documentTextOutline,
  logOutOutline,
  sendOutline,
  starOutline
} from 'ionicons/icons';

import {
  TeacherActivityOption,
  TeacherActivityPayload,
  TeacherRecentSubmission,
  TeacherStat,
  TeacherStudent,
  TeacherTask,
  TeacherWorkspace
} from '../../../core/models/teacher-workspace.model';
import { TeacherWorkspaceService } from '../../../core/services/teacher-workspace.service';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-teacher-dashboard',
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
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonTextarea,
    IonTitle,
    IonToolbar
  ]
})
export class DashboardPage implements OnInit {

  workspace: TeacherWorkspace | null = null;
  activityOptions: TeacherActivityOption[] = [];
  activeSegment: 'overview' | 'students' | 'tasks' | 'reviews' = 'overview';
  isLoading = true;
  errorMessage = '';
  createModalOpen = false;
  selectedSubmission: TeacherRecentSubmission | null = null;
  activityForm: TeacherActivityPayload = this.emptyActivityForm();
  gradeForm = {
    nota: 0,
    comentario: ''
  };

  constructor(
    private workspaceService: TeacherWorkspaceService,
    private storage: StorageService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({
      addOutline,
      alertCircleOutline,
      bookOutline,
      checkmarkCircleOutline,
      closeOutline,
      documentTextOutline,
      logOutOutline,
      sendOutline,
      starOutline
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
      const [workspace, options] = await Promise.all([
        firstValueFrom(this.workspaceService.getWorkspace()),
        firstValueFrom(this.workspaceService.getActivityOptions())
      ]);

      this.workspace = workspace;
      this.activityOptions = options;
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

  openCreateActivity(): void {
    this.activityForm = this.emptyActivityForm();
    this.createModalOpen = true;
  }

  closeCreateActivity(): void {
    this.createModalOpen = false;
  }

  async createActivity(): Promise<void> {
    if (this.activityForm.seccionId === null || !this.activityForm.titulo || !this.activityForm.fechaLimite) {
      await this.showToast('Completa seccion, titulo y fecha limite.', 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creando actividad...'
    });
    await loading.present();

    try {
      await firstValueFrom(this.workspaceService.createActivity(this.activityForm));
      this.closeCreateActivity();
      await this.loadWorkspace(false);
      await this.showToast('Actividad creada para tus estudiantes.', 'success');
    } catch (error) {
      await this.showToast(this.getErrorMessage(error), 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  openGradeSubmission(submission: TeacherRecentSubmission): void {
    this.selectedSubmission = submission;
    this.gradeForm = {
      nota: submission.grade ?? submission.maxGrade ?? 20,
      comentario: submission.teacherComment ?? ''
    };
  }

  closeGradeSubmission(): void {
    this.selectedSubmission = null;
    this.gradeForm = {
      nota: 0,
      comentario: ''
    };
  }

  async gradeSelectedSubmission(): Promise<void> {
    if (!this.selectedSubmission) {
      return;
    }

    const maxGrade = this.selectedSubmission.maxGrade ?? 20;

    if (this.gradeForm.nota < 0 || this.gradeForm.nota > maxGrade) {
      await this.showToast(`La nota debe estar entre 0 y ${maxGrade}.`, 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Guardando calificacion...'
    });
    await loading.present();

    try {
      await firstValueFrom(
        this.workspaceService.gradeSubmission(this.selectedSubmission.deliveryId, this.gradeForm)
      );

      this.closeGradeSubmission();
      await this.loadWorkspace(false);
      await this.showToast('Calificacion guardada.', 'success');
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

  pendingSubmissions(submissions: TeacherRecentSubmission[]): TeacherRecentSubmission[] {
    return submissions.filter((submission) => submission.status.toUpperCase() !== 'REVISADO');
  }

  statValue(stat: TeacherStat): string {
    return String(stat.value);
  }

  formatPercent(value: number | null): string {
    return value === null ? '--' : `${value}%`;
  }

  formatGrade(value: number | null): string {
    return value === null ? '--' : value.toFixed(1);
  }

  statusColor(status: string): string {
    const normalized = status.toUpperCase();

    if (['ACTIVO', 'EN PROGRESO', 'REVISADO', 'EVALUADO'].includes(normalized)) {
      return 'success';
    }

    if (['PENDIENTE', 'SIN EVALUAR', 'ENTREGADO'].includes(normalized)) {
      return 'warning';
    }

    if (['EN RIESGO', 'VENCIDO', 'URGENTE'].includes(normalized)) {
      return 'danger';
    }

    return 'primary';
  }

  trackStat(index: number): number {
    return index;
  }

  trackStudent(_index: number, student: TeacherStudent): string {
    return student.id;
  }

  trackTask(_index: number, task: TeacherTask): string {
    return task.id;
  }

  trackSubmission(_index: number, submission: TeacherRecentSubmission): number {
    return submission.deliveryId;
  }

  trackOption(_index: number, option: TeacherActivityOption): number {
    return option.seccionId;
  }

  private emptyActivityForm(): TeacherActivityPayload {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    tomorrow.setMinutes(tomorrow.getMinutes() - tomorrow.getTimezoneOffset());

    return {
      seccionId: null,
      numeroSemana: 1,
      titulo: '',
      descripcion: '',
      tipo: 'TAREA',
      fechaLimite: tomorrow.toISOString().slice(0, 16),
      calificada: true,
      notaMaxima: 20,
      visible: true
    };
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
      const response = error as { error?: { mensaje?: string; message?: string; error?: string; detail?: string } | string };

      if (typeof response.error === 'string') {
        return response.error;
      }

      return response.error?.mensaje
        ?? response.error?.message
        ?? response.error?.error
        ?? response.error?.detail
        ?? 'No se pudo cargar la informacion.';
    }

    return 'No se pudo cargar la informacion.';
  }

}
