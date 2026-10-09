#!/usr/bin/env bash
# Put the tested demo build (_site/) on a Cloudflare Worker. Same files as the GitHub page.
#
#   PUPPETEER=/path/to/node_modules/puppeteer-core bash deploy/worker/publish.sh          build, test, copy
#   PUPPETEER=/path/to/node_modules/puppeteer-core bash deploy/worker/publish.sh deploy   and publish to
#                                                      https://switch-finder-demo.pingywon.workers.dev
set -euo pipefail
cd "$(dirname "$0")/../.."

python3 tools/build.py
node tools/check.cjs

cd deploy/worker
rm -rf site && mkdir site
cp -r ../../_site/. site/
rm -f site/.nojekyll
cat > site/_headers <<'H'
/*
  X-Robots-Tag: noindex, nofollow
  Cache-Control: no-cache
  X-Content-Type-Options: nosniff
H
echo "copied v$(cat site/VERSION): $(find site -type f | wc -l) files, $(du -sh site | cut -f1)"
if [ "${1:-}" = "deploy" ]; then
  CLOUDFLARE_API_TOKEN="$(tr -d '[:space:]' < ~/.cf_token)" \
  CLOUDFLARE_ACCOUNT_ID="$(tr -d '[:space:]' < ~/.cf_account)" \
  "${WRANGLER:-$HOME/gc-ops/node_modules/.bin/wrangler}" deploy
  echo "live: https://switch-finder-demo.pingywon.workers.dev  (v$(cat site/VERSION))"
fi
