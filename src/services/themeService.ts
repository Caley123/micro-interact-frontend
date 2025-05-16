
// Theme management service

// Get theme preference from localStorage
export const getThemePreference = (): 'dark' | 'light' | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('theme') as 'dark' | 'light' | null;
};

// Set theme preference in localStorage and apply it
export const setThemePreference = (theme: 'dark' | 'light') => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('theme', theme);
  
  // Apply theme to document
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Initialize theme based on system preference and saved preference
export const initializeTheme = () => {
  const savedTheme = getThemePreference();
  
  if (savedTheme) {
    setThemePreference(savedTheme);
  } else {
    // Check system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setThemePreference(systemPrefersDark ? 'dark' : 'light');
  }
};
