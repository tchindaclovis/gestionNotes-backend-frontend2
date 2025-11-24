import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilePhotoService {
  private photoUpdated = new BehaviorSubject<string>('');
  public photoUpdated$ = this.photoUpdated.asObservable();

  updatePhoto(userId: number, photoData: string): void {
    localStorage.setItem(`profile_photo_${userId}`, photoData);
    this.photoUpdated.next(photoData);
  }

  getPhoto(userId: number): string | null {
    return localStorage.getItem(`profile_photo_${userId}`);
  }

  removePhoto(userId: number): void {
    localStorage.removeItem(`profile_photo_${userId}`);
    this.photoUpdated.next('');
  }
}