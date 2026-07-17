import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  StudentActivityDelivery,
  StudentActivitySubmissionPayload,
  StudentWorkspace
} from '../models/student-workspace.model';

@Injectable({
  providedIn: 'root'
})
export class StudentWorkspaceService {

  private readonly apiUrl = `${environment.apiUrl}/api/alumno`;

  constructor(private http: HttpClient) {}

  getWorkspace(): Observable<StudentWorkspace> {
    return this.http.get<StudentWorkspace>(`${this.apiUrl}/workspace`);
  }

  submitActivity(
    activityId: number,
    payload: StudentActivitySubmissionPayload
  ): Observable<StudentActivityDelivery> {
    return this.http.post<StudentActivityDelivery>(
      `${this.apiUrl}/actividades/${activityId}/entrega`,
      payload
    );
  }

}
