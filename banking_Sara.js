// ==============================
// Starter Data (Do not modify)
// ==============================

const accounts = [
  { id: 101, holder: 'Ali Hassan', balance: 2500, isActive: true, transactions: [200, -50, -100] },
  { id: 102, holder: 'Sara Ali', balance: null, isActive: true, transactions: [500, -120] },
  { id: 103, holder: null, balance: 900, isActive: false, transactions: [100, -20, -30] },
  { id: 104, holder: 'John Doe', balance: 5000, isActive: true, transactions: [1000, -200, -300, 150] }
];



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