// src/lib/accountStore.js
// CRUD operations for developer accounts persisted in localStorage, delegating to unified store.js

import { store } from './store';

export function getAccounts() {
  return store.getAccounts();
}

export function getAccount(id) {
  const accounts = store.getAccounts();
  return accounts.find(a => a.id === id) || null;
}

export function addAccount(accountData) {
  return store.addAccount(accountData);
}

export function updateAccount(id, updates) {
  return store.updateAccount(id, updates);
}

export function deleteAccount(id) {
  store.deleteAccount(id);
  return true;
}

export function getStats() {
  const accounts = store.getAccounts().filter(a => !a.deletedAt);
  const totalAccounts = accounts.length;
  const totalCredits = accounts.reduce((sum, a) => sum + (a.credits || 0), 0);
  const activeAccounts = accounts.filter(a => a.status === 'active').length;
  return {
    totalAccounts,
    totalCredits,
    activeAccounts
  };
}
