# Changelog

## [Monorepo Migration] - 2025-12-16

### 🎉 Cambios Mayores

- **Conversión a Monorepo**: El proyecto ha sido reorganizado como un monorepo simple usando npm workspaces
- **Estructura Unificada**: Backend y frontend ahora conviven en el mismo repositorio bajo `packages/`

### 📦 Estructura

```
packages/
  ├── api/        # Backend NestJS (anteriormente en raíz)
  └── frontend/   # Frontend Angular (anteriormente en backtobackup-app/)
```

### 🐳 Docker Compose Unificado

- Docker Compose ahora incluye todos los servicios:
  - PostgreSQL
  - MinIO
  - Backend API con hot-reload
  - Frontend Angular con hot-reload
- Un solo comando para levantar todo: `npm run dev`

### 🔧 Nuevas Características

- **Script de Setup**: `npm run setup` para configuración inicial automática
- **Generación de Modelos**: Script automatizado para generar modelos del frontend desde el backend
  - Comando: `npm run generate:api-models`
  - Genera tipos TypeScript automáticamente desde el Swagger del backend
- **Configuración ng-openapi-gen**: Configuración centralizada en `ng-openapi-gen.json`

### 📝 Scripts NPM Nuevos

- `npm run setup` - Configuración inicial del proyecto
- `npm run dev` - Iniciar todos los servicios en Docker
- `npm run dev:down` - Detener todos los servicios
- `npm run dev:logs` - Ver logs de todos los servicios
- `npm run dev:restart` - Reiniciar servicios
- `npm run generate:api-models` - Generar modelos de API para el frontend
- `npm run build:all` - Construir backend y frontend
- `npm run api:*` - Comandos específicos del backend
- `npm run frontend:*` - Comandos específicos del frontend

### 🗂️ Archivos Nuevos

- `README-MONOREPO.md` - Documentación completa del monorepo
- `STRUCTURE.md` - Documentación detallada de la estructura
- `scripts/setup.sh` - Script de configuración inicial
- `scripts/generate-api-models.sh` - Script para generar modelos
- `.env.example` - Ejemplo de variables de entorno en raíz
- `.dockerignore` - Optimización de builds Docker
- `packages/frontend/ng-openapi-gen.json` - Configuración del generador
- `packages/frontend/nginx.conf` - Configuración nginx para producción
- `packages/frontend/Dockerfile` - Dockerfile del frontend
- `packages/api/Dockerfile` - Dockerfile actualizado del backend

### 🔄 Archivos Movidos

- `src/` → `packages/api/src/`
- `test/` → `packages/api/test/`
- `backtobackup-app/src/` → `packages/frontend/src/`
- `backtobackup-app/public/` → `packages/frontend/public/`
- Archivos de configuración distribuidos en sus respectivos packages

### ⚙️ Configuración

- **Workspaces de npm**: Gestión de dependencias centralizada
- **TypeScript**: Configuraciones separadas por package
- **Docker**: Volúmenes mapeados para hot-reload en desarrollo
- **Networking**: Servicios en la misma red Docker

### 📚 Documentación

- README principal actualizado con referencia al monorepo
- README-MONOREPO.md con instrucciones completas
- STRUCTURE.md con estructura detallada del proyecto

### 🎯 Beneficios

1. **Desarrollo Simplificado**: Un solo comando para todo
2. **Tipos Compartidos**: Generación automática de modelos TypeScript
3. **Hot Reload**: Cambios reflejados inmediatamente en backend y frontend
4. **Documentación Unificada**: Todo en un solo lugar
5. **Gestión de Dependencias**: npm workspaces para optimización
6. **Docker Optimizado**: Desarrollo y producción configurados

### 🔜 Próximos Pasos Sugeridos

- [ ] Configurar CI/CD para el monorepo
- [ ] Agregar pre-commit hooks con Husky
- [ ] Implementar tests E2E del monorepo completo
- [ ] Documentar APIs y componentes

