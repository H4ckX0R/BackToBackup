# 🎉 Migración a Monorepo Completada

## ✅ Resumen de Cambios

Se ha completado exitosamente la migración del proyecto BackToBackup a una arquitectura de monorepo.

## 📊 Estructura Anterior vs Nueva

### Antes:
```
backtobackup-api/
├── src/              # Backend
├── test/
├── backtobackup-app/ # Frontend (carpeta separada)
└── devops/
```

### Ahora:
```
backtobackup-api/
├── packages/
│   ├── api/          # Backend
│   └── frontend/     # Frontend
├── devops/           # Docker Compose con todos los servicios
└── scripts/          # Scripts de automatización
```

## 🎯 Características Implementadas

### 1. Monorepo Simple con npm Workspaces
- ✅ Sin dependencias adicionales (no usa NX, Lerna, etc.)
- ✅ Gestión centralizada de dependencias
- ✅ Scripts unificados en el package.json raíz

### 2. Docker Compose Unificado
- ✅ Backend con hot-reload
- ✅ Frontend con hot-reload
- ✅ PostgreSQL
- ✅ MinIO
- ✅ Todo en una sola red Docker

### 3. Generación Automática de Modelos
- ✅ Script `generate-api-models.sh` para sincronizar modelos
- ✅ Frontend consume tipos TypeScript del backend automáticamente
- ✅ Configuración ng-openapi-gen lista para usar

### 4. Scripts de Automatización
- ✅ `setup.sh` - Configuración inicial automática
- ✅ `generate-api-models.sh` - Generación de modelos
- ✅ `verify.sh` - Verificación de estructura

### 5. Documentación Completa
- ✅ README-MONOREPO.md - Guía principal
- ✅ STRUCTURE.md - Estructura detallada
- ✅ CONTRIBUTING.md - Guía de contribución
- ✅ CHANGELOG.md - Registro de cambios

## 🚀 Cómo Empezar

### Primera Vez

```bash
# 1. Configuración inicial
npm run setup

# 2. Editar variables de entorno
nano devops/.env

# 3. Iniciar todos los servicios
npm run dev
```

### Acceso a Servicios

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000/api
- **Swagger**: http://localhost:3000/docs
- **MinIO Console**: http://localhost:9001

### Generar Modelos

```bash
# Mientras el backend esté corriendo
npm run generate:api-models
```

## 📦 Comandos Principales

```bash
npm run setup               # Configuración inicial
npm run dev                 # Iniciar todo
npm run dev:down            # Detener todo
npm run dev:logs            # Ver logs
npm run dev:restart         # Reiniciar servicios
npm run generate:api-models # Generar modelos de API
npm run build:all           # Construir todo
npm run api:start:dev       # Solo backend
npm run frontend:start      # Solo frontend
```

## 🔄 Flujo de Trabajo

### Para Backend
1. Modificar código en `packages/api/src/`
2. Hot-reload automático
3. Swagger se actualiza automáticamente

### Para Frontend
1. Modificar código en `packages/frontend/src/`
2. Hot-reload automático
3. Si cambió el backend, ejecutar `npm run generate:api-models`

### Sincronización de Modelos
1. Backend expone API en Swagger (`/docs-json`)
2. Ejecutar `npm run generate:api-models`
3. Modelos TypeScript se generan en `packages/frontend/src/app/api/`
4. Frontend importa y usa estos modelos

## 📁 Archivos Importantes

### Configuración
- `package.json` - Configuración del monorepo
- `packages/api/package.json` - Dependencias del backend
- `packages/frontend/package.json` - Dependencias del frontend
- `devops/docker-compose.yml` - Orquestación de servicios
- `devops/.env` - Variables de entorno

### Documentación
- `README-MONOREPO.md` - Guía principal
- `STRUCTURE.md` - Estructura del proyecto
- `CONTRIBUTING.md` - Guía de contribución
- `CHANGELOG.md` - Registro de cambios

### Scripts
- `scripts/setup.sh` - Configuración inicial
- `scripts/generate-api-models.sh` - Generación de modelos
- `scripts/verify.sh` - Verificación de estructura

### Docker
- `packages/api/Dockerfile` - Build de producción del backend
- `packages/frontend/Dockerfile` - Build de producción del frontend
- `packages/frontend/nginx.conf` - Configuración nginx

## 🌐 Networking en Docker

Los servicios se comunican usando nombres de contenedor:
- Frontend → Backend: `http://api:3000`
- Backend → PostgreSQL: `db:5432`
- Backend → MinIO: `http://minio:9000`

Desde tu navegador:
- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3000`

## ✨ Beneficios de la Nueva Estructura

1. **Desarrollo Unificado**: Un solo comando para todo
2. **Tipos Compartidos**: Sincronización automática de modelos
3. **Hot Reload**: Cambios instantáneos en ambos proyectos
4. **Documentación Centralizada**: Todo en un repositorio
5. **Gestión Simplificada**: npm workspaces optimiza dependencias
6. **Docker Optimizado**: Configurado para desarrollo y producción

## 🔧 Configuración de IDE

### VS Code (Recomendado)

El proyecto incluye configuración para VS Code en `.vscode/settings.json`.

Extensiones recomendadas:
- Angular Language Service
- ESLint
- Prettier
- Docker

### JetBrains (IntelliJ, WebStorm)

El proyecto incluye configuración en `.idea/`.

## 🐛 Troubleshooting

### Los contenedores no inician
```bash
# Verificar que no haya servicios en los puertos
lsof -i :3000 -i :4200 -i :5438

# Limpiar y reiniciar
npm run dev:down
docker system prune -a
npm run dev
```

### Error al generar modelos
```bash
# Verificar que el backend esté corriendo
curl http://localhost:3000/docs-json

# Regenerar modelos
npm run generate:api-models
```

### Hot-reload no funciona
```bash
# Verificar volúmenes de Docker
docker inspect backtobackup-api
docker inspect backtobackup-frontend

# Reiniciar contenedores
npm run dev:restart
```

## 📝 Notas Importantes

1. **No modificar archivos auto-generados**: 
   - `packages/frontend/src/app/api/*` se regenera automáticamente

2. **Variables de entorno**:
   - Nunca commitear `devops/.env` con credenciales reales
   - Usar `.env.example` como referencia

3. **Dependencias**:
   - Instalar dependencias específicas en cada workspace
   - Ejemplo: `npm install <pkg> --workspace=packages/api`

4. **Git**:
   - `.gitignore` actualizado para el monorepo
   - `.gitattributes` mantiene consistencia de finales de línea

## 🎓 Recursos Adicionales

- [npm Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Angular Documentation](https://angular.dev/)
- [Docker Compose](https://docs.docker.com/compose/)
- [ng-openapi-gen](https://github.com/cyclosproject/ng-openapi-gen)

## 🤝 Contribuir

Lee [CONTRIBUTING.md](./CONTRIBUTING.md) para conocer las guías de contribución.

## 📞 Soporte

Si encuentras algún problema:
1. Verifica la documentación
2. Revisa los logs: `npm run dev:logs`
3. Ejecuta verificación: `./scripts/verify.sh`
4. Abre un issue con detalles completos

---

**¡La migración está completa y el monorepo está listo para usar! 🎉**

