#!/bin/bash

echo "🚀 Configuración inicial de BackToBackup Monorepo"
echo "=================================================="

# Verificar si existe el archivo .env
if [ ! -f "devops/.env" ]; then
  echo "📝 Creando archivo de variables de entorno..."
  cp devops/.env.example devops/.env
  echo "✅ Archivo devops/.env creado. Por favor, edítalo con tus valores."
  echo ""
else
  echo "✅ Archivo devops/.env ya existe."
  echo ""
fi

# Instalar dependencias del workspace raíz
echo "📦 Instalando dependencias del workspace raíz..."
npm install

if [ $? -ne 0 ]; then
  echo "❌ Error al instalar dependencias del workspace raíz"
  exit 1
fi

echo ""
echo "✅ Configuración inicial completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Edita devops/.env con tus valores de configuración"
echo "2. Ejecuta: npm run dev"
echo "3. Espera a que todos los servicios estén listos"
echo "4. Accede a:"
echo "   - Frontend: http://localhost:4200"
echo "   - Backend API: http://localhost:3000/api"
echo "   - Swagger: http://localhost:3000/docs"
echo "   - MinIO Console: http://localhost:9001"
echo ""
echo "Para generar los modelos de la API:"
echo "   npm run generate:api-models"

