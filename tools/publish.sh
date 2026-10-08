#!/usr/bin/env bash
# Build, test, then publish _site/ as a new commit on the gh-pages branch.
# GitHub Pages serves that branch at https://pingywon.github.io/convoy-s2-switch-finder/
#
#   PUPPETEER=/path/to/node_modules/puppeteer-core bash tools/publish.sh
set -euo pipefail
cd "$(dirname "$0")/.."

python3 tools/build.py
node tools/check.cjs
version=$(cat VERSION)

# Write _site/ into a commit without switching branches: a throwaway index, then plumbing.
git fetch --quiet origin gh-pages 2>/dev/null || true
index=$(mktemp)
trap 'rm -f "$index"' EXIT
rm -f "$index"
GIT_INDEX_FILE="$index" git --work-tree=_site add -A
tree=$(GIT_INDEX_FILE="$index" git write-tree)
parent=$(git rev-parse -q --verify refs/remotes/origin/gh-pages || true)
if [ -n "$parent" ] && [ "$(git rev-parse "$parent^{tree}")" = "$tree" ]; then
  echo "gh-pages already holds this exact site (v$version). Nothing to publish."
  exit 0
fi
commit=$(git commit-tree "$tree" ${parent:+-p "$parent"} -m "Publish v$version")
git branch -f gh-pages "$commit"
git push origin gh-pages
echo "published v$version -> https://pingywon.github.io/convoy-s2-switch-finder/"
