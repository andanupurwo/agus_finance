// Tailwind dark mode color utilities
export const colors = {
  // Background
  bg: {
    primary: 'bg-slate-50 dark:bg-slate-950',
    secondary: 'bg-white dark:bg-slate-900',
    tertiary: 'bg-slate-100 dark:bg-slate-800',
    hover: 'hover:bg-slate-100 dark:hover:bg-slate-800',
    muted: 'bg-slate-50/50 dark:bg-slate-900/50',
  },
  
  // Text
  text: {
    primary: 'text-slate-900 dark:text-white',
    secondary: 'text-slate-700 dark:text-slate-300',
    muted: 'text-slate-600 dark:text-slate-400',
    light: 'text-slate-500 dark:text-slate-500',
  },
  
  // Border
  border: {
    light: 'border-slate-200 dark:border-slate-800',
    lighter: 'border-slate-100 dark:border-slate-900',
  },
  
  // Input
  input: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500',
  
  // Card
  card: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800',
  
  // Button
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white',
    secondary: 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700',
  },
};
