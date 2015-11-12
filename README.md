This is the OEG implementation built on Node.js
===============================================

Usage
-----

#### Prerequisites
  * [npm](http://npmjs.com)
  * [Grunt](http://gruntjs.com) (For testing)

#### Setup
```
git clone http://bitbucket.org/oegnode/oeg-node-spike.git
cd oeg-node-spike
npm install && npm test
```

#### Run
`npm start`

This will start the server in development on a random user port. To specify a port or environment, use the -p and -e flags   

`npm start -- -p <port> -e <environment>`


Testing
-------

#### Running Tests
`npm test`
This will run the syntax checker and Mocha tests with grunt.  
See "Run" about starting the test server on a specific port.  

#### Writing Tests
This project is tested using [Mocha](http://mochajs.org) and npm's [assert](http://www.npmjs.com/package/assert) module.

Each feature should have a set of unit tests.  
If you are about to develop MyNewFeature, you should create the file `my-new-feature-test.js`
in `tests/unit` or `tests/integration` depending on the scope of the tests. Follow the 
pattern of the other tests in the repo to get started.

#### ESLint
[ESLint](http://www.eslint.org) is used for syntax checking and style enforcement. Changes can be made in `config/.eslintrc`.
Any proposed changes to project style guidelines should be submitted in a PR for review.


### Contributors
Nate Benz  
Aaron Hartke  
Dan Reinke  
Zach Rivett  
Nathanael Smith  
