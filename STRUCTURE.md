# Estructura del Proyecto BackToBackup

## Visión General

Este es un monorepo que contiene tanto el backend (NestJS) como el frontend (Angular) de BackToBackup.

## Estructura de Directorios

```
backtobackup-api/
│
├── packages/                           # Paquetes del monorepo
│   ├── api/                           # Backend NestJS
│   │   ├── src/
│   │   │   ├── main/                  # Módulos principales
│   │   │   │   ├── admin/            # Módulo de administración
│   │   │   │   ├── auth/             # Autenticación y autorización
│   │   │   │   ├── database/         # Configuración de base de datos
│   │   │   │   └── device/           # Gestión de dispositivos
│   │   │   ├── app.module.ts         # Módulo raíz
│   │   │   ├── main.ts               # Punto de entrada
│   │   │   └── common-utils.ts       # Utilidades comunes
│   │   ├── test/                      # Tests E2E
│   │   ├── Dockerfile                 # Dockerfile para producción
│   │   ├── package.json              # Dependencias del backend
│   │   ├── tsconfig.json             # Configuración TypeScript
│   │   └── nest-cli.json             # Configuración NestJS CLI
│   │
│   └── frontend/                      # Frontend Angular
│       ├── src/
│       │   ├── app/
│       │   │   ├── api/              # Modelos generados desde Swagger (auto-generado)
│       │   │   ├── core/             # Funcionalidad core (auth, dashboard)
│       │   │   ├── features/         # Características de la aplicación
│       │   │   ├── shared/           # Componentes compartidos
│       │   │   └── themes/           # Temas visuales
│       │   ├── index.html            # HTML principal
│       │   ├── main.ts               # Punto de entrada
│       │   └── styles.css            # Estilos globales
│       ├── public/                    # Recursos estáticos
│       ├── Dockerfile                 # Dockerfile para producción
│       ├── nginx.conf                 # Configuración Nginx para producción
│       ├── package.json              # Dependencias del frontend
│       ├── angular.json              # Configuración Angular CLI
│       └── ng-openapi-gen.json       # Configuración generador de API
│
├── devops/                            # Configuración de despliegue
│   ├── docker-compose.yml            # Orquestación de servicios
│   ├── .env.example                  # Ejemplo de variables de entorno
│   ├── .env                          # Variables de entorno (no en git)
│   └── data/                         # Volúmenes de datos persistentes
│       ├── postgres/                 # Datos de PostgreSQL
│       └── minio/                    # Datos de MinIO
│
├── scripts/                           # Scripts útiles
│   ├── setup.sh                      # Script de configuración inicial
│   └── generate-api-models.sh       # Script para generar modelos de API
│
├── .gitignore                        # Archivos ignorados por Git
├── .dockerignore                     # Archivos ignorados por Docker
├── .env.example                      # Ejemplo de variables de entorno global
├── package.json                      # Configuración del monorepo
├── tsconfig.json                     # TypeScript config base
├── README.md                         # README de NestJS (original)
└── README-MONOREPO.md               # Documentación del monorepo
```

## Paquetes

### @backtobackup/api

Backend basado en NestJS con:
- Autenticación JWT (usuarios y dispositivos)
- API RESTful documentada con Swagger
- WebSockets para comunicación en tiempo real
- TypeORM para gestión de base de datos
- Integración con PostgreSQL y MinIO

**Puerto:** 3000

### @backtobackup/frontend

Frontend basado en Angular con:
- Angular 19+
- PrimeNG para componentes UI
- Tailwind CSS para estilos
- Generación automática de modelos desde el backend

**Puerto:** 4200

## Flujo de Trabajo

### Generación de Modelos

El frontend consume los modelos del backend de forma automática:

1. El backend expone su API en formato OpenAPI (Swagger) en `/docs-json`
2. El script `generate-api-models.sh` utiliza `ng-openapi-gen` para generar los modelos TypeScript
3. Los modelos generados se guardan en `packages/frontend/src/app/api/`
4. El frontend importa y usa estos modelos tipados

### Desarrollo

1. **Inicio rápido con Docker**: `npm run dev`
   - Todos los servicios se levantan automáticamente
   - Hot-reload habilitado en backend y frontend
   - Las dependencias se instalan automáticamente

2. **Desarrollo local** (sin Docker):
   - Backend: `cd packages/api && npm run start:dev`
   - Frontend: `cd packages/frontend && npm start`

## Servicios de Infraestructura

### PostgreSQL
- **Puerto:** 5438
- **Usuario:** Configurado en `.env`
- **Base de datos:** backtobackup

### MinIO
- **API Puerto:** 9000
- **Console Puerto:** 9001
- **Almacenamiento:** Para archivos y backups

## Variables de Entorno

Las variables de entorno se configuran en `devops/.env`. Ver `.env.example` para ejemplos.

**Importante**: Nunca commitear el archivo `.env` real con credenciales.

## Tecnologías Principales

### Backend
- NestJS 11
- TypeORM
- PostgreSQL
- JWT (passport-jwt)
- Swagger/OpenAPI
- WebSockets (Socket.IO)

### Frontend
- Angular 19
- PrimeNG
- Tailwind CSS
- RxJS
- ng-openapi-gen

### DevOps
- Docker
- Docker Compose
- nginx (producción)

