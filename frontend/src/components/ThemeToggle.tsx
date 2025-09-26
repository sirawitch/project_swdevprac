'use client';

import useTheme from '../hooks/useTheme';

const ThemeToggle = () => {
    const [theme, setTheme] = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <button
        onClick={toggleTheme}
        className="cursor-pointer font-bold text-white no-underline hover:text-blue-400 transition-colors z-20"
        >
            {/* {theme === 'light' ? '🌕' : '☀️'} */}
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
    );
};

export default ThemeToggle;
