## Chrome Awesome Autocomplete Extension

### Installation:

```sh
$ git clone https://github.com/algolia/chrome-awesome-autocomplete.git

# in case you don't have Grunt yet:
$ sudo npm install -g grunt-cli
```

### Build instructions:

```sh
$ cd chrome-awesome-autocomplete

# install dependencies
$ npm install

# generate your private key
$ openssl genrsa 2048 | openssl pkcs8 -topk8 -nocrypt > mykey.pem

# build it
$ grunt
```

### Development

When developing, write unit-tests, use `test-cont` Grunt task to check that your JS code passes linting tests and unit-tests.

When ready to try out the extension in the browser, use default Grunt task to build it. In `build` directory you'll find develop version of the extension in `unpacked-dev` subdirectory (with source maps), and production (uglified) version in `unpacked-prod` directory. The `.crx` packed version is created from `unpacked-prod` sources.

### Grunt tasks:

* `clean`: clean `build` directory
* `test`: JS-lint and mocha test, single run
* `test-cont`: continuos `test` loop
* default: `clean`, `test`, build step (copy all necessary files to `build`
  directory, browserify JS sources, prepare production version (using uglify),
  pack the `crx` (using official shell script), and copy the resulting `crx` to
  CircleCI artifacts directory (only when on CircleCI))
