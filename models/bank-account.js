function BankAccount() {
  this.balance = 0;
  this.income = 0;
  this.unusableFunds = 0;

  this.updateUnusableFunds = function(funds) {
    this.unusableFunds += funds;
  };
  this.addIncome = function(income) {
    this.income += income;
  };
  this.addBalance = function(amount) {
    this.balance += amount;
  };
  this.usableBalance = function() {
    return this.balance - this.unusableFunds;
  };
};

module.exports = BankAccount;
