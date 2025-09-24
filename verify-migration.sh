#!/bin/bash

# Branch Migration Verification Script
# Run this script after migrating from main to copilot/fix-6 branch

echo "🔍 Branch Migration Verification Script"
echo "======================================"
echo ""

# Check current branch
current_branch=$(git branch --show-current)
echo "📍 Current branch: $current_branch"

# Check if we're on the expected branch
if [ "$current_branch" = "copilot/fix-6" ]; then
    echo "✅ Successfully on copilot/fix-6 branch"
else
    echo "⚠️  WARNING: Expected to be on copilot/fix-6, but currently on $current_branch"
fi

echo ""

# Check remote default branch
echo "🌐 Checking remote repository status..."
default_branch=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "unable to determine")
echo "📍 Remote default branch: $default_branch"

if [ "$default_branch" = "copilot/fix-6" ]; then
    echo "✅ Remote default branch correctly set to copilot/fix-6"
elif [ "$default_branch" = "main" ]; then
    echo "⚠️  WARNING: Remote default branch is still 'main'"
else
    echo "ℹ️  Remote default branch: $default_branch"
fi

echo ""

# Check if main branch still exists
echo "🗂️  Checking for main branch..."
if git show-ref --verify --quiet refs/remotes/origin/main; then
    echo "⚠️  WARNING: Remote main branch still exists"
else
    echo "✅ Remote main branch has been deleted"
fi

if git show-ref --verify --quiet refs/heads/main; then
    echo "⚠️  INFO: Local main branch still exists (can be safely deleted)"
else
    echo "✅ Local main branch has been deleted"
fi

echo ""

# Test build
echo "🔨 Testing application build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Application builds successfully"
else
    echo "❌ ERROR: Application build failed"
    exit 1
fi

echo ""
echo "🎉 Migration verification complete!"
echo ""
echo "If you see any warnings above, please refer to BRANCH_MIGRATION_INSTRUCTIONS.md"