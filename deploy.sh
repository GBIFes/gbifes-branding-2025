#!/bin/bash
set -e

HELP="
Uso: $0 [opciones]
Opciones:
  -d, --deploy [demo|datos|both]  Especifica donde hacer deploy (por defecto: both)
  -b, --builder [brunch|vite]     Especifica el builder a usar (por defecto: brunch)
  -h, --help                      Muestra esta ayuda
"

DEPLOY="both"
BUILDER="vite"

while [[ $# -gt 0 ]]; do
  case $1 in
    -d|--deploy)
      case $2 in
        demo|datos|both)
          DEPLOY=$2
          shift 2
          ;;
        *)
          echo "Valor inválido para --deploy. Uso: $0 --help"
          exit 1
          ;;
      esac
      ;;
    -b|--builder)
      case $2 in
        brunch|vite)
          BUILDER=$2
          shift 2
          ;;
        *)
          echo "Valor inválido para --builder. Uso: $0 --help"
          exit 1
          ;;
      esac
      ;;
    -h|--help)
      echo "$HELP"
      exit 0
      ;;
    *)
      echo "Opción desconocida: $1. Uso: $0 --help"
      exit 1
      ;;
  esac
done

echo "Deploy en: $DEPLOY"
echo "Builder: $BUILDER"

NODE_PATH=~/.npm-packages/lib/node_modules/ node app/js/stats-job.js > app/assets/stats.json

if [ "$BUILDER" = "brunch" ]; then
  DEST=public
  cp app/js/settings-demo.js app/js/settings.js
  brunch build --production
elif [ "$BUILDER" = "vite" ]; then
  DEST=dist
  cp app/js/settings-demo.js app/js/settings.js
  npm run build-demo
fi

if [ "$DEPLOY" = "demo" ] || [ "$DEPLOY" = "both" ]; then
  rsync -a --delete $DEST/ demo.gbif.es:/srv/demo.gbif.es/www/brand-2025-vite/
  rsync -a $DEST/ demo.gbif.es:/srv/demo.gbif.es/www/
fi

if [ "$BUILDER" = "brunch" ]; then
  cp app/js/settings-prod.js app/js/settings.js
  brunch build --production
elif [ "$BUILDER" = "vite" ]; then
  cp app/js/settings-prod.js app/js/settings.js
  npm run build
fi

if [ "$DEPLOY" = "datos" ] || [ "$DEPLOY" = "both" ]; then
  rsync -a --delete $DEST/ datos.gbif.es:/srv/auth.gbif.es/www/brand-2025-vite/
  rsync -a $DEST/ datos.gbif.es:/srv/auth.gbif.es/www/
  curl -s https://registros.gbif.es/headerFooter/clearCache && \
  curl -s https://especies.gbif.es/headerFooter/clearCache && \
  curl -s https://listas.gbif.es/headerFooter/clearCache && \
  curl -s https://imagenes.gbif.es/headerFooter/clearCache && \
  curl -s https://doi.gbif.es/headerFooter/clearCache && \
  curl -s https://alertas.gbif.es/headerFooter/clearCache && \
  curl -s https://regiones.gbif.es/headerFooter/clearCache && \
  curl -s https://auth.gbif.es/userdetails/headerFooter/clearCache && \
  curl -s https://colecciones.gbif.es/headerFooter/clearCache
fi

cp app/js/settings-demo.js app/js/settings.js

