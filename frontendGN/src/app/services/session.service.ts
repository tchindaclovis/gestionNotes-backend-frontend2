import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SessionInfo {
  name: string;
  semester: string;
  startDate: string;
  endDate: string;
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubjects: number;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionInfoSubject = new BehaviorSubject<SessionInfo>({
    name: 'Session Académique 2023-2024',
    semester: 'Semestre 1',
    startDate: '2023-09-01',
    endDate: '2024-01-31',
    totalStudents: 150,
    totalTeachers: 25,
    totalClasses: 12,
    totalSubjects: 15
  });

  public sessionInfo$ = this.sessionInfoSubject.asObservable();

  getSessionInfo(): SessionInfo {
    return this.sessionInfoSubject.value;
  }

  updateSessionInfo(sessionInfo: Partial<SessionInfo>): void {
    const current = this.sessionInfoSubject.value;
    this.sessionInfoSubject.next({ ...current, ...sessionInfo });
  }
}