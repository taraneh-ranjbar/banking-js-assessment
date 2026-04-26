// ==============================
// Starter Data (Do not modify)
// ==============================

const accounts = [
  { id: 101, holder: 'Ali Hassan', balance: 2500, isActive: true, transactions: [200, -50, -100] },
  { id: 102, holder: 'Sara Ali', balance: null, isActive: true, transactions: [500, -120] },
  { id: 103, holder: null, balance: 900, isActive: false, transactions: [100, -20, -30] },
  { id: 104, holder: 'John Doe', balance: 5000, isActive: true, transactions: [1000, -200, -300, 150] }
];

const roleCapabilities = {
  Viewer: {
    viewAccount(accountId) {
      return `${this.name} viewed account ${accountId}`;
    }
  },
  Auditor: {
    viewAuditLogs() {
      return `${this.name} viewed audit logs`;
    }
  },
  Approver: {
    approveLoan(loanId) {
      return `${this.name} approved loan ${loanId}`;
    }
  },
  TransferOperator: {
    transferFunds(fromId, toId, amount) {
      return `${this.name} transferred $${amount} from ${fromId} to ${toId}`;
    }
  }
};

// ==============================
// Task 1 — Pure Function
// ==============================

// Cleans and normalizes account data without mutating the original object
function formatAccount(account) {
  const safeHolder = account.holder ?? 'UNKNOWN';
  const safeBalance = account.balance ?? 0;

  return {
    ...account, // copy (immutability) /I don’t mutate original data — I create a new object
    holder: safeHolder,
    balance: safeBalance,
    status: account.isActive ? 'ACTIVE' : 'INACTIVE',
    availableBalance: safeBalance
  };
}

console.log(formatAccount(accounts[2]));
// Why is a pure function important in banking?
//Because it provides predictable behavior, high testability, and prevents side effects in sensitive financial calculations.


// ==============================
// Task 2 — Functional Refactor
// ==============================

// Using filter + map makes the intent clearer compared to a loop
const result = accounts
  .filter(acc => acc.isActive && (acc.balance ?? 0) > 1000)
  .map(acc => ({
    id: acc.id,
    holder: (acc.holder ?? 'UNKNOWN').toUpperCase(),
    balanceWithBonus: (acc.balance ?? 0) * 1.02
  }));
console.log(accounts); // Original data remains unchanged, demonstrating immutability
console.table(result); // Output the transformed data in a readable format

// Functional version clearly separates "what to select" (filter)
// from "how to transform" (map), unlike the loop which mixes both concerns.


// ==============================
// Task 3 — reduce
// ==============================

// Calculates the net total of transactions
function getNetTransactionTotal(transactions) {
  return transactions.reduce((total, value) => total + value, 0); // initial value ensures safe calculation even for empty arrays
}

console.log(getNetTransactionTotal([200, -50, -100])); // 50
console.log(getNetTransactionTotal([500, -120]));      // 380
console.log(getNetTransactionTotal([]));               // 0

// ==============================
// Task 4 — Higher-Order Function
// ==============================

// Because we can pass functions like regular values, JavaScript treats them as first-class citizens.
function processAccounts(accounts, formatter) {
  return accounts.map(formatter);
}
//Test the higher-order function with the previously defined formatAccount function
const processedAccounts = processAccounts(accounts, formatAccount);
console.table(processedAccounts); // Output the processed accounts in a readable format

const names = processAccounts(accounts, (acc) => acc.holder ?? 'UNKNOWN');
console.log(names);

// ==============================
// Task 5 — this and bind
// ==============================
const accountAlert = {
  bankName: 'Secure Bank',
  sendAlert() {
    console.log(this.bankName + ' alert sent');
  }
};

// Fix using bind to preserve the correct "this" context
setTimeout(accountAlert.sendAlert.bind(accountAlert), 1000);

// Alternative fix using an arrow function wrapper
setTimeout(() => accountAlert.sendAlert(), 1000);
// When passed to setTimeout, the method is called as a plain function,
// so "this" no longer refers to accountAlert but becomes undefined (or window)

// ==============================
// Task 6 — Currying
// ==============================
function createFeeCalculator(rate) {
  return function (amount) {
    return amount * rate;
  };
} // Currying allows fixing the rate once and reusing the returned function for multiple amounts
const wireFee = createFeeCalculator(0.015);
const internationalFee = createFeeCalculator(0.03);
const atmFee = createFeeCalculator(0.005);
console.log(wireFee(1000));        // 15
console.log(wireFee(2000));        // 30

console.log(internationalFee(1000)); // 30
console.log(atmFee(500));            // 2.5
// Currying allows us to fix the rate once and reuse the returned function
// for multiple amounts, improving reusability and reducing repetition.

// ==============================
// Task 7 — Composition
// ==============================

// Base factory for creating employees
function createEmployee(name) {
  return { name };
}

// Assign only the required capabilities to each employee
const ali = Object.assign(
  createEmployee('Ali'),
  roleCapabilities.Viewer,
  roleCapabilities.Auditor
);

const sara = Object.assign(
  createEmployee('Sara'),
  roleCapabilities.Viewer,
  roleCapabilities.TransferOperator
);

const mona = Object.assign(
  createEmployee('Mona'),
  roleCapabilities.Approver,
  roleCapabilities.Auditor,
  roleCapabilities.Viewer
);

// Composition avoids complex inheritance and keeps the design flexible
console.log(ali.viewAccount(101));
console.log(ali.viewAuditLogs());

console.log(sara.viewAccount(102));
console.log(sara.transferFunds(101, 102, 500));

console.log(mona.approveLoan('L-99'));
console.log(mona.viewAuditLogs());
console.log(mona.viewAccount(104));
// Composition is more flexible than inheritance because we can combine
// only the needed capabilities without creating complex class hierarchies.


// ==============================
// Task 8 — Class + Prototype
// ==============================
class BankEmployee {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

// Adding a method to the prototype allows all instances to share it, saving memory
// Instance methods create separate copies per object,
// while prototype methods are shared across all instances, saving memory
Object.assign(
  BankEmployee.prototype,
  roleCapabilities.Viewer,
  roleCapabilities.Auditor
);
const reviewer = new BankEmployee('Layla');

console.log(reviewer.viewAccount(103));
// Layla viewed account 103

console.log(reviewer.viewAuditLogs());
// Layla viewed audit logs

// Assigning methods to the prototype allows all instances to share
// the same functions in memory, unlike assigning them per object.

// ==============================
// Task 9 — Concept Answers
// ==============================

/*
 Q1 — Why is a pure function easier to test in a banking application?

A pure function always produces the same output for the same input and has no side effects. 
This makes it predictable and easy to test in isolation, which is critical in banking systems where accuracy and reliability are essential.

 Q2 — When would you choose bind instead of calling the method directly?

You use bind when passing a method as a callback and you need to preserve its original this context. Without bind, the method loses its object reference when executed later.

 Q3 — Difference between first-class and higher-order functions?

First-class functions are treated like values — they can be passed, returned, or stored. A higher-order function is a function that takes another function as an argument or returns one.

 Q4 — Difference between currying and bind? When to use each?

Currying transforms a function to take arguments one at a time and is used for reusability by fixing values like configuration (e.g., rate). Bind is used to fix the this context of a function (and optionally preset arguments) when dealing with object methods.

 Q5 — Why prefer composition over inheritance in permission systems?

Composition is more flexible because it allows combining only the required capabilities without creating complex and rigid class hierarchies. It also improves maintainability and avoids duplication.
*/


// ==============================
// Optional Challenge
// ==============================

const secureTransfer = {
  transferIfApproved(amount, approved) {
    return approved
      ? `${this.name} securely transferred $${amount}`
      : 'Transfer denied';
  }
};

Object.assign(sara, secureTransfer);

console.log(sara.transferIfApproved(5000, false));
// Transfer denied

console.log(sara.transferIfApproved(5000, true));
// Sara securely transferred $5000