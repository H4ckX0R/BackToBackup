#!/bin/bash

echo "🔄 Esperando a que el backend esté disponible..."
echo "   Verificando http://localhost:3000/docs-json"

# Esperar a que el backend esté listo
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
  if curl -s http://localhost:3000/docs-json > /dev/null 2>&1; then
    echo "✅ Backend está disponible!"
    break
  fi

  attempt=$((attempt + 1))
  echo "   Intento $attempt/$max_attempts - Esperando..."
  sleep 2
done

if [ $attempt -eq $max_attempts ]; then
  echo "❌ Error: El backend no está disponible después de esperar"
  echo "   Asegúrate de que el backend esté corriendo en http://localhost:3000"
  exit 1
fi

echo "🔧 Generando modelos de la API..."
cd packages/frontend
npm run openapi:generate

if [ $? -eq 0 ]; then
  echo "✅ Modelos generados exitosamente en packages/frontend/src/app/api"
else
  echo "❌ Error al generar los modelos"
  exit 1
fi

