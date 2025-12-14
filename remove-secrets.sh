#!/bin/bash

# Remove Google OAuth secrets from git history
# This script uses git filter-branch to rewrite history

echo "⚠️  WARNING: This will rewrite git history!"
echo "Make sure you have a backup of your repository."
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

# Remove secrets from all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env .env.local 2>/dev/null || true; \
   git checkout HEAD -- README.md GOOGLE_OAUTH_SETUP.md 2>/dev/null || true" \
  --prune-empty --tag-name-filter cat -- --all

# Clean up backup refs
git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d

echo ""
echo "✅ Git history cleaned!"
echo "⚠️  You need to force push: git push --force origin main"
echo "⚠️  Make sure all team members are aware before force pushing!"

