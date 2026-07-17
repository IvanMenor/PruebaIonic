import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Teacher } from '../models/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private apiUrl = `${environment.apiUrl}/api/docentes`;

  constructor(private http: HttpClient) {}

  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.apiUrl);
  }

  createTeacher(teacher: Teacher): Observable<Teacher> {
    return this.http.post<Teacher>(this.apiUrl, teacher);
  }

}