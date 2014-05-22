The `name`, `version` and `description` fields will be added to the
`manifest.json` file from main `package.json` during the build process. The JS
files referenced here and also in all the HTML files in `html` directory will
see the *processed* files (all the dependencies resolved).
