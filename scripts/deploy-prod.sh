#!/bin/bash

set -e

PROD_API_URL="https://api.lab.novelo.it/api"
TURNSTILE_SITE_KEY="0x4AAAAAAEoE1PX_o8i6c-Gs"
DEPLOY_TARGET="root@31.14.133.75:/var/www/novelo-lab-site/dist/"

echo
echo "🚀 Novelo Lab - Deploy produzione"
echo "========================================"
echo

echo "📦 Installazione dipendenze..."
npm ci

echo
echo "🧹 Pulizia build precedente..."
rm -rf dist

echo
echo "🏗️ Build Web produzione..."
echo "   API: $PROD_API_URL"

EXPO_PUBLIC_API_URL="$PROD_API_URL" \
EXPO_PUBLIC_TURNSTILE_SITE_KEY="$TURNSTILE_SITE_KEY" \
npx expo export --platform web --clear

echo
echo "🔎 Controllo build..."

# Verifica che per errore non sia finita nella build l'API locale.
if grep -R -F -q "api-local.lab.novelo.it" dist; then
    echo
    echo "❌ ERRORE: trovato api-local.lab.novelo.it nella build!"
    echo "❌ Deploy ANNULLATO."
    exit 1
fi

if grep -R -F -q "api-staging.lab.novelo.it" dist; then
    echo
    echo "❌ ERRORE: trovata api-staging.lab.novelo.it nella build PRODUCTION!"
    echo "❌ Deploy ANNULLATO."
    exit 1
fi

# Verifica che l'API production sia effettivamente presente.
if ! grep -R -F -q "$PROD_API_URL" dist; then
    echo
    echo "❌ ERRORE: $PROD_API_URL non trovato nella build!"
    echo "❌ Deploy ANNULLATO."
    exit 1
fi

# Verifica che Turnstile sia presente nella build.
if ! grep -R -F -q "$TURNSTILE_SITE_KEY" dist; then
    echo
    echo "❌ ERRORE: Turnstile Site Key non trovata nella build!"
    echo "❌ Deploy ANNULLATO."
    exit 1
fi

echo "✅ API produzione corretta."
echo "✅ Turnstile configurato."
echo "✅ Build verificata."

echo
echo "📤 Pubblicazione sul server..."
echo "   Destinazione: $DEPLOY_TARGET"
echo

rsync -avz --delete \
    dist/ \
    "$DEPLOY_TARGET"

echo
echo "========================================"
echo "✅ Novelo Lab pubblicato correttamente!"
echo "🌐 https://lab.novelo.it"
echo "========================================"
echo
