#!/bin/bash

echo "🔍 Verificando estructura del monorepo..."
echo ""

# Verificar estructura de directorios
echo "📁 Estructura de directorios:"
if [ -d "packages/api" ] && [ -d "packages/frontend" ]; then
  echo "  ✅ packages/api"
  echo "  ✅ packages/frontend"
else
  echo "  ❌ Faltan directorios de packages"
  exit 1
fi

# Verificar archivos importantes
echo ""
echo "📄 Archivos de configuración:"
files=(
  "package.json"
  "packages/api/package.json"
  "packages/frontend/package.json"
  "devops/docker-compose.yml"
  "devops/.env.example"
  "scripts/setup.sh"
  "scripts/generate-api-models.sh"
  "README-MONOREPO.md"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (faltante)"
  fi
done

# Verificar permisos de scripts
echo ""
echo "🔐 Permisos de scripts:"
if [ -x "scripts/setup.sh" ]; then
  echo "  ✅ scripts/setup.sh (ejecutable)"
else
  echo "  ❌ scripts/setup.sh (no ejecutable)"
fi

if [ -x "scripts/generate-api-models.sh" ]; then
  echo "  ✅ scripts/generate-api-models.sh (ejecutable)"
else
  echo "  ❌ scripts/generate-api-models.sh (no ejecutable)"
fi

# Verificar que exista .env
echo ""
echo "🔧 Variables de entorno:"
if [ -f "devops/.env" ]; then
  echo "  ✅ devops/.env existe"
else
  echo "  ⚠️  devops/.env no existe (ejecuta: npm run setup)"
fi

echo ""
echo "📦 Comandos disponibles:"
echo "  npm run setup              - Configuración inicial"
echo "  npm run dev                - Iniciar todos los servicios"
echo "  npm run dev:down           - Detener servicios"
echo "  npm run dev:logs           - Ver logs"
echo "  npm run generate:api-models - Generar modelos de API"
echo "  npm run build:all          - Construir todo"

echo ""
echo "✅ Verificación completada!"

