export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  role: Role;
}

export interface StudentRequest {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  studentIdNum: string;
}

export interface TeacherRequest {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  teacherIdNum: string;
}

export interface UserResponse {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  role: Role;
}

export enum Role {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER'
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthUser {
  user: User;
  token: string;
}