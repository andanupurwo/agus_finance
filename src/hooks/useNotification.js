// Context untuk notification agar bisa diakses dari hooks
import { createContext, useContext } from 'react';

export const NotificationContext = createContext({
  showToast: () => {},
  showConfirm: () => Promise.resolve(false),
});

export const useNotification = () => useContext(NotificationContext);
