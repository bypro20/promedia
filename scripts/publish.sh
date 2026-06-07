#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

OWNER="${GITHUB_OWNER:-bypro20}"
REPO="${GITHUB_REPO:-promedia}"
BRANCH="${GITHUB_BRANCH:-main}"

echo "→ GitHub: ${OWNER}/${REPO}"

if ! git remote get-url origin &>/dev/null; then
  git remote add origin "git@github.com:${OWNER}/${REPO}.git"
fi

# Repo yoksa oluştur (gh veya GITHUB_TOKEN gerekir)
if ! git ls-remote "git@github.com:${OWNER}/${REPO}.git" &>/dev/null; then
  if command -v gh &>/dev/null && gh auth status &>/dev/null; then
    gh repo create "$REPO" --public --source=. --remote=origin --description "ProMedia — Sosyal medya büyüme hizmetleri"
  elif [ -n "${GITHUB_TOKEN:-}" ]; then
    curl -fsS -X POST \
      -H "Authorization: Bearer ${GITHUB_TOKEN}" \
      -H "Accept: application/vnd.github+json" \
      https://api.github.com/user/repos \
      -d "{\"name\":\"${REPO}\",\"description\":\"ProMedia — Sosyal medya büyüme hizmetleri\",\"private\":false}"
  else
    echo "GitHub repo bulunamadı. Önce oluşturun:"
    echo "  https://github.com/new?name=${REPO}"
    echo "veya: export GITHUB_TOKEN=ghp_... && bash scripts/publish.sh"
    exit 1
  fi
fi

git push -u origin "$BRANCH"
echo "✓ GitHub push tamam"

if command -v vercel &>/dev/null || npx vercel --version &>/dev/null 2>&1; then
  npx vercel --prod --yes --name promedia 2>/dev/null || npx vercel --prod --yes
  echo "✓ Vercel deploy tamam"
else
  echo "Vercel CLI yok. GitHub bağladıktan sonra:"
  echo "  https://vercel.com/new → Import ${OWNER}/${REPO}"
fi
