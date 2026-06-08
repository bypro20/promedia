#!/usr/bin/env bash
# ProMedia agent ekibini paralel Cursor Task olarak başlatmak için prompt üretir.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== ProMedia Ekip Durumu ==="
SITE_URL="${SITE_URL:-https://promedia-kappa.vercel.app}" node scripts/agent-coordinator.mjs

echo ""
echo "=== Cursor'da paralel başlat ==="
echo "Aşağıdaki mesajı Cursor Agent'a yapıştır:"
echo ""
cat <<'PROMPT'
AGENT_TEAM.md ve AGENT_TASKS.md oku. 5 paralel subagent başlat:

1. explore/qa — npm run health, kırık route raporla
2. generalPurpose/api — AGENT_TASKS [api] görevleri
3. generalPurpose/ui — AGENT_TASKS [ui] görevleri  
4. shell/ops — AGENT_TASKS [ops] görevleri (deploy, env)
5. generalPurpose/content — AGENT_TASKS [content] görevleri

Hepsi bitince koordinatör özeti ver. /home/bypro20/promedia
PROMPT
