# chrome-skeleton

## Minimal skeleton for Google Chrome extension

This project is an example of a Google Chrome extension, that uses RequireJS
to load code modules and at the same time is compliant with *Manifest file v2
limitations*. For more details on this topic, please see this
[presentation](http://prezi.com/rodnyr5awftr/requirejs-in-chrome-extensions/)
by Daniel Prentis.

The extension demonstates the usage of background page, extension popup window
and inserting content scripts into the target pages. Communication between the
background window and the content scripts is implemented using messaging. Also,
both the content script and the popup window use Mustache templates.

The goal of this project is to have a skeleton for Google Chrome extensions, so
you can download it or fork it, and then develop your own extension without
spending too much time with figuring out the basics.

Should you have any comments, don't hesitate and let us know!


## Directory structure

    /code
        /css
        /html
            /templates
        /images
        /js
            /lib
            /modules
                /type_a
                /type_b
                /...
                /util
    /tests
        /test
            /modules
            /specs

In `code` directory you will find:
*	`css` - any css files used by the extension
* `html` - any html files used by the extension
* `html/templates` - html Mustache templates used for rendering html code
* `images` - any graphics used by the extnesion
* `js` - code javascript files (entry point for background script, content
script(s), and popup script
* `js/lib` - third party libraries, see README.md file there for details
* `js/modules` - all extension-specific code in AMD modules (can be
organised in sub-directories, e.g. `type_a`, ...
* `js/util` - common functionality (messaging and templates) for the
extensions, written as AMD modules

In `tests` directory you will find:
*	`test` - test related JavaScript code forJasmine-node
*	`modules` - unit test-specific utility and RequireJS configuration
*	`specs` - unit test modules


## Running tests

1. Install jasmine-node first:

    `npm install -g jasmine-node`

2. In `tests` directory run `run-tests.sh` *(it installs required dependencies first)*
