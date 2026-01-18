import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Get budget order for user
 * @param {string} userId - User ID
 * @returns {Promise<string[]>} Array of budget IDs in order
 */
export const getBudgetOrder = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return userSnap.data()?.settings?.budgetOrder || [];
        }
        return [];
    } catch (error) {
        console.error('Failed to get budget order:', error);
        return [];
    }
};

/**
 * Save budget order for user
 * @param {string} userId - User ID
 * @param {string[]} orderIds - Array of budget IDs in order
 * @returns {Promise<boolean>} Success status
 */
export const saveBudgetOrder = async (userId, orderIds) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            'settings.budgetOrder': orderIds,
            updatedAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('Failed to save budget order:', error);
        return false;
    }
};

/**
 * Get wallet order for user
 * @param {string} userId - User ID
 * @returns {Promise<string[]>} Array of wallet IDs in order
 */
export const getWalletOrder = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return userSnap.data()?.settings?.walletOrder || [];
        }
        return [];
    } catch (error) {
        console.error('Failed to get wallet order:', error);
        return [];
    }
};

/**
 * Save wallet order for user
 * @param {string} userId - User ID
 * @param {string[]} orderIds - Array of wallet IDs in order
 * @returns {Promise<boolean>} Success status
 */
export const saveWalletOrder = async (userId, orderIds) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            'settings.walletOrder': orderIds,
            updatedAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('Failed to save wallet order:', error);
        return false;
    }
};
