import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  GradeSubmissionPayload,
  TeacherActivityOption,
  TeacherActivityPayload,
  TeacherWorkspace
} from '../models/teacher-workspace.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherWorkspaceService {

  private readonly apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getWorkspace(): Observable<TeacherWorkspace> {
    return this.http.get<TeacherWorkspace>(`${this.apiUrl}/docente/workspace`);
  }

  getActivityOptions(): Observable<TeacherActivityOption[]> {
    return this.http.get<TeacherActivityOption[]>(`${this.apiUrl}/docente/actividad-opciones`);
  }

  createActivity(payload: TeacherActivityPayload): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/docente/actividades`, payload);
  }

  gradeSubmission(deliveryId: number, payload: GradeSubmissionPayload): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/entregas/${deliveryId}/calificar`, payload);
  }

}
