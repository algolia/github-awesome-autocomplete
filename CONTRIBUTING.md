## RELEASING

Make sure you are on a clean `master` branch.

Run & follow the instructions:

```bash
scripts/release.sh
```
This will do several things:
- Ask for the new version
- Update the version number throughout the codebase
- Add the latest changes to the CHANGELOG.md
- Commit everything to a new `chore(release): $PACKAGE_VERSION` commit
- Push the changes to the git repository
- Tag the release commit with the version number and push the tags to the repository

After this, you still need to manually publish the extensions on the different marketplaces.
All archives are ready in the `build` directory.

### Release Chrome extension

```bash
yarn run webstore upload \
    --source "build/unpacked-prod" \
    --extension-id "djkfdjpoelphhdclfjhnffmnlnoknfnd" \
    --client-id "to-be-filled" \
    --client-secret "to-be-filled" \
    --refresh-token "to-be-filled" \
    --auto-publish
```

### Release Firefox extension

Go here: https://addons.mozilla.org/en-US/developers/addon/github-awesome-autocomplete/versions/submit/agreement

When asked for the archive, send the zip archive named: `build/firefox-x.x.x.zip`.

Next steps are straight forward.

### Release Safari extension

TODO
