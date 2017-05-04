#!/bin/bash
gulp &&
  npm version $1 &&
  github_changelog_generator &&
  git add CHANGELOG.md &&
  git commit -m "Update history of changes in CHANGELOG.md" &&
  npm publish
