export interface TeacherWorkspace {
  students: TeacherStudentsSection;
  tasks: TeacherTasksSection;
  attendance: TeacherAttendanceSection;
  grades: TeacherGradesSection;
}

export interface TeacherStat {
  label: string;
  value: string | number;
  subtext: string | null;
  iconName: string;
}

export interface TeacherStudentsSection {
  stats: TeacherStat[];
  students: TeacherStudent[];
  alerts: TeacherStudentAlert[];
}

export interface TeacherStudent {
  id: string;
  name: string;
  email: string;
  code: string;
  course: string;
  group: string;
  averageGrade: number | null;
  attendance: number | null;
  status: string;
}

export interface TeacherStudentAlert {
  id: string;
  studentName: string;
  timeText: string;
  description: string;
  metaLabel: string;
  metaValue: string;
  type: string;
}

export interface TeacherTasksSection {
  stats: TeacherStat[];
  tasks: TeacherTask[];
  recentSubmissions: TeacherRecentSubmission[];
  urgentTasks: TeacherUrgentTask[];
}

export interface TeacherTask {
  id: string;
  name: string;
  course: string;
  group: string;
  publishedDate: string;
  limitDate: string;
  receivedCount: number;
  totalCount: number;
  status: string;
}

export interface TeacherRecentSubmission {
  id: string;
  deliveryId: number;
  studentName: string;
  taskName: string;
  courseName: string;
  timeAgo: string;
  status: string;
  maxGrade: number | null;
  grade: number | null;
  studentComment: string | null;
  teacherComment: string | null;
  fileUrl: string | null;
}

export interface TeacherUrgentTask {
  id: string;
  title: string;
  courseName: string;
  dueText: string;
  receivedCount: number;
  totalCount: number;
  percentage: number;
}

export interface TeacherAttendanceSection {
  stats: TeacherStat[];
  attendanceList: TeacherAttendanceRow[];
}

export interface TeacherAttendanceRow {
  id: string;
  name: string;
  email: string;
  code: string;
  course: string;
  group: string;
  attendance: number | null;
  todayStatus: string;
}

export interface TeacherGradesSection {
  stats: TeacherStat[];
  grades: TeacherGrade[];
  distribution: TeacherGradeDistribution[];
}

export interface TeacherGrade {
  id: string;
  name: string;
  code: string;
  course: string;
  group: string;
  pc1: number;
  pc2: number;
  parcial: number;
  finalGrade: number;
  average: number;
  status: string;
}

export interface TeacherGradeDistribution {
  label: string;
  count: number;
  percent: number;
  color: string;
  bgBadge: string;
}

export interface TeacherActivityOption {
  seccionId: number;
  cursoCodigo: string;
  cursoNombre: string;
  seccionNombre: string;
}

export interface TeacherActivityPayload {
  seccionId: number | null;
  numeroSemana: number;
  titulo: string;
  descripcion: string;
  tipo: 'TAREA' | 'PC' | 'PROYECTO' | 'PRACTICA' | 'EXAMEN';
  fechaLimite: string;
  calificada: boolean;
  notaMaxima: number;
  visible: boolean;
}

export interface GradeSubmissionPayload {
  nota: number;
  comentario: string;
}
