#!/bin/bash

# Remove the OpenAI API key from Git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env .env.example" \
  --prune-empty --tag-name-filter cat -- --all

# Add proper entries to .gitignore if not already there
if ! grep -q "^\.env$" .gitignore; then
  echo ".env" >> .gitignore
fi

echo "Secret removed from Git history."
echo "Now update .env.example with a safe placeholder"
echo "Then commit these changes and force push with:"
echo "git push origin --force"
