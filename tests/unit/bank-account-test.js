var root = '../..';
var assert = require('assert');
var BankAccount = require(root + '/models/bank-account');

describe('BankAccount', function() {
  it('should create an object with all the properties', function() {
    var account = new BankAccount();
    assert.equal(account.balance, 0, 'Expected balance to equal 0'); 
    assert.equal(account.income, 0, 'Expected income to equal 0');
    assert.equal(account.unusableFunds, 0, 'Expected unusableFunds to equal 0');
  });

  it('should instantiate independent objects', function() {
    var act1 = new BankAccount();
    act1.balance = 100000;
    
    var act2 = new BankAccount();
    act2.balance = 50000;

    assert.equal(act1.balance, 100000, 'Expected a balance of 100000');
    assert.equal(act2.balance, 50000, 'Expected a balance of 50000');
  });
});
