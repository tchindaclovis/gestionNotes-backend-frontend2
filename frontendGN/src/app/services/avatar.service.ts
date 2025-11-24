import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  generateAvatar(firstname: string, lastname: string, size: number = 100): string {
    const initials = this.getInitials(firstname, lastname);
    const colors = this.getColorFromName(firstname + lastname);
    
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="url(#grad)" />
        <text x="50%" y="50%" text-anchor="middle" dy="0.35em" 
              font-family="Arial, sans-serif" font-size="${size * 0.4}" 
              font-weight="600" fill="white">${initials}</text>
      </svg>
    `;
    
    return 'data:image/svg+xml;base64,' + btoa(svg);
  }

  private getInitials(firstname: string, lastname: string): string {
    if (!firstname || !lastname) return 'U';
    return (firstname.charAt(0) + lastname.charAt(0)).toUpperCase();
  }

  private getColorFromName(name: string): { primary: string; secondary: string } {
    const colorPairs = [
      { primary: '#3b82f6', secondary: '#1d4ed8' }, // Bleu
      { primary: '#10b981', secondary: '#059669' }, // Vert
      { primary: '#8b5cf6', secondary: '#7c3aed' }, // Violet
      { primary: '#f59e0b', secondary: '#d97706' }, // Orange
      { primary: '#ef4444', secondary: '#dc2626' }, // Rouge
      { primary: '#06b6d4', secondary: '#0891b2' }, // Cyan
      { primary: '#84cc16', secondary: '#65a30d' }, // Lime
      { primary: '#f97316', secondary: '#ea580c' }, // Orange foncé
      { primary: '#ec4899', secondary: '#db2777' }, // Rose
      { primary: '#6366f1', secondary: '#4f46e5' }, // Indigo
      { primary: '#14b8a6', secondary: '#0d9488' }, // Teal
      { primary: '#f472b6', secondary: '#e879f9' }  // Fuchsia
    ];

    // Améliorer l'algorithme de hash pour plus de variété
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir en 32bit
    }
    
    // Ajouter une variation basée sur la longueur du nom
    hash += name.length * 31;
    
    const index = Math.abs(hash) % colorPairs.length;
    return colorPairs[index];
  }

  getProfileImageUrl(firstname: string, lastname: string): string {
    return this.generateAvatar(firstname, lastname, 150);
  }
}