# 🚀 Démarrage du Backend

## 1. Prérequis
- ☕ Java 17+
- 🐘 PostgreSQL en cours d'exécution
- 📦 Maven

## 2. Démarrage PostgreSQL
```bash
# Windows - Services
services.msc → PostgreSQL → Démarrer

# Ou via Docker
docker run --name postgres-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

## 3. Création de la base de données
```sql
-- Connectez-vous à PostgreSQL et créez la DB
CREATE DATABASE "GradeManagement_db";
```

## 4. Démarrage du Backend Spring Boot
```bash
# Dans le dossier racine du projet
cd gestion_des_notes-develop
mvn spring-boot:run

# Ou avec l'IDE
# Clic droit sur GestionDeNotesApplication.java → Run
```

## 5. Vérification
- 🌐 Backend : http://localhost:8083
- 📚 Swagger : http://localhost:8083/swagger-ui.html
- 🔑 Login API : http://localhost:8083/api/auth/signin

## 6. Si le backend ne démarre pas
Le frontend utilise une **authentification simulée** avec les comptes :
- 👨💼 **Admin** : darwin / darwin
- 👨🏫 **Enseignant** : teacher / teacher  
- 🎓 **Étudiant** : student / student

## 7. Logs utiles
```bash
# Vérifier si PostgreSQL écoute
netstat -an | findstr 5432

# Vérifier si le backend écoute
netstat -an | findstr 8083
```