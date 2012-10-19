chrome-skeleton
===============

**Minimal skeleton for Chrome extension**

Prepared by Daniel Prentis, based on his solution that uses RequireJS to load modules in Chrome, to comply with *Manifest v2.0 limitations*.
See Daniel's presentation on the topic [RequireJS In Chrome Extensions](http://prezi.com/rodnyr5awftr/requirejs-in-chrome-extensions/)

Directory structure
-------------------

	/html
	/js
	/lib
		/modules
			/moduleA
			/moduleB
		/test
			/specs
			/modules


*	`/html` - any html files used by the extension

*	`/js` - all extension JavaScript Code

	Default libraries are in the root: background.js, content.js, popup.js, requireConfig.js, requireContent.js

*	`/lib` - external libraries

	by default it includes: backbone.js, jquery.js, require.js, underscore.js, underscore.string.js

*	`/modules` - all extension-specific code in AMD modules

*	`/test` - test related JavaScript code forJasmine-node
*	`/spec` - unit test modules
*	`/modules` - unit test-specific utility and RequireJS configuration

*	`manifest.json` - plug-in manifest file
*	`package.json` - package dependencies

*	`run-tests.sh` - shell script tu run tests

Running tests
-------------

1. Install  jasmine-node first:

		npm install -g jasmine-node

2. Run `run-tests.sh`. *(It installs required dependencies first.)*
