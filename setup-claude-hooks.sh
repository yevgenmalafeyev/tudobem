#!/bin/bash

# setup-claude-hooks.sh
# Script to add Claude commit message cleaning hooks to a new project
# Usage: ./setup-claude-hooks.sh

set -e

echo "🔧 Setting up Claude commit message cleaning hooks..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please run this script from the root of your git project."
    exit 1
fi

# Check if package.json exists (Node.js project)
if [ ! -f "package.json" ]; then
    echo "❌ Error: No package.json found. This script is designed for Node.js projects."
    exit 1
fi

# Install husky if not already installed
echo "📦 Installing husky..."
if ! npm list husky > /dev/null 2>&1; then
    npm install --save-dev husky
else
    echo "✅ Husky already installed"
fi

# Initialize husky
echo "🐕 Initializing husky..."
npx husky install

# Create .husky directory if it doesn't exist
mkdir -p .husky

# Create prepare-commit-msg hook
echo "📝 Creating prepare-commit-msg hook..."
cat > .husky/prepare-commit-msg << 'EOF'
#!/bin/sh

# Exit on any error
set -e

# Get the commit message file path
COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2
SHA1=$3

# Only process commit messages that are not from merges, rebases, etc.
if [ "$COMMIT_SOURCE" = "merge" ] || [ "$COMMIT_SOURCE" = "squash" ] || [ "$COMMIT_SOURCE" = "commit" ]; then
    exit 0
fi

# Check if commit message file exists
if [ ! -f "$COMMIT_MSG_FILE" ]; then
    exit 0
fi

# Create a temporary file
TEMP_FILE=$(mktemp)

# Flag to track if any lines were removed
LINES_REMOVED=false

# Process the commit message line by line
while IFS= read -r line || [ -n "$line" ]; do
    # Check if line contains both "co-authored" AND "claude" (case insensitive)
    if echo "$line" | grep -qi "co-authored" && echo "$line" | grep -qi "claude"; then
        echo "🧹 Removing line containing 'co-authored' and 'claude': $line" >&2
        LINES_REMOVED=true
    # Check if line contains both "generated" AND "claude" (case insensitive)  
    elif echo "$line" | grep -qi "generated" && echo "$line" | grep -qi "claude"; then
        echo "🧹 Removing line containing 'generated' and 'claude': $line" >&2
        LINES_REMOVED=true
    else
        # Keep the line
        echo "$line" >> "$TEMP_FILE"
    fi
done < "$COMMIT_MSG_FILE"

# Replace the original file with the cleaned version
mv "$TEMP_FILE" "$COMMIT_MSG_FILE"

# Inform user if lines were removed
if [ "$LINES_REMOVED" = true ]; then
    echo "✅ Automatically removed lines containing both 'co-authored'+'claude' or 'generated'+'claude'" >&2
fi

# Clean up any empty lines at the end (simplified to avoid hanging)
sed -i '' -e '/^[[:space:]]*$/d' "$COMMIT_MSG_FILE" 2>/dev/null || true
EOF

# Make the hook executable
chmod +x .husky/prepare-commit-msg

# Add husky install script to package.json if not already present
echo "⚙️  Configuring package.json prepare script..."
if ! grep -q '"prepare".*"husky install"' package.json; then
    # Use node to safely add the prepare script
    node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        if (!pkg.scripts) pkg.scripts = {};
        if (!pkg.scripts.prepare) {
            pkg.scripts.prepare = 'husky install';
            fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
            console.log('✅ Added prepare script to package.json');
        } else {
            console.log('✅ Prepare script already exists in package.json');
        }
    "
else
    echo "✅ Prepare script already configured in package.json"
fi

# Test the hook by creating a temporary commit message
echo "🧪 Testing the hook..."
echo "Test commit message

Co-Authored-By: Claude <noreply@anthropic.com>
🤖 Generated with Claude Code" > /tmp/test_commit_msg.tmp

# Test the hook
if .husky/prepare-commit-msg /tmp/test_commit_msg.tmp; then
    echo "✅ Hook test passed!"
    if grep -q "Claude" /tmp/test_commit_msg.tmp; then
        echo "❌ Warning: Hook may not be working correctly - Claude references still present"
    else
        echo "✅ Hook working correctly - Claude references removed"
    fi
else
    echo "❌ Warning: Hook test failed"
fi

# Clean up test file
rm -f /tmp/test_commit_msg.tmp

echo ""
echo "🎉 Setup complete! Your project now has Claude commit message cleaning configured."
echo ""
echo "📋 What was installed:"
echo "  ✅ Husky git hooks manager"
echo "  ✅ prepare-commit-msg hook that removes Claude co-author and generated lines"
echo "  ✅ Package.json prepare script for automatic husky installation"
echo ""
echo "🔄 The hook will automatically:"
echo "  • Remove lines containing both 'co-authored' and 'claude' (case insensitive)"
echo "  • Remove lines containing both 'generated' and 'claude' (case insensitive)"
echo "  • Clean up empty lines"
echo ""
echo "💡 Note: This helps maintain clean commit history when working with Claude Code"
echo "    while preserving other co-author attributions and generated content notices."