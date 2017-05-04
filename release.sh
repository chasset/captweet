#!/bin/bash
gulp &&
  npm version $1 &&
  git flow release finish $2 &&
  github_changelog_generator &&
  git add CHANGELOG.md &&
  git commit -m "Update history of changes in CHANGELOG.md" &&
  npm publish
