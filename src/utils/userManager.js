import { setPinData, getPinData } from './pinManager';

/**
 * Get all registered users from localStorage
 * @returns {Array} List of user objects
 */
export const getAllUsers = () => {
  const users = [];
  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (key.startsWith('pin_')) {
      const username = key.replace('pin_', '');
      const pinData = getPinData(username);
      
      if (pinData) {
        users.push({
          username,
          lastChanged: pinData.lastChanged,
          failedAttempts: pinData.failedAttempts,
          isLocked: pinData.lockedUntil && Date.now() < pinData.lockedUntil,
          lockedUntil: pinData.lockedUntil
        });
      }
    }
  });
  
  return users.sort((a, b) => (b.lastChanged || 0) - (a.lastChanged || 0));
};

/**
 * Create new user with default PIN
 * @param {string} username - New username
 * @param {string} defaultPin - Default PIN (default: '000000')
 * @returns {object} { success: boolean, message: string }
 */
export const createUser = (username, defaultPin = '000000') => {
  if (!username || username.trim().length < 3) {
    return { success: false, message: 'Username minimal 3 karakter' };
  }
  
  // Check if user already exists
  const existing = getPinData(username);
  if (existing) {
    return { success: false, message: 'User sudah ada' };
  }
  
  // Create user with PIN
  setPinData(username, defaultPin);
  
  return { success: true, message: `User ${username} berhasil dibuat dengan PIN: ${defaultPin}` };
};

/**
 * Reset user PIN to default
 * @param {string} username - Username to reset
 * @param {string} newPin - New PIN (default: '000000')
 * @returns {object} { success: boolean, message: string }
 */
export const resetUserPin = (username, newPin = '000000') => {
  const existing = getPinData(username);
  if (!existing) {
    return { success: false, message: 'User tidak ditemukan' };
  }
  
  setPinData(username, newPin);
  
  return { success: true, message: `PIN ${username} direset ke: ${newPin}` };
};

/**
 * Unlock user account
 * @param {string} username - Username to unlock
 * @returns {object} { success: boolean, message: string }
 */
export const unlockUser = (username) => {
  const pinData = getPinData(username);
  if (!pinData) {
    return { success: false, message: 'User tidak ditemukan' };
  }
  
  const storageKey = `pin_${username}`;
  const updated = {
    ...pinData,
    failedAttempts: 0,
    lockedUntil: null
  };
  
  localStorage.setItem(storageKey, JSON.stringify(updated));
  
  return { success: true, message: `Akun ${username} berhasil dibuka` };
};

/**
 * Delete user
 * @param {string} username - Username to delete
 * @returns {object} { success: boolean, message: string }
 */
export const deleteUser = (username) => {
  const storageKey = `pin_${username}`;
  const existing = localStorage.getItem(storageKey);
  
  if (!existing) {
    return { success: false, message: 'User tidak ditemukan' };
  }
  
  localStorage.removeItem(storageKey);
  
  return { success: true, message: `User ${username} berhasil dihapus` };
};

/**
 * Get user statistics
 * @returns {object} Stats object
 */
export const getUserStats = () => {
  const users = getAllUsers();
  
  return {
    total: users.length,
    active: users.filter(u => !u.isLocked).length,
    locked: users.filter(u => u.isLocked).length
  };
};
