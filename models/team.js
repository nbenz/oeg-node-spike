var BankAccount = require('./bank-account');

function Team(name, password) {
  this.name = name;
  this.password = password;
  this.bankAccount = new BankAccount();
  this.bids = [];
  this.drillRequests = [];
  this.seismicRequests = [];
  this.role = 'team';
};

module.exports = Team;
