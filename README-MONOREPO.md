# BackToBackup Monorepo

Monorepo para BackToBackup que incluye el backend (NestJS) y el frontend (Angular).

## 📁 Estructura del Proyecto

```
backtobackup-api/
├── packages/
│   ├── api/              # Backend NestJS
│   │   ├── src/
│   │   ├── test/
│   │   └── package.json
│   └── frontend/         # Frontend Angular
│       ├── src/
│       ├── public/
│       └── package.json
├── devops/               # Docker Compose y configuración
├── scripts/              # Scripts útiles
└── package.json          # Configuración del monorepo
```

## 🚀 Inicio Rápido

### Prerequisitos
- Docker y Docker Compose
- Node.js 22+ (opcional, para desarrollo fuera de Docker)

### Desarrollo con Docker (Recomendado)

1. **Configuración inicial** (solo la primera vez):
```bash
npm run setup
```

Este comando instalará las dependencias y creará el archivo `.env` desde el ejemplo.

2. **Editar variables de entorno**:
```bash
# Edita devops/.env con tus valores
nano devops/.env  # o usa tu editor favorito
```

3. **Iniciar todos los servicios**:
```bash
npm run dev
```

Esto iniciará:
- PostgreSQL (puerto 5438)
- MinIO (puertos 9000, 9001)
- Backend API (puerto 3000)
- Frontend Angular (puerto 4200)

4. **Acceder a los servicios**:
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api
- Swagger Docs: http://localhost:3000/docs
- MinIO Console: http://localhost:9001

5. **Generar modelos de la API para el frontend**:
```bash
# Asegúrate de que el backend esté corriendo
npm run generate:api-models
```

Este comando genera automáticamente los modelos TypeScript del frontend desde el Swagger del backend.

### Comandos Útiles

```bash
# Ver logs de todos los servicios
npm run dev:logs

# Detener todos los servicios
npm run dev:down

# Reiniciar servicios
npm run dev:restart

# Construir ambos proyectos
npm run build:all

# Trabajar solo con el backend
npm run api:start:dev

# Trabajar solo con el frontend
npm run frontend:start
```

### Solución de Problemas

**Error: "npm error ERESOLVE could not resolve"**

Si encuentras errores de resolución de dependencias al iniciar el entorno, es posible que los volúmenes de Docker contengan versiones antiguas de `node_modules`. Para solucionarlo:

```bash
# Detener los servicios
npm run dev:down

# Eliminar los volúmenes de Docker (esto borrará los node_modules cacheados)
docker volume rm backtobackup_frontend_node_modules backtobackup_api_node_modules

# Volver a iniciar los servicios
npm run dev
```

Los servicios reinstalarán las dependencias desde cero con las versiones correctas.

## 🔧 Desarrollo

### Backend (NestJS)

El backend está en `packages/api/`:

```bash
cd packages/api
npm install
npm run start:dev
```

### Frontend (Angular)

El frontend está en `packages/frontend/`:

```bash
cd packages/frontend
npm install
npm run start
```

### Sincronizar Modelos

Cada vez que cambies los DTOs o controladores en el backend:

1. Asegúrate de que el backend esté corriendo
2. Ejecuta: `npm run generate:api-models`
3. Los modelos TypeScript se generarán automáticamente en `packages/frontend/src/app/api`

## 🐳 Docker

### Desarrollo
El `docker-compose.yml` está configurado para desarrollo con hot-reload en ambos proyectos.

### Producción
Cada package tiene su propio `Dockerfile` para builds de producción.

## 🌐 Networking

En Docker:
- Los servicios se comunican entre sí usando los nombres de los contenedores
- Frontend accede al backend usando el nombre del servicio `api`
- Desde tu navegador accedes a `localhost:4200` (frontend) y `localhost:3000` (backend)

## 📝 Notas

- Este es un monorepo simple sin herramientas adicionales como NX o Lerna
- Se utiliza workspaces de npm para gestionar las dependencias
- El frontend se regenera automáticamente cuando cambian los modelos de la API
- Todos los servicios están en la misma red Docker para facilitar la comunicación

