# GitHub Awesome Autocomplete

By working every day on building the best search engine, we've become obsessed with our own search experience on the websites and mobile applications we use. GitHub is quite big for us, we use their search bar every day but it was not optimal for our needs: so we just re-built Github's search the way we thought it should be and we now share it with the community via this [Chrome extension](https://chrome.google.com/webstore/detail/github-awesome-autocomple/djkfdjpoelphhdclfjhnffmnlnoknfnd).

Algolia provides a developer-friendly SaaS API for database search. It enables any website or mobile application to easily provide its end-users with an instant and relevant search. With Algolia's unique find as you type experience, users can find what they're looking for in just a few keystrokes. Feel free to give Algolia a try with our 14-days FREE trial at [Algolia](https://www.algolia.com).

At [Algolia](https://www.algolia.com), we're git *addicts* and love using GitHub to store every single idea or project we work on. We use it both for our private and public repositories ([12 API clients](https://www.algolia.com/doc/apiclients), [HN Search](https://github.com/algolia/hn-search) or various [d](https://github.com/algolia/instant-search-demo) [e](https://github.com/algolia/facebook-search) [m](https://github.com/algolia/linkedin-search) [o](https://github.com/algolia/meetup-search) [s](https://github.com/algolia/twitter-search)).

### Installation

Install it from the [Chrome Web Store](https://chrome.google.com/webstore/detail/github-awesome-autocomple/djkfdjpoelphhdclfjhnffmnlnoknfnd).

### Features

This Chrome extension replaces GitHub's search bar and add auto-completion (instant-search & suggestion) capabilities on:

 * top public repositories
 * last active users
 * your private repositories
   * default is without Algolia: done locally in your browser using vanilla JS search
   * ability to use Algolia (typo-tolerant & relevance improved) through a "Connect with GitHub" (oauth2)
 * your issues
   * only available if you choose to "Connect with GitHub"

![capture](capture.gif)

### How does it work?

 * We continuously retrieve most watched repositories and last active users using [GitHub Archive](http://www.githubarchive.org/) dataset
 * Users and repositories are stored in 2 [Algolia](https://www.algolia.com/) indices: `users` and `repositories`
 * The results are fetched using [Algolia's JavaScript API client](https://github.com/algolia/algoliasearch-client-js)
 * The UI uses Twitter's [typeahead.js](http://twitter.github.io/typeahead.js/) library to display the auto-completion menu

### FAQ

#### Why can't I find a public repository?

For now, we only index the most "popular" (most watches) repositories.

#### Why can't I find a user?

For now, we only index the last active (most recent public events) users.

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

# generate your private key
$ openssl genrsa 2048 | openssl pkcs8 -topk8 -nocrypt > mykey.pem

# build it
$ grunt
```

When developing, write unit-tests, use `test-cont` Grunt task to check that your JS code passes linting tests and unit-tests.

When ready to try out the extension in the browser, use default Grunt task to build it. In `build` directory you'll find develop version of the extension in `unpacked-dev` subdirectory (with source maps), and production (uglified) version in `unpacked-prod` directory. The `.crx` packed version is created from `unpacked-prod` sources.

### Grunt tasks

* `clean`: clean `build` directory
* `test`: JS-lint and mocha test, single run
* `test-cont`: continuos `test` loop
* default: `clean`, `test`, build step (copy all necessary files to `build`
  directory, browserify JS sources, prepare production version (using uglify),
  pack the `crx` (using official shell script), and copy the resulting `crx` to
  CircleCI artifacts directory (only when on CircleCI))

