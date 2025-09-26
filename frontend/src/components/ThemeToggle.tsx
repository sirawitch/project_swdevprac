'use client';

import { useTheme } from '../context/ThemeContext';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'; // optional

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        className={`
            relative w-14 h-8 rounded-full
            transition-colors duration-300
            ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}
            flex items-center px-1
        `}
        >
        <div
            className={`
            w-6 h-6 rounded-full bg-white shadow-md transform
            transition-transform duration-300 ease-in-out
            ${isDark ? 'translate-x-6' : 'translate-x-0'}
            hover:ring-2 hover:ring-blue-400 cursor-pointer
            `}
        >
            <div className="w-full h-full flex items-center justify-center">
            {isDark ? (
                <MoonIcon className="w-4 h-4 text-yellow-400" />
            ) : (
                <SunIcon className="w-4 h-4 text-yellow-500" />
            )}
            </div>
        </div>
        </button>
    );
};

export default ThemeToggle;
