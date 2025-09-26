'use client';

export default function ThemeToggle({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
    return (
        <button 
            onClick={toggleTheme}
            className="cursor-pointer font-bold text-white no-underline hover:text-blue-400 transition-colors z-20"
        >
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
    );
}
