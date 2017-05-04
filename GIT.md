# Protocol to release or create a new feature

## Release

```
gulp
gulp test
npm version [patch|minor|major]
github_changelog_generator
git add CHANGELOG.md
git commit -m "Update history of changes in CHANGELOG.md" &&
npm publish
```

## Feature

```
git flow feature  [name]
```

Add new commits...

```
gulp &&
  gulp test &&
  github_changelog_generator &&
  git add CHANGELOG.md &&
  git commit -m "Update history of changes in CHANGELOG.md" &&
```