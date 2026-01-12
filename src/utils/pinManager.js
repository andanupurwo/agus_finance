import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Get PIN data structure from localStorage
 * @param {string} user - Username
 * @returns {object} PIN data object
 */
export const getPinData = (user) => {
  const storageKey = `pin_${user}`;
  const stored = localStorage.getItem(storageKey);
  
  if (!stored) {
    return null;
  }
  
  // Handle legacy plaintext PIN (auto-migrate)
  if (typeof stored === 'string' && !stored.startsWith('{')) {
    // Legacy plaintext PIN detected
    const hash = bcrypt.hashSync(stored, SALT_ROUNDS);
    const newData = {
      hash,
      failedAttempts: 0,
      lockedUntil: null,
      lastChanged: Date.now()
    };
    localStorage.setItem(storageKey, JSON.stringify(newData));
    return newData;
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

/**
 * Set new PIN (hashed)
 * @param {string} user - Username
 * @param {string} pin - New PIN (plaintext)
 */
export const setPinData = (user, pin) => {
  const storageKey = `pin_${user}`;
  const hash = bcrypt.hashSync(pin, SALT_ROUNDS);
  const data = {
    hash,
    failedAttempts: 0,
    lockedUntil: null,
    lastChanged: Date.now()
  };
  localStorage.setItem(storageKey, JSON.stringify(data));
  return data;
};

/**
 * Verify PIN with rate limiting
 * @param {string} user - Username
 * @param {string} inputPin - PIN to verify (plaintext)
 * @returns {object} { success: boolean, message: string, remainingAttempts?: number }
 */
export const verifyPin = (user, inputPin) => {
  const pinData = getPinData(user);
  
  if (!pinData) {
    return { success: false, message: 'User tidak ditemukan' };
  }
  
  // Check if account is locked
  if (pinData.lockedUntil && Date.now() < pinData.lockedUntil) {
    const remainingSeconds = Math.ceil((pinData.lockedUntil - Date.now()) / 1000);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return { 
      success: false, 
      message: `🔒 Akun terkunci. Coba lagi dalam ${minutes}m ${seconds}s` 
    };
  }
  
  // Reset lock if expired
  if (pinData.lockedUntil && Date.now() >= pinData.lockedUntil) {
    pinData.lockedUntil = null;
    pinData.failedAttempts = 0;
  }
  
  // Verify PIN
  const isValid = bcrypt.compareSync(inputPin, pinData.hash);
  
  if (isValid) {
    // Reset failed attempts on success
    pinData.failedAttempts = 0;
    pinData.lockedUntil = null;
    localStorage.setItem(`pin_${user}`, JSON.stringify(pinData));
    return { success: true, message: 'Login berhasil' };
  } else {
    // Increment failed attempts
    pinData.failedAttempts += 1;
    const remaining = MAX_ATTEMPTS - pinData.failedAttempts;
    
    if (pinData.failedAttempts >= MAX_ATTEMPTS) {
      pinData.lockedUntil = Date.now() + LOCKOUT_DURATION;
      localStorage.setItem(`pin_${user}`, JSON.stringify(pinData));
      return { 
        success: false, 
        message: `🔒 Terlalu banyak percobaan gagal. Akun dikunci selama 5 menit.` 
      };
    }
    
    localStorage.setItem(`pin_${user}`, JSON.stringify(pinData));
    return { 
      success: false, 
      message: `PIN salah. ${remaining} percobaan tersisa.`,
      remainingAttempts: remaining
    };
  }
};

/**
 * Change PIN with old PIN verification
 * @param {string} user - Username
 * @param {string} oldPin - Old PIN (plaintext)
 * @param {string} newPin - New PIN (plaintext)
 * @returns {object} { success: boolean, message: string }
 */
export const changePin = (user, oldPin, newPin) => {
  const pinData = getPinData(user);
  
  if (!pinData) {
    // First time setup - no old PIN needed
    setPinData(user, newPin);
    return { success: true, message: 'PIN berhasil dibuat' };
  }
  
  // Verify old PIN
  const isOldValid = bcrypt.compareSync(oldPin, pinData.hash);
  
  if (!isOldValid) {
    return { success: false, message: 'PIN lama salah' };
  }
  
  // Set new PIN
  setPinData(user, newPin);
  return { success: true, message: 'PIN berhasil diganti' };
};

/**
 * Get default PIN for user (for initial setup)
 * @param {string} user - Username
 * @returns {string} Default PIN
 */
export const getDefaultPin = (user) => {
  // Generate deterministic but unique default PIN based on username
  // This is still weak, user should change it immediately
  const hash = user.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return String(hash % 900000 + 100000); // 6 digit number
};

/**
 * Check if user needs to set up PIN
 * @param {string} user - Username
 * @returns {boolean}
 */
export const needsPinSetup = (user) => {
  return !getPinData(user);
};

/**
 * Validate PIN strength
 * @param {string} pin - PIN to validate
 * @returns {object} { valid: boolean, message: string, strength: string }
 */
export const validatePinStrength = (pin) => {
  if (!pin || pin.length !== 6) {
    return { valid: false, message: 'PIN harus 6 digit', strength: 'weak' };
  }
  
  if (!/^\d+$/.test(pin)) {
    return { valid: false, message: 'PIN harus angka saja', strength: 'weak' };
  }
  
  // Check for weak patterns
  const weakPatterns = [
    '000000', '111111', '222222', '333333', '444444', '555555', 
    '666666', '777777', '888888', '999999',
    '123456', '654321', '123321', '111222', '112233'
  ];
  
  if (weakPatterns.includes(pin)) {
    return { valid: false, message: 'PIN terlalu lemah (pola umum)', strength: 'weak' };
  }
  
  // Check for sequential numbers
  const isSequential = /012345|123456|234567|345678|456789|567890/.test(pin);
  if (isSequential) {
    return { valid: false, message: 'PIN terlalu lemah (berurutan)', strength: 'weak' };
  }
  
  // Check for repeated digits
  const repeatedPattern = /(\d)\1{3,}/.test(pin);
  if (repeatedPattern) {
    return { valid: false, message: 'PIN terlalu lemah (digit berulang)', strength: 'weak' };
  }
  
  // Check uniqueness of digits
  const uniqueDigits = new Set(pin.split('')).size;
  if (uniqueDigits < 3) {
    return { valid: true, message: 'PIN lemah (kurang variasi)', strength: 'medium' };
  }
  
  if (uniqueDigits >= 5) {
    return { valid: true, message: 'PIN kuat', strength: 'strong' };
  }
  
  return { valid: true, message: 'PIN sedang', strength: 'medium' };
};
