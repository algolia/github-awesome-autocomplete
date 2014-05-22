All the files here are considered to be *entry points* from `manifest.json` or
from any of the HTML pages in `html` directory.

All files here are written as node.js modules, so they can be easily tested
during build process using `mocha` test framework.

In the resulting extension, however, will only see *processed* files (i.e. no
`libs` or `modules` directory will be visible to the extension). 
