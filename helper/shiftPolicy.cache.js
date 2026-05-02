'use strict';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

let cachedPolicy = null;
let cachedAt = null;

function getCachedShiftPolicy() {
  if (!cachedPolicy || !cachedAt) return null;

  const isExpired = Date.now() - cachedAt > ONE_DAY_MS;
  if (isExpired) {
    clearShiftPolicyCache();
    return null;
  }

  return cachedPolicy;
}

function setCachedShiftPolicy(policy) {
  cachedPolicy = policy;
  cachedAt = Date.now();
}

function clearShiftPolicyCache() {
  cachedPolicy = null;
  cachedAt = null;
}

module.exports = {
  getCachedShiftPolicy,
  setCachedShiftPolicy,
  clearShiftPolicyCache
};
