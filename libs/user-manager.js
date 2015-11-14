var root = '..';
var Team = require(root + '/models/team'),
  Director = require(root + '/models/director');

var teams = [];
var director;

function createDirector(name, password) {
  director = new Director(name, password);
}

function getDirector() { 
  return director; 
}

function directorAuthenticated(name, password) {
  return director.name === name && director.password === password;
};

function addTeam(name, password) {
  teams.push(new Team(name, password));
};

function getTeam(teamName) {
  for(var i=0; i<teams.length; i++) {
    if(teams[i].name === teamName) {
      return teams[i];
    }
  }
};

module.exports.createDirector = createDirector;
module.exports.getDirector = getDirector;
module.exports.directorAuthenticated = directorAuthenticated;
module.exports.addTeam = addTeam;
module.exports.getTeam = getTeam;
