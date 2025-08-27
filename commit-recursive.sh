#!/usr/bin/env bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 \"commit message\""
  exit 1
fi

MSG="$1"

# Commit & push in each submodule
git submodule foreach "
  git add .;
  if ! git diff --cached --quiet; then
    echo \"[Submodule \$name] committing...\";
    git commit -m \"$MSG\";
    git push origin HEAD;
  else
    echo \"[Submodule \$name] no changes to commit\";
  fi
"

# Commit & push in parent repo
git add .
if ! git diff --cached --quiet; then
  echo "[Parent] committing pointer update..."
  git commit -m "$MSG"
  git push origin HEAD
else
  echo "[Parent] no changes to commit"
fi
