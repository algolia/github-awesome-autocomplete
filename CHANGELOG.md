<a name="1.6.0"></a>
# [1.6.0](https://github.com/algolia/github-awesome-autocomplete/compare/1.5.0...1.6.0) (2017-11-08)


### Features

* **omnibox:** allow searching repositories from the address bar ([0661fb0](https://github.com/algolia/github-awesome-autocomplete/commit/0661fb0))



<a name="1.5.0"></a>
# [1.5.0](https://github.com/algolia/github-awesome-autocomplete/compare/1.4.3...1.5.0) (2017-11-08)


### Bug Fixes

* **autocomplete:** ensure autocomplete is displayed above header actions ([847356a](https://github.com/algolia/github-awesome-autocomplete/commit/847356a))


### Features

* **assets:** update icons ([28999ad](https://github.com/algolia/github-awesome-autocomplete/commit/28999ad))



<a name="1.4.3"></a>
## [1.4.3](https://github.com/algolia/github-awesome-autocomplete/compare/1.4.2...1.4.3) (2017-11-07)


### Bug Fixes

* display full repo name on issues ([f6554d1](https://github.com/algolia/github-awesome-autocomplete/commit/f6554d1))
* limit web accessible resources to what is needed ([932d554](https://github.com/algolia/github-awesome-autocomplete/commit/932d554))
* **style:** restore repo name color to gray in issues ([b0a9efe](https://github.com/algolia/github-awesome-autocomplete/commit/b0a9efe))



CHANGELOG

2017-11-07 1.4.2
      * Add release dependencies
      * Add application ID to Firefox WebExtension manifest

2017-11-07 1.4.1
      * Make sure we use an unmodified version of jQuery

2017-11-07 1.4.0
      * Move to webextension for Firefox (#56)
      * Fixed white color for issue numbers

2017-08-18 1.3.4
      * Dropdown menu fine-tuning (enlarge it)

2017-02-13 1.3.3
      * Upgrade to jQuery 3.1.1

2017-02-13 1.3.2
      * Updating style to fit GH's latest black-header design

2017-01-04 1.3.1
      * Move to jQuery 2.0 to comply with Mozilla's new policies (https://github.com/mozilla/addons-linter/blob/master/docs/third-party-libraries.md)

2017-01-04 1.3.0
      * Move to the compliant `Awesome Autocomplete for GitHub` naming :)
      * Update the Algolia logo
      * Fixed the `Refresh Private repositories` feature
      * Add a `reset` button

2016-04-02 1.2.6
      * Update the CSS to fit GH's recent DOM updates.

2016-03-24 1.2.5
      * Update the code to the new GitHub CSS classes.

2016-03-17 1.2.4
      * Handle the new `.scoped-search` feature (search in "This organization" or "This repository")

2016-02-20 1.2.3
      * CSS fixes

2016-02-10 1.2.2
      * Cannot use `require` in the content-script on Firefox

2016-01-20 1.2.1
      * Firefox/Safari: remove remote font usage
      * Sanitize every single inputs

2016-01-14  1.2.0
      * Move to the new `users` and `repositories` indices which include projects & users created after 01/01/2015
      * Code cleanup

2015-08-09  1.1.4
      * Reflect GitHub's recent form changes

2015-05-14  1.1.3
      * Reflect GitHub's recent form/id changes

2015-01-11  1.1.2
      * Minor fixes

2015-01-08  1.1.1
      * Use non-minified sources
      * Removed JSONP support (security purpose)

2015-01-04  1.1.0
      * Firefox port
      * Private repositories & issues indexing using oauth

2014-12-23  1.0.0
      * Initial release
