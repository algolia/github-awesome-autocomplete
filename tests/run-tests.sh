#!/bin/bash

# if node dependencies are not installed, install them..
if [ ! -d "node_modules" ]
then
   echo Installing dependencies..
   npm install
fi

##
# run tests
#
echo "Starting test execution:"
echo ""
jasmine-node --verbose specs
