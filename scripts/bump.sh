#!/bin/sh

NEW_VERSION_NUMBER=$1

if [ "$NEW_VERSION_NUMBER" = "" ]; then
    >&2 echo "Please specify version"
    exit 1
fi

echo $NEW_VERSION_NUMBER

# Replace the version number in src/scenes/TitleScene.ts (Note: Only tested with GNU sed)
sed -i.bak -r -e "s/(const versionNumber = \"v)(.+)(\"\,.*$)/\1$NEW_VERSION_NUMBER\3/g" src/scenes/TitleScene.ts

if [ $? != 0 ]; then
    >&2 echo "Failure editing src/scenes/TitleScene.ts"
    exit 1
fi

rm src/scenes/TitleScene.ts.bak

# Perform npm version bump, using --no-git-tag-version so that everything can be committed together
npm version $NEW_VERSION_NUMBER --no-git-tag-version

git add src/scenes/TitleScene.ts README.md package.json package-lock.json

git commit -m "Version bump"
