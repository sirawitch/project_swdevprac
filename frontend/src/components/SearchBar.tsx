"use client";

import React from "react";

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

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col w-full max-w-4xl mx-auto space-y-4 p-4 bg-white rounded-xl shadow-lg"
    >
      {/* Search Field Selector */}
      <div className="flex items-center space-x-4">
        <label className="text-gray-600 font-medium whitespace-nowrap">
          Search From:
        </label>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setSearchField("name")}
            className={`
              py-2 px-4 rounded-md text-sm font-semibold transition-colors
              ${
                searchField === "name"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            Name
          </button>
          <button
            type="button"
            onClick={() => setSearchField("sku")}
            className={`
              py-2 px-4 rounded-md text-sm font-semibold transition-colors
              ${
                searchField === "sku"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            SKU
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder={`Fill ${
            searchField === "name" ? "name" : "SKU"
          } to search`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition duration-150"
        />

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <label
            htmlFor="quota-filter"
            className="text-gray-600 font-medium whitespace-nowrap"
          >
            Minimum Quota:
          </label>
          <input
            id="quota-filter"
            type="number"
            placeholder="Quota"
            value={quota}
            onChange={(e) => setQuota(e.target.value)}
            min="0"
            className="w-24 p-3 border border-gray-300 rounded-lg shadow-inner text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition duration-150"
          />
        </div>

        {/* 3. Search Button */}
        <button
          type="submit"
          className="
            py-3 px-6 rounded-lg bg-blue-600 text-white font-bold 
            hover:bg-blue-700 transition-colors shadow-md 
            active:scale-95 transform disabled:bg-gray-400
            w-full md:w-auto
          "
          disabled={false}
        >
          Search
        </button>
      </div>
    </form>
  );
}
