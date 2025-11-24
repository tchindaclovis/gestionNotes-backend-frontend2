# Frontend Gestion des Notes

Application Angular moderne pour la gestion des notes scolaires avec une interface professionnelle et responsive.

## ✨ Fonctionnalités

- 🔐 **Page de connexion** : Authentification sécurisée avec JWT
- 📊 **Dashboard principal** : Interface single-page avec sidebar collapsible
- 👤 **Profil utilisateur** : Affichage de la photo, nom et rôle
- 📚 **Informations de session** : Statistiques et détails académiques
- 🎨 **Design professionnel** : Interface moderne, responsive et accessible
- 🔒 **Sécurité** : Guards de route et intercepteurs HTTP
- 🌐 **Multi-rôles** : Support Admin, Enseignant, Étudiant

## 📦 Installation détaillée

### Prérequis
- Node.js 18+ 
- npm 9+
- Angular CLI 17+

### Installation
```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer en mode développement
npm start

# 3. Ouvrir http://localhost:4200
```

### Build de production
```bash
npm run build
```

## 🚀 Démarrage rapide

### Méthode 1 : Script automatique
```bash
# Double-cliquez sur start.bat (Windows)
# ou exécutez :
start.bat
```

### Méthode 2 : Commandes manuelles
```bash
npm install
npm start
```

## Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/          # Composant de connexion
│   │   └── dashboard/      # Composant dashboard principal
│   ├── services/
│   │   ├── auth.service.ts # Service d'authentification
│   │   ├── user.service.ts # Service utilisateur
│   │   ├── session.service.ts # Service de session
│   │   └── auth.interceptor.ts # Intercepteur JWT
│   ├── guards/
│   │   └── auth.guard.ts   # Guards de protection des routes
│   ├── models/
│   │   └── user.model.ts   # Modèles TypeScript
│   └── app.routes.ts       # Configuration des routes
└── styles.css              # Styles globaux
```

## Configuration Backend

L'application est configurée pour se connecter au backend Spring Boot sur `http://localhost:8080`

## Authentification

- Endpoint de connexion : `POST /api/auth/signin`
- Format de la requête :
```json
{
  "username": "admin",
  "password": "password"
}
```

## 👥 Utilisateurs de test

Selon la configuration du backend :
- **Admin** : `admin` / `password` (configuré dans AdminInitializer)
- **Enseignant** : Comptes créés via l'interface admin
- **Étudiant** : Comptes créés via l'interface admin

## Fonctionnalités du Dashboard

- **Sidebar** : Navigation avec possibilité de réduire/étendre
- **Header** : Nom de session, photo de profil, nom et rôle utilisateur
- **Bouton de déconnexion** : En bas de la sidebar
- **Informations de session** : Statistiques et détails de la session
- **Activité récente** : Historique des dernières actions

## 📱 Responsive Design

L'interface s'adapte automatiquement :
- 🖥️ **Desktop** : Sidebar complète avec navigation étendue
- 📱 **Mobile** : Sidebar collapsible avec navigation optimisée
- 📊 **Tablet** : Grille adaptative pour les statistiques

## 🛠️ Technologies utilisées

- **Angular 17** : Framework principal
- **TypeScript** : Langage de développement
- **RxJS** : Programmation réactive
- **CSS3** : Styles modernes avec variables CSS
- **Font Awesome** : Icônes professionnelles
- **Inter Font** : Typographie moderne

## 🔧 Architecture

```
src/app/
├── components/     # Composants UI
├── services/       # Services métier
├── guards/         # Protection des routes
├── models/         # Modèles TypeScript
└── environments/   # Configuration
```

## 🎯 Prochaines étapes

- [ ] Gestion des étudiants
- [ ] Gestion des notes
- [ ] Rapports et statistiques
- [ ] Notifications en temps réel
- [ ] Export PDF/Excel