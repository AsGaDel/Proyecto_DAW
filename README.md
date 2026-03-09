# Ayuntamiento — Plataforma de Gestión de Incidencias

Aplicación web para la gestión de incidencias urbanas y órdenes de trabajo de un ayuntamiento. Permite a los ciudadanos reportar incidencias, y a los trabajadores y administradores gestionarlas y resolverlas.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Backend | Django 5 + Django REST Framework |
| Autenticación | JWT (SimpleJWT) |
| Base de datos | PostgreSQL 16 |
| Cola de tareas | Celery + Redis 7 |
| WebSockets | Django Channels + Redis |
| Frontend | React 18 + Vite + Tailwind CSS |
| Infraestructura | Docker + Docker Compose |

## Servicios

| Servicio | Puerto |
|---|---|
| Frontend (React + Vite) | http://localhost:5173 |
| Backend (Django) | http://localhost:8000 |
| API Swagger | http://localhost:8000/api/schema/swagger-ui/ |
| Django Admin | http://localhost:8000/admin/ |

---

## Puesta en marcha

### Prerrequisitos

- [Docker](https://docs.docker.com/get-docker/) 25.0+ con Docker Compose 2.24+
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/AsGaDel/Proyecto_DAW.git
cd Proyecto_DAW
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y cambia al menos `SECRET_KEY` y las credenciales de la base de datos. Los valores por defecto funcionan para desarrollo local.

### 3. Construir y arrancar

```bash
docker compose build
docker compose up -d
```

### 4. Crear las migraciones e inicializar la base de datos

```bash
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
```

### 5. Crear superusuario

```bash
docker compose exec backend python manage.py createsuperuser
```

### 6. Verificar

```bash
docker compose ps
```

Todos los servicios deben aparecer como `Up`.

---

## Estructura del proyecto

```
ayuntamiento/
├── .env                        # Variables de entorno (NO subir a git)
├── .env.example                # Plantilla de variables (sí va a git)
├── .gitignore
├── docker-compose.yml
│
├── backend/
│   ├── Dockerfile
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/
│   │   ├── __init__.py         # Importa celery_app
│   │   ├── asgi.py             # Configurado para Django Channels
│   │   ├── celery.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── settings/
│   │       ├── base.py
│   │       ├── development.py
│   │       └── production.py
│   └── apps/
│       ├── users/              # Modelo de usuario personalizado + JWT
│       ├── incidents/          # Gestión de incidencias
│       ├── work_orders/        # Órdenes de trabajo
│       └── notifications/      # Notificaciones en tiempo real (WebSockets)
│
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js          # Proxy automático a Django
    ├── tailwind.config.js
    └── src/
        ├── api/
        │   └── axiosConfig.js  # Cliente HTTP con interceptores JWT
        ├── components/
        ├── pages/
        ├── store/
        └── utils/
```

---

## Comandos habituales

### Desarrollo

```bash
# Arrancar todo
docker compose up -d

# Ver logs en tiempo real
docker compose logs -f

# Ver logs de un servicio concreto
docker compose logs -f backend

# Estado de los servicios
docker compose ps
```

### Base de datos

```bash
# Crear migraciones tras modificar modelos
docker compose exec backend python manage.py makemigrations

# Aplicar migraciones
docker compose exec backend python manage.py migrate

# Acceder a la consola de PostgreSQL
docker compose exec db psql -U ayuntamiento_user -d ayuntamiento_db

# Shell interactivo de Django
docker compose exec backend python manage.py shell
```

### Dependencias

```bash
# Reconstruir imagen del backend (tras cambiar requirements.txt)
docker compose build backend
docker compose up -d backend

# Reconstruir imagen del frontend (tras cambiar package.json)
docker compose build frontend
docker compose up -d frontend
```

### Tests

```bash
docker compose exec backend python manage.py test
```

### Parar los servicios

```bash
# Parar sin borrar datos
docker compose down

# Parar y borrar volúmenes (borra la base de datos)
docker compose down -v
```

---

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `POSTGRES_DB` | Nombre de la base de datos | `ayuntamiento_db` |
| `POSTGRES_USER` | Usuario de PostgreSQL | `ayuntamiento_user` |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL | `ayuntamiento_pass` |
| `SECRET_KEY` | Clave secreta de Django | *(cambiar en producción)* |
| `DJANGO_SETTINGS_MODULE` | Módulo de settings activo | `config.settings.development` |
| `REDIS_URL` | URL de conexión a Redis | `redis://redis:6379/0` |
| `CORS_ALLOWED_ORIGINS` | Orígenes CORS permitidos | `http://localhost:5173` |
| `VITE_API_BASE_URL` | URL base de la API para el frontend | `http://localhost:8000/api` |

---

## Flujo de trabajo

```
1. docker compose up -d
2. Editar archivos en backend/ o frontend/src/ → hot-reload automático
3. Al añadir un modelo → makemigrations + migrate
4. Al añadir una dependencia Python → editar requirements.txt → build backend
5. Al terminar → docker compose down  (los datos persisten en el volumen)
```

---
