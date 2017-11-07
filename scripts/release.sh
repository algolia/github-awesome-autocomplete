#!/bin/bash

set -eu

readonly CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != master ]; then
  echo "You must be on 'master' branch to publish a release, aborting..."
  exit 1
fi

if ! git diff-index --quiet HEAD --; then
  echo "Working tree is not clean, aborting..."
  exit 1
fi

if ! yarn; then
  echo "Failed to install yarn dependencies, aborting..."
  exit 1
fi

yarn run changelog:unreleased

# Only update the package.json version
# We need to update changelog before tagging
# And publishing.
yarn version --no-git-tag-version

if ! yarn run changelog; then
  echo "Failed to update changelog, aborting..."
  exit 1
fi

readonly PACKAGE_VERSION=$(< package.json grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[:space:]')

# Update version in code/Info.plist
readonly SEMVER_REGEX="[[:digit:]]\.[[:digit:]]\.[[:digit:]]"
sed -i "
/<key>CFBundleShortVersionString<\/key>/ {
	N
	s/\(<string>\)$SEMVER_REGEX\(<\/string>\)/\1$PACKAGE_VERSION\2/
}" ./code/Info.plist

# Build the archives so that they can be submitted
if ! yarn run grunt; then
  echo "Build failed, aborting..."
  exit 1
fi

# Gives user a chance to review and eventually abort.
git add --patch
git commit --message="chore(release): $PACKAGE_VERSION"
git push origin HEAD
git tag "$PACKAGE_VERSION"
git push --tags

echo "Tagged version $PACKAGE_VERSION."
echo "You now need to manually deploy the extensions on the different marketplaces."
echo "The archives in ./build are ready to be published."
echo "Find the instructions in the CONTRIBUTING.md file here: https://github.com/algolia/github-awesome-autocomplete/blob/master/CONTRIBUTING.md."
