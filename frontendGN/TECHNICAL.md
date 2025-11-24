# Documentation Technique - Frontend Gestion des Notes

## Architecture

### Structure des composants
```
app/
├── components/
│   ├── login/              # Page de connexion
│   ├── dashboard/          # Tableau de bord principal
│   └── notification/       # Système de notifications
├── services/
│   ├── auth.service.ts     # Gestion de l'authentification
│   ├── user.service.ts     # Gestion des utilisateurs
│   ├── session.service.ts  # Gestion des sessions
│   └── error.service.ts    # Gestion des erreurs
├── guards/
│   └── auth.guard.ts       # Protection des routes
└── models/
    └── user.model.ts       # Modèles de données
```

### Services principaux

#### AuthService
- Gestion de l'authentification JWT
- Stockage sécurisé du token
- Décodage automatique des informations utilisateur
- Observable pour l'état de connexion

#### SessionService
- Gestion des informations de session académique
- Statistiques en temps réel
- Configuration centralisée

#### ErrorService
- Système de notification global
- Types de messages : error, success, warning, info
- Auto-suppression après 5 secondes

### Sécurité

#### Guards
- `authGuard` : Protège les routes authentifiées
- `loginGuard` : Redirige si déjà connecté

#### Intercepteurs
- `authInterceptor` : Ajoute automatiquement le token JWT

### Styles et Design

#### Variables CSS
- Palette de couleurs cohérente
- Système de design tokens
- Support du mode sombre (préparé)

#### Responsive Design
- Mobile-first approach
- Breakpoints optimisés
- Sidebar adaptative

### API Integration

#### Endpoints utilisés
```typescript
POST /api/auth/signin     # Authentification
GET  /api/user/profile    # Profil utilisateur
GET  /api/admin/users     # Liste des utilisateurs
```

#### Format des réponses
```typescript
// Authentification
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer"
}

// Utilisateur
{
  "id": 1,
  "username": "admin",
  "firstname": "Admin",
  "lastname": "User",
  "email": "admin@example.com",
  "role": "ADMIN"
}
```

### État de l'application

#### Gestion d'état
- Services avec BehaviorSubject
- Observables pour la réactivité
- LocalStorage pour la persistance

#### Flux de données
```
Component → Service → HTTP → Backend
    ↑         ↓
Observable ← BehaviorSubject
```

### Performance

#### Optimisations
- Lazy loading des modules
- OnPush change detection (préparé)
- Standalone components
- Tree shaking automatique

#### Bundle size
- Angular 17 avec Ivy renderer
- Imports optimisés
- CSS variables pour réduire la duplication

### Tests (à implémenter)

#### Structure de tests
```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   │   ├── login.component.spec.ts
│   │   │   └── login.component.ts
│   │   └── dashboard/
│   │       ├── dashboard.component.spec.ts
│   │       └── dashboard.component.ts
│   └── services/
│       ├── auth.service.spec.ts
│       └── user.service.spec.ts
```

### Déploiement

#### Build de production
```bash
ng build --configuration production
```

#### Variables d'environnement
- `environment.ts` : Développement
- `environment.prod.ts` : Production

#### Optimisations de build
- Minification automatique
- Compression gzip
- Source maps pour le debug

### Maintenance

#### Conventions de code
- TypeScript strict mode
- ESLint configuration
- Prettier pour le formatage

#### Monitoring
- Console logs structurés
- Error tracking (à implémenter)
- Performance metrics (à implémenter)

### Évolutions futures

#### Fonctionnalités prévues
- [ ] Gestion complète des étudiants
- [ ] Interface de saisie des notes
- [ ] Génération de rapports
- [ ] Notifications push
- [ ] Mode hors ligne
- [ ] Thème sombre
- [ ] Internationalisation (i18n)

#### Améliorations techniques
- [ ] Tests unitaires complets
- [ ] Tests e2e avec Cypress
- [ ] PWA capabilities
- [ ] State management avec NgRx
- [ ] Micro-frontends architecture