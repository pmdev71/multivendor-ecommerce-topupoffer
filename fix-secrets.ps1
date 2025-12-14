# PowerShell script to remove secrets from git history
# Run this in PowerShell (not Git Bash)

Write-Host "⚠️  WARNING: This will rewrite git history!" -ForegroundColor Yellow
Write-Host "Make sure you have a backup of your repository." -ForegroundColor Yellow
$confirm = Read-Host "Continue? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "Aborted." -ForegroundColor Red
    exit 1
}

Write-Host "`nRemoving secrets from git history..." -ForegroundColor Cyan

# Remove .env files from all commits
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env .env.local" --prune-empty --tag-name-filter cat -- --all

# Clean up backup refs
git for-each-ref --format="%(refname)" refs/original/ | ForEach-Object { git update-ref -d $_ }

Write-Host "`n✅ Git history cleaned!" -ForegroundColor Green
Write-Host "⚠️  You need to force push: git push --force origin main" -ForegroundColor Yellow
Write-Host "⚠️  Make sure all team members are aware before force pushing!" -ForegroundColor Yellow

