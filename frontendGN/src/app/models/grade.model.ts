export interface Grade {
  id: number;
  value: number;
  coefficient: number;
  comment?: string;
  date: string;
  studentId: number;
  subjectId: number;
  teacherId: number;
  studentName?: string;
  subjectName?: string;
  teacherName?: string;
}

export interface Subject {
  id: number;
  name: string;
  subjectCode: string;
  coefficient: number;
  description?: string;
}

export interface SubjectRequest {
  subjectCode: string;
  name: string;
  coefficient: number;
  description: string;
}

export interface GradeRequest {
  value: number;
  date: string;
  comment?: string;
  studentIdNum: string;
  subjectCode: string;
  recordedBy?: string;
}

export interface Class {
  id: number;
  name: string;
  level: string;
  academicYear: string;
}

export interface GradeStats {
  average: number;
  min: number;
  max: number;
  count: number;
  subjectName: string;
}