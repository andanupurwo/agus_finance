export const formatRupiah = (num) => new Intl.NumberFormat('id-ID').format(num);
export const parseRupiah = (str) => parseInt(str.replace(/\./g, '')) || 0;

export const isCurrentMonth = (dateString) => {
  const selectedDate = new Date(dateString);
  const today = new Date();
  return selectedDate.getFullYear() === today.getFullYear() &&
    selectedDate.getMonth() === today.getMonth();
};

export const getMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    min: firstDay.toISOString().split('T')[0],
    max: lastDay.toISOString().split('T')[0]
  };
};

/**
 * Get display name for transaction user
 * Uses real-time lookup from familyUsers map based on createdBy field
 * Falls back to static user field for backward compatibility
 * 
 * @param {object} transaction - Transaction object
 * @param {object} familyUsers - Users lookup map { userId: displayName }
 * @returns {string} Display name
 */
export const getTransactionUserName = (transaction, familyUsers = {}) => {
  // Priority 1: Lookup dari createdBy (real-time, always up-to-date)
  if (transaction.createdBy && familyUsers[transaction.createdBy]) {
    return familyUsers[transaction.createdBy];
  }

  // Priority 2: Fallback ke field user (static, for old transactions)
  if (transaction.user) {
    return transaction.user;
  }

  // Priority 3: Unknown user
  return 'Unknown';
};
