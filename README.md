# GitHub Awesome Autocomplete

By working every day on building the best search engine, we've become obsessed with our own search experience on the websites and mobile applications we use. GitHub is quite big for us, we use their search bar every day but it was not optimal for our needs: so we just re-built Github's search the way we thought it should be and we now share it with the community via this [Chrome](https://chrome.google.com/webstore/detail/github-awesome-autocomple/djkfdjpoelphhdclfjhnffmnlnoknfnd), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/github-awesome-autocomplete/) and [Safari](https://github.algolia.com/github-awesome-autocomplete.safariextz) extensions.

Algolia provides a developer-friendly SaaS API for database search. It enables any website or mobile application to easily provide its end-users with an instant and relevant search. With Algolia's unique find as you type experience, users can find what they're looking for in just a few keystrokes. Feel free to give Algolia a try with our 14-days FREE trial at [Algolia](https://www.algolia.com).

At [Algolia](https://www.algolia.com), we're git *addicts* and love using GitHub to store every single idea or project we work on. We use it both for our private and public repositories ([12 API clients](https://www.algolia.com/doc), [DocSearch](https://community.algolia.com/docsearch), [HN Search](https://github.com/algolia/hn-search) or various [d](https://github.com/algolia/instant-search-demo) [e](https://community.algolia.com/instantsearch.js/examples/media/) [m](https://community.algolia.com/instantsearch.js/examples/e-commerce/) [o](https://community.algolia.com/instantsearch.js/examples/tourism/)).

### Installation

Install it from the stores:

[![chrome](store/chrome-extension.png)](https://chrome.google.com/webstore/detail/github-awesome-autocomple/djkfdjpoelphhdclfjhnffmnlnoknfnd)
[![firefox](store/firefox-addon.png)](https://addons.mozilla.org/en-US/firefox/addon/github-awesome-autocomplete/)
[![safari](store/safari-extension.png)](https://github.algolia.com/github-awesome-autocomplete.safariextz)

### Features

This extension replaces GitHub's search bar and add auto-completion (instant-search & suggestion) capabilities on:

 * top public repositories
 * last active users
 * your private repositories
   * default is without Algolia: done locally in your browser using vanilla JS search
   * ability to use Algolia (typo-tolerant & relevance improved) through a "Connect with GitHub" (oauth2)
 * your issues
   * only available if you choose to "Connect with GitHub"

![capture](capture.gif)

### How does it work?

 * We continuously retrieve active repositories and users using [GitHub Archive](http://www.githubarchive.org/)'s dataset
 * Users and repositories are stored in 2 [Algolia](https://www.algolia.com/) indices: `users` and `repositories`
 * The results are fetched using [Algolia's JavaScript API client](https://github.com/algolia/algoliasearch-client-js)
 * The UI uses Twitter's [typeahead.js](http://twitter.github.io/typeahead.js/) library to display the auto-completion menu

### FAQ

#### Are my private repositories sent somewhere?

By default your list of private repositories remains in your local storage. You can allow us to crawl your private repositories with a "Connect with GitHub" (oauth2) action. Your private repositories are then stored securely in our index and only you will be able to search them.

#### My private repository is not searchable, what can I do?

You need to refresh your local list of private repositories:

![refresh](refresh.png)

## Development

### Installation

```sh
$ git clone https://github.com/algolia/chrome-awesome-autocomplete.git

# in case you don't have Grunt yet
$ sudo npm install -g grunt-cli
```

### Build instructions

```sh
$ cd chrome-awesome-autocomplete

# install dependencies
$ npm install

# generate your private key (required for Chrome)
$ openssl genrsa 2048 | openssl pkcs8 -topk8 -nocrypt > mykey.pem

# build it
$ grunt
```

When developing, write unit-tests, use `dev` Grunt task to check that your JS code passes linting tests and unit-tests.

When ready to try out the extension in the browser, use default Grunt task to build it. In `build` directory you'll find develop version of the extension in `unpacked-dev` subdirectory (with source maps), and production (uglified) version in `unpacked-prod` directory.

#### Chrome

The `.crx` packed version is created from `unpacked-prod` sources.

#### Firefox

The `xpi` archive is created from `build/firefox`.

#### Safari

The `safariextz` archive is created from Safari.

### Grunt tasks

* `clean`: clean `build` directory
* `test`: JS-lint and mocha test, single run
* `dev`: continuous `test` loop
* default: `clean`, `test`, build step (copy all necessary files to `build`
  directory, browserify JS sources, prepare production version (using uglify),
  pack the `crx` and `xpi`
