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

