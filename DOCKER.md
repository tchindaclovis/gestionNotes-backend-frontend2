# 🐳 Docker - Gestion des Notes

## Démarrage rapide

### 1. Démarrer l'application complète
```bash
docker-compose up --build
```

OU double-cliquez sur `docker-start.bat`

### 2. Accéder à l'application
- **Frontend** : http://localhost
- **Backend API** : http://localhost:8080
- **Base de données** : localhost:5432

### 3. Arrêter l'application
```bash
docker-compose down
```

OU double-cliquez sur `docker-stop.bat`

## Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 80 | Interface Angular avec Nginx |
| Backend | 8080 | API Spring Boot |
| Database | 5432 | PostgreSQL |

## Connexion par défaut
- **Username** : admin
- **Password** : password

## Commandes utiles

### Voir les logs
```bash
docker-compose logs -f
```

### Reconstruire un service
```bash
docker-compose build backend
docker-compose build frontend
```

### Accéder à la base de données
```bash
docker exec -it gestion-notes-db psql -U postgres -d gestion_notes
```

### Nettoyer Docker
```bash
docker-compose down -v
docker system prune -a
```

## Volumes
- `postgres_data` : Données persistantes de PostgreSQL

## Réseau
- `gestion-notes-network` : Réseau interne pour la communication entre services