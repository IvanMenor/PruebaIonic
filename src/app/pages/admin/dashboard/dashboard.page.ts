import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonInput,
  IonButton,
  IonList,
  IonLabel
} from '@ionic/angular/standalone';

import { StudentService } from '../../../core/services/student.service';
import { TeacherService } from '../../../core/services/teacher.service';
import { CourseService } from '../../../core/services/course.service';

import { Student } from '../../../core/models/student.model';
import { Teacher } from '../../../core/models/teacher.model';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [
    CommonModule,
    FormsModule,

    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,

    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,

    IonGrid,
    IonRow,
    IonCol,

    IonItem,
    IonInput,
    IonButton,
    IonList,
    IonLabel
  ]
})
export class DashboardPage implements OnInit {

  students: Student[] = [];
  teachers: Teacher[] = [];
  courses: Course[] = [];

  totalStudents = 0;
  totalTeachers = 0;
  totalCourses = 0;

  newStudent: Student = {
    usuario: {
      nombres: '',
      apellidos: '',
      email: '',
      password: '',
      estado: 'ACTIVO'
    },
    codigoEstudiante: '',
    estadoAcademico: 'REGULAR'
  };

  newTeacher: Teacher = {
    usuario: {
      nombres: '',
      apellidos: '',
      email: '',
      password: '',
      estado: 'ACTIVO'
    },
    codigoDocente: '',
    especialidad: ''
  };

  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loadStudents();
    this.loadTeachers();
    this.loadCourses();
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.totalStudents = data.length;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  loadTeachers(): void {
    this.teacherService.getTeachers().subscribe({
      next: (data) => {
        this.teachers = data;
        this.totalTeachers = data.length;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.totalCourses = data.length;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  createStudent(): void {

    this.studentService.createStudent(this.newStudent).subscribe({

      next: () => {

        this.loadStudents();

        this.newStudent = {
          usuario: {
            nombres: '',
            apellidos: '',
            email: '',
            password: '',
            estado: 'ACTIVO'
          },
          codigoEstudiante: '',
          estadoAcademico: 'REGULAR'
        };

      },
      error: (err) => console.error(err)

    });

  }

  createTeacher(): void {

    this.teacherService.createTeacher(this.newTeacher).subscribe({

      next: () => {

        this.loadTeachers();

        this.newTeacher = {
          usuario: {
            nombres: '',
            apellidos: '',
            email: '',
            password: '',
            estado: 'ACTIVO'
          },
          codigoDocente: '',
          especialidad: ''
        };

      },
      error: (err) => console.error(err)

    });

  }

}