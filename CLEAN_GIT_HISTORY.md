# Cleaning Git History to Remove Secrets

GitHub detected secrets in your git history. Follow these steps to remove them:

## Step 1: Current Status ✅

- ✅ Secrets removed from `README.md`
- ✅ Secrets removed from `GOOGLE_OAUTH_SETUP.md`
- ✅ `.env` and `.env.local` removed from git tracking
- ✅ `.gitignore` updated to exclude env files

## Step 2: Remove Secrets from Git History

You have two options:

### Option A: Use BFG Repo-Cleaner (Recommended - Faster)

1. **Install BFG** (if not installed):
   ```bash
   # On Windows with Chocolatey
   choco install bfg
   
   # Or download from: https://rtyley.github.io/bfg-repo-cleaner/
   ```

2. **Create a file with secrets to remove** (`secrets.txt`):
   ```
   YOUR_GOOGLE_CLIENT_ID_HERE
   YOUR_GOOGLE_CLIENT_SECRET_HERE
   ```

3. **Run BFG**:
   ```bash
   java -jar bfg.jar --replace-text secrets.txt
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

### Option B: Use git filter-branch (Built-in)

Run the provided script:
```bash
./remove-secrets.sh
```

Or manually:
```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env .env.local" \
  --prune-empty --tag-name-filter cat -- --all

git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d
```

## Step 3: Force Push to GitHub

⚠️ **WARNING**: This rewrites history. Make sure:
- You have a backup
- All team members are aware
- No one else has pushed commits

```bash
git push --force origin main
```

## Step 4: Rotate Your Secrets

Since the secrets were exposed in git history, **you should rotate them**:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth 2.0 credentials
3. **Revoke the old Client Secret**
4. **Create new credentials**
5. Update your `.env.local` file with new credentials

## Prevention for Future

✅ `.env` and `.env.local` are now in `.gitignore`
✅ Never commit secrets to git
✅ Use environment variables in production
✅ Use GitHub Secrets for CI/CD

## Verify

After cleaning, verify no secrets remain:
```bash
git log --all --full-history -- .env .env.local README.md GOOGLE_OAUTH_SETUP.md | grep -i "936371157882\|GOCSPX"
```

If no output, secrets are removed! ✅

