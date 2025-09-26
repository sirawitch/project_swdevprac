import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'light' || storedTheme === 'dark') {
            return storedTheme;
        }
    }
    return 'light'; // default fallback
};

const useTheme = () => {
    const [theme, setTheme] = useState<string>(getInitialTheme);

    // On first mount, sync with localStorage or system preference
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            setTheme(prefersDark ? 'dark' : 'light');
        }
    }, []);

    // Update class and localStorage when theme changes
    useEffect(() => {
        if (typeof window === 'undefined') return;
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return [theme, setTheme] as const;
};

export default useTheme;
