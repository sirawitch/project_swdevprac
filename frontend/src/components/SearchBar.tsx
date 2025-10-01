"use client";

import React from "react";
import { useTheme } from '../context/ThemeContext';

// อัปเดต Props ให้รับค่า field ด้วย
interface SearchBarProps {
  onSearch: (query: string, quota: number | null, field: "name" | "sku") => void;
  currentQuery: string;
  currentQuota: number | null;
  currentField: "name" | "sku"; // เพิ่ม prop สำหรับ field ที่ถูกเลือกปัจจุบัน
}

/**
 * Component สำหรับช่องค้นหาสินค้า (Art Toy)
 * ประกอบด้วยตัวเลือก Name/SKU, ช่องค้นหาด้วยข้อความ และช่องกรองตามจำนวนวันที่มาถึง
 * @param onSearch ฟังก์ชันที่จะถูกเรียกเมื่อกดค้นหา
 * @param currentQuery สถานะของคำค้นหาปัจจุบัน
 * @param currentQuota สถานะของจำนวนวันที่ใช้กรองปัจจุบัน
 * @param currentField สถานะของ field ที่กำลังค้นหาอยู่
 */
export default function SearchBar({
  onSearch,
  currentQuery,
  currentQuota,
  currentField,
}: SearchBarProps) {
  const { theme } = useTheme();
  const [search, setSearch] = React.useState(currentQuery);
  const [quota, setQuota] = React.useState<string>(
    currentQuota !== null ? String(currentQuota) : ""
  );
  const [searchField, setSearchField] = React.useState<"name" | "sku">(
    currentField
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const quotaValue = quota ? parseInt(quota) : null;

    onSearch(search, quotaValue, searchField);
  };

  // Set background and text colors based on theme
  const bgClass = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const textPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const inputBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const inputBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const placeholderColor = theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400';
  const hoverBgGray = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';

  return (
    <form
      onSubmit={handleSearch}
      className={`flex flex-col w-full max-w-4xl mx-auto space-y-6 p-6 rounded-2xl shadow-xl transition-all ${bgClass}`}
    >
      {/* Search Field Selector */}
      <div className="flex flex-wrap items-center space-x-4">
        <label className={`font-medium text-sm ${textSecondary}`}>
          Search From:
        </label>
        <div className={`flex p-1 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          {(['name', 'sku'] as Array<'name' | 'sku'>).map((field) => {
            const isActive = searchField === field;

            return (
              <button
                key={field}
                type="button"
                onClick={() => setSearchField(field)}
                className={`
                  cursor-pointer relative inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:scale-105'
                    : `${textPrimary} border border-transparent hover:border-blue-500 hover:text-blue-600 hover:bg-blue-100`}
                  ${theme === 'dark' ? `dark:hover:bg-gray-800` : `? dark:hover:bg-gray-100`}
                `}
              >
                {field.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search + Quota + Submit */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder={`Enter ${searchField === 'name' ? 'Name' : 'SKU'} to search`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`flex-grow p-3 rounded-xl shadow-inner transition focus:ring-2 focus:ring-blue-500 focus:outline-none
            ${inputBg} ${inputBorder} ${placeholderColor} border text-sm ${textPrimary}`}
        />

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <label htmlFor="quota-filter" className={`font-medium text-sm ${textSecondary}`}>
            Minimum Quota:
          </label>
          <input
            id="quota-filter"
            type="number"
            min="0"
            placeholder="Quota"
            value={quota}
            onChange={(e) => setQuota(e.target.value)}
            className={`
              w-24 p-3 rounded-xl text-center shadow-inner transition
              focus:ring-2 focus:ring-blue-500 focus:outline-none
              appearance-none
              ${inputBg} ${inputBorder} ${placeholderColor} border text-sm ${textPrimary}
            `}
          />
        </div>

        <button
          type="submit"
          className={`
            cursor-pointer group relative inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-white transition-all duration-300
            bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg hover:scale-105
            w-full md:w-auto
          `}
        >
          Search
        </button>
      </div>
    </form>
  );
}
