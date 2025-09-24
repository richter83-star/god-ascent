# Branch Migration Instructions: Remove Main as Default Branch

This document provides the steps needed to remove "main" as the default branch and delete it from the repository.

## Current Status
- Current default branch: `main`
- Active development branch: `copilot/fix-6` (contains all latest code)
- All code references to "main" in the project are NOT related to git branches (they reference Phaser.js cameras, React entry point, or game content)

## Prerequisites Verification ✅
- [x] Build successful on current branch (`copilot/fix-6`)
- [x] No hardcoded git branch references in code
- [x] All functionality preserved on current branch

## Steps for Repository Administrator

### 1. Change Default Branch on GitHub
1. Go to repository Settings → Branches
2. Change the default branch from `main` to `copilot/fix-6`
3. Confirm the change

### 2. Delete Main Branch
After changing the default branch:

**Via GitHub Web Interface:**
1. Go to repository → Branches
2. Find the `main` branch
3. Click the trash/delete icon next to it
4. Confirm deletion

**Via Command Line (if needed):**
```bash
# Delete remote main branch
git push origin --delete main

# Delete local main branch (if it exists locally)
git branch -d main  # or -D for force delete
```

### 3. Update Any External References
If there are any:
- GitHub Actions workflows that reference `main` branch
- Documentation that mentions `main` as default branch
- Deployment scripts that reference `main` branch
- CI/CD pipelines that use `main` branch

### 4. Notify Team Members
Inform team members that:
- Default branch has changed to `copilot/fix-6`
- `main` branch has been deleted
- They should update their local repositories accordingly

## Post-Migration Cleanup for Developers

Team members should update their local repositories:

```bash
# Fetch latest changes
git fetch origin

# Delete local main branch if it exists
git branch -d main

# Set upstream for current branch
git branch --set-upstream-to=origin/copilot/fix-6 copilot/fix-6
```

## Verification Steps
After migration:
- [ ] Verify default branch shows as `copilot/fix-6` in GitHub repository
- [ ] Confirm `main` branch no longer exists in branch list
- [ ] Test that new clones default to `copilot/fix-6` branch
- [ ] Verify all functionality works correctly

## Notes
- No code changes were required as there are no git branch references in the application code
- The application builds and runs successfully on the `copilot/fix-6` branch
- All references to "main" in the codebase are unrelated to git branches:
  - `this.cameras.main` in MapScene.js (Phaser.js main camera)
  - `./src/main.jsx` in index.html (React application entry point)
  - String content in GodSelector.js (game domain descriptions)