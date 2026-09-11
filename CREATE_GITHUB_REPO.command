#!/bin/bash
set -e
cd "$(dirname "$0")"

DEFAULT_NAME="coldlife-twin"
read -p "GitHub repo name [$DEFAULT_NAME]: " REPO_NAME
REPO_NAME=${REPO_NAME:-$DEFAULT_NAME}

read -p "Make repository public? [Y/n]: " PUBLIC_CHOICE
PUBLIC_CHOICE=${PUBLIC_CHOICE:-Y}
if [[ "$PUBLIC_CHOICE" =~ ^[Nn]$ ]]; then
  VISIBILITY="--private"
else
  VISIBILITY="--public"
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI is not installed. Install it first with:"
  echo "  brew install gh"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Opening GitHub CLI login..."
  gh auth login
fi

if [ ! -d .git ]; then
  git init
fi

git add .
if ! git diff --cached --quiet; then
  git commit -m "Initial ColdLife Twin deployment"
fi
git branch -M main

if gh repo view "$REPO_NAME" >/dev/null 2>&1; then
  echo "Repository '$REPO_NAME' already exists on GitHub."
  if ! git remote get-url origin >/dev/null 2>&1; then
    USERNAME=$(gh api user --jq .login)
    git remote add origin "https://github.com/$USERNAME/$REPO_NAME.git"
  fi
  git push -u origin main
else
  gh repo create "$REPO_NAME" "$VISIBILITY" --source=. --remote=origin --push
fi

echo ""
echo "✅ GitHub repository created/pushed successfully."
