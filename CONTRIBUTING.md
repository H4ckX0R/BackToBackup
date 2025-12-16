# Guía de Contribución - BackToBackup Monorepo

## 📋 Tabla de Contenidos

- [Configuración del Entorno](#configuración-del-entorno)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Estándares de Código](#estándares-de-código)
- [Commits](#commits)
- [Pull Requests](#pull-requests)

## 🔧 Configuración del Entorno

### Requisitos Previos

- Node.js 22+
- Docker y Docker Compose
- Git

### Configuración Inicial

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd backtobackup-api

# 2. Configuración inicial
npm run setup

# 3. Editar variables de entorno
nano devops/.env

# 4. Iniciar servicios
npm run dev
```

## 🏗️ Estructura del Proyecto

Este es un monorepo con dos paquetes principales:

- **packages/api**: Backend NestJS
- **packages/frontend**: Frontend Angular

Ver [STRUCTURE.md](./STRUCTURE.md) para más detalles.

## 🔄 Flujo de Trabajo

### Trabajando en el Backend

```bash
# Opción 1: Con Docker (recomendado)
npm run dev

# Opción 2: Local
cd packages/api
npm install
npm run start:dev
```

### Trabajando en el Frontend

```bash
# Opción 1: Con Docker (recomendado)
npm run dev

# Opción 2: Local
cd packages/frontend
npm install
npm start
```

### Sincronización de Modelos

Cuando modifiques DTOs o controladores en el backend:

```bash
# 1. Asegúrate de que el backend esté corriendo
npm run dev  # o npm run api:start:dev

# 2. En otra terminal, genera los modelos
npm run generate:api-models
```

Los modelos TypeScript se generarán en `packages/frontend/src/app/api/`.

## 📝 Estándares de Código

### Backend (NestJS)

- **Formato**: Prettier (configurado)
- **Linting**: ESLint (configurado)
- **Convenciones**:
  - Usar decoradores de NestJS apropiadamente
  - DTOs para validación de entrada
  - Documentar endpoints con decoradores de Swagger
  - Tipos estrictos de TypeScript

```typescript
// Ejemplo: Controller bien documentado
@ApiTags('users')
@Controller('users')
export class UsersController {
  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, type: UserDto })
  findOne(@Param('id') id: string) {
    // ...
  }
}
```

### Frontend (Angular)

- **Formato**: Prettier (configurado)
- **Convenciones**:
  - Componentes standalone (Angular 19+)
  - Usar signals cuando sea apropiado
  - RxJS para operaciones asíncronas
  - No modificar archivos en `src/app/api/` (auto-generados)

```typescript
// Ejemplo: Componente standalone
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, /* ... */],
  template: `...`,
})
export class UserProfileComponent {
  // ...
}
```

## 📦 Gestión de Dependencias

### Instalar Dependencias

```bash
# Backend
npm install <package> --workspace=packages/api

# Frontend
npm install <package> --workspace=packages/frontend

# Workspace raíz (solo si es necesario)
npm install <package> -w root
```

### Actualizar Dependencias

```bash
# Verificar actualizaciones
npm outdated

# Actualizar (con cuidado)
npm update
```

## 🧪 Tests

### Backend

```bash
# Todos los tests
npm run api:test

# Tests en modo watch
npm run api:test:watch

# Coverage
npm run api:test:cov

# E2E
npm run api:test:e2e
```

### Frontend

```bash
# Tests
npm run frontend:test
```

## 🔨 Commits

Usar mensajes de commit descriptivos y claros:

```bash
# Formato recomendado
<tipo>(<scope>): <descripción>

# Ejemplos
feat(api): agregar endpoint de exportación de backups
fix(frontend): corregir validación en formulario de login
docs: actualizar README con nuevas instrucciones
refactor(api): mejorar estructura de módulo de autenticación
style(frontend): aplicar estilos consistentes en dashboard
```

### Tipos de Commit

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan funcionalidad)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

## 🔀 Pull Requests

### Antes de Crear un PR

1. **Actualizar desde main**:
   ```bash
   git checkout main
   git pull
   git checkout tu-rama
   git rebase main
   ```

2. **Verificar que todo funciona**:
   ```bash
   npm run build:all
   npm run api:test
   ```

3. **Formatear código**:
   ```bash
   npm run format
   ```

### Crear el PR

1. Título descriptivo
2. Descripción clara de los cambios
3. Listar cambios importantes
4. Incluir capturas si hay cambios visuales
5. Mencionar issues relacionados

### Template de PR

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## Cambios Realizados
- Cambio 1
- Cambio 2

## Tests
- [ ] Tests unitarios agregados/actualizados
- [ ] Tests E2E agregados/actualizados
- [ ] Verificado manualmente

## Checklist
- [ ] El código sigue los estándares del proyecto
- [ ] He actualizado la documentación si es necesario
- [ ] Mis cambios no generan nuevos warnings
- [ ] He agregado tests que prueban mi funcionalidad
```

## 🐛 Reportar Bugs

Al reportar un bug, incluir:

1. **Descripción clara** del problema
2. **Pasos para reproducir** el bug
3. **Comportamiento esperado** vs **comportamiento actual**
4. **Capturas/Videos** si es relevante
5. **Entorno**: SO, versión de Node, etc.
6. **Logs de error** si están disponibles

## 💡 Sugerir Mejoras

Las sugerencias son bienvenidas. Por favor:

1. Describir claramente la mejora
2. Explicar el beneficio
3. Proporcionar ejemplos si es posible
4. Considerar el impacto en el sistema actual

## 🤝 Código de Conducta

- Ser respetuoso y profesional
- Aceptar críticas constructivas
- Enfocarse en lo mejor para el proyecto
- Mostrar empatía hacia otros contribuidores

## 📞 Contacto

Si tienes preguntas, no dudes en:
- Abrir un issue
- Contactar a los maintainers
- Revisar la documentación existente

---

¡Gracias por contribuir a BackToBackup! 🎉

