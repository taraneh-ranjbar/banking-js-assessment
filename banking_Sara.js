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

// Accepting a function as an argument demonstrates that functions are first-class values
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
// The original issue occurs because the method loses its context when passed as a callback

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
