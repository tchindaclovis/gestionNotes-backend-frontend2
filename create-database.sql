-- Script de création de la base de données PostgreSQL
-- Exécuter avec: psql -U postgres -f create-database.sql

-- Créer la base de données
CREATE DATABASE "GradeManagement_db"
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

-- Se connecter à la base de données
\c "GradeManagement_db";

-- Créer l'utilisateur si nécessaire (optionnel)
-- CREATE USER app_user WITH PASSWORD 'postgres123';
-- GRANT ALL PRIVILEGES ON DATABASE "GradeManagement_db" TO app_user;

-- Vérifier la création
SELECT 'Base de données GradeManagement_db créée avec succès!' as message;