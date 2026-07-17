export interface StudentWorkspace {
  profile: StudentProfile;
  summary: StudentSummary;
  courses: StudentWorkspaceCourse[];
  activities: StudentWorkspaceActivity[];
  alerts: StudentWorkspaceAlert[];
  timeline: StudentWorkspaceTimelineItem[];
}

export interface StudentProfile {
  estudianteId: number;
  userId: number;
  fullName: string;
  email: string;
  code: string;
  academicStatus: string;
}

export interface StudentSummary {
  activeCourses: number;
  pendingActivities: number;
  deliveredActivities: number;
  gradedActivities: number;
  averageGrade: number | null;
  attendancePercent: number | null;
  alertsCount: number;
}

export interface StudentWorkspaceCourse {
  matriculaId: number;
  courseId: number;
  sectionId: number;
  code: string;
  name: string;
  description: string;
  credits: number;
  sectionName: string;
  period: string;
  teacherName: string;
  activitiesCount: number;
  pendingActivities: number;
  averageGrade: number | null;
  attendancePercent: number | null;
  progress: number;
}

export interface StudentWorkspaceActivity {
  id: number;
  matriculaId: number;
  courseId: number;
  sectionId: number;
  courseCode: string;
  courseName: string;
  sectionName: string;
  title: string;
  description: string | null;
  type: string;
  dueDate: string;
  maxGrade: number;
  status: string;
  delivery: StudentActivityDelivery | null;
}

export interface StudentActivityDelivery {
  id: number;
  status: string;
  grade: number | null;
  submittedAt: string;
  studentComment: string | null;
  teacherComment: string | null;
  fileUrl: string | null;
}

export interface StudentWorkspaceAlert {
  id: number;
  matriculaId: number;
  type: string;
  description: string;
  date: string;
  courseName: string;
}

export interface StudentWorkspaceTimelineItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  date: string;
  courseName: string;
  grade: number | null;
  status: string | null;
}

export interface StudentActivitySubmissionPayload {
  comentarioAlumno: string;
  archivoUrl: string;
}
