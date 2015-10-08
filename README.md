This is the OEG implementation built on Node.js
===============================================

Usage
-----

#### Prerequisites
  * [npm](http://npmjs.com)
  * [Grunt](http://gruntjs.com) (For testing)

Then run `npm install`

#### Running
`node index.js`

Testing
-------

#### Running Tests
`npm test`
This will run the syntax checker and Mocha tests with grunt

#### Writing Tests
This project is tested using [Mocha](http://mochajs.org) and [Chai](http://chaijs.com)

Each feature should (ideally) have a set of unit tests.  
If you are about to develop MyNewFeature, you should create the file `my-new-feature.js`
in `tests/unit` or `tests/integration` depending on the scope of the tests. That file
should then be added to `tests.html` as a script. Follow the pattern of the other
tests in the repo.


### Contributors

Nate Benz  
Aaron Hartke  
Dan Reinke  
Zach Rivett  
Nathanael Smith  
