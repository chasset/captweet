#!/bin/bash
gulp &&
  npm version $1 &&
  git flow release finish $2 &&
  git branch master &&
  github_changelog_generator &&
  git add CHANGELOG.md &&
  git commit -m "Update history of changes in CHANGELOG.md" &&
  git push --all &&
  npm publish
