#!/bin/bash
set -e

REPO_URL="https://github.com/anshgupta652006-ux/coldlife-twin.git"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

echo "ColdLife Twin -> GitHub"
echo "Repository: $REPO_URL"
echo ""

if ! command -v git >/dev/null 2>&1; then
  echo "❌ git is not installed. Install Xcode Command Line Tools with:"
  echo "xcode-select --install"
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "❌ GitHub CLI is not installed. Run:"
  echo "brew install gh"
  echo "gh auth login"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "GitHub CLI is not logged in. Starting login..."
  gh auth login
fi

LOGIN="$(gh api user --jq .login)"
git config user.name "$LOGIN"
git config user.email "$LOGIN@users.noreply.github.com"

if [ ! -d .git ]; then
  git init
fi

git add .
if ! git diff --cached --quiet; then
  git commit -m "Deployable ColdLife Twin"
fi

git branch -M main
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

echo ""
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Project pushed successfully"
echo "GitHub: https://github.com/anshgupta652006-ux/coldlife-twin"
echo ""
echo "Next for GitHub Pages:"
echo "1) Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY as GitHub Actions secrets"
echo "2) Settings -> Pages -> Source: GitHub Actions"
