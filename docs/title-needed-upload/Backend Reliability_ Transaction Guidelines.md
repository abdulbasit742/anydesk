# Backend Reliability: Transaction Guidelines

Database transactions are essential for maintaining data integrity and consistency, especially in complex operations involving multiple steps or multiple tables. This document provides guidelines for using transactions effectively in the RemoteDesk backend.

## 1. When to Use Transactions

Use transactions whenever an operation involves:

*   **Multiple Writes:** Updating or inserting into multiple tables that must succeed or fail as a single unit (e.g., creating a user and their initial account settings).
*   **Read-Modify-Write:** Reading data, performing some logic, and then updating the same or related data, where the state must not change between the read and the write (e.g., updating a user's subscription status based on their current usage).
*   **Complex Business Logic:** Any multi-step process where a failure in a later step requires rolling back the changes made in earlier steps.

## 2. Transaction Principles

*   **Atomicity:** All operations within the transaction must either all succeed or all fail.
*   **Consistency:** The transaction must leave the database in a valid state, adhering to all constraints and rules.
*   **Isolation:** Transactions should be isolated from each other to prevent data corruption or inconsistent reads.
*   **Durability:** Once a transaction is committed, its changes must be permanent, even in the case of a system failure.
*   **Keep Transactions Short:** Long-running transactions can hold locks on database resources, leading to performance bottlenecks and potential deadlocks. Perform as much logic as possible *outside* the transaction.

## 3. Implementation Guidelines (using Prisma)

RemoteDesk uses Prisma as its ORM. Prisma provides several ways to handle transactions.

### 3.1. Sequential Transactions (Prisma `$transaction`)

Suitable for a series of independent operations that must succeed or fail together.

```typescript
const [user, settings] = await prisma.$transaction([
  prisma.user.create({ data: { email: 'user@example.com' } }),
  prisma.settings.create({ data: { userId: '...', theme: 'dark' } }),
]);
```

### 3.2. Interactive Transactions (Prisma `$transaction` with a function)

Required when the result of one operation is needed for a subsequent operation within the same transaction.

```typescript
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.findUnique({ where: { id: 'user_id' } });
  if (!user) throw new Error('User not found');

  if (user.balance < amount) {
    throw new Error('Insufficient balance');
  }

  const updatedUser = await tx.user.update({
    where: { id: 'user_id' },
    data: { balance: { decrement: amount } },
  });

  const transactionRecord = await tx.transaction.create({
    data: { userId: 'user_id', amount, type: 'DEBIT' },
  });

  return { updatedUser, transactionRecord };
});
```

## 4. Handling Deadlocks

Deadlocks occur when two or more transactions are waiting for each other to release locks.

*   **Identify Deadlock-Prone Operations:** Operations that update multiple tables in different orders are common causes of deadlocks.
*   **Consistent Update Order:** Always update tables in the same order across different transactions to minimize deadlock risk.
*   **Implement Retries:** If a transaction fails due to a deadlock, it is often safe and appropriate to retry it (refer to `backend-reliability-retry-policy.md`).

## 5. Isolation Levels

Be aware of the database's default isolation level (usually `Read Committed` or `Repeatable Read`). Higher isolation levels provide more consistency but can impact performance. Only change the isolation level if absolutely necessary for a specific, well-justified reason.

## 6. Monitoring and Logging

*   **Log Transaction Failures:** Log any transaction rollbacks, including the error and the context.
*   **Monitor Transaction Duration:** Track the time taken by transactions to identify potential performance issues.
*   **Audit Logging:** Critical business transactions should be recorded in the audit logs (refer to `audit-log-structure.md`).

## 7. Related Documents

*   `backend-reliability-retry-policy.md`
*   `backend-reliability-idempotency.md`
*   `error-handling-conventions.md`
*   `audit-log-structure.md`
