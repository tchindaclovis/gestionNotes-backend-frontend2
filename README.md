### Technology Stack
- **Backend**: Spring Boot 3.5.3, Spring Security, Spring Data JPA
- **Database**: PostgreSQL 14 with Flyway migrations
- **Authentication**: JWT tokens with role-based authorization
- **Documentation**: SpringDoc OpenAPI 3 (Swagger UI)
- **Build Tool**: Maven 4
- **Java Version**: JDK 17

### Access Application:
    - API Base URL: `http://localhost:4200/`
    - Swagger UI: `http://localhost:8083/swagger-ui.html`
    - API Docs: `http://localhost:8083/api-docs`


### JWT Token Usage
```bash
# Login
curl -X POST http://localhost:4200/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"clovis","password":"clovis"}'


