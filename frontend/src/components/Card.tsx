'use client';

import Image from "next/image";
import React from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useTheme } from '../context/ThemeContext';

interface CardProps {
  sku: string;
  name: string;
  description: string;
  arrivalDate: string;
  availableQuota: number;
  posterPicture: string;
  onOrderClick: () => void;
  userRole: string;
}

export default function Card({
  sku,
  name,
  description,
  arrivalDate,
  availableQuota,
  posterPicture,
  onOrderClick,
  userRole,
}: CardProps) {
  const formattedDate = new Date(arrivalDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Set background and text colors based on theme
  const { theme } = useTheme();
  const bgClass = theme === 'dark' ? 'bg-zinc-900' : 'bg-white';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const shadowClass = theme === 'dark' ? 'shadow-md hover:shadow-xl' : 'shadow-md hover:shadow-xl';

  return (
    <div
      className={`${bgClass} ${shadowClass} rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] w-full max-w-[70%]`}
    >
      {/* Image Section */}
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        {posterPicture ? (
          <Image
            src={posterPicture}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-2">
        <h3 className={`text-lg font-semibold ${textPrimary}`}>{name}</h3>
        <p className={`text-sm ${textSecondary}`}>SKU: {sku}</p>
        <p className={`text-sm ${textPrimary}`}>{description}</p>

        <div className={`flex items-center ${textSecondary} text-sm mt-2`}>
          <CalendarIcon className="w-4 h-4 mr-1" />
          <span>{formattedDate}</span>
        </div>

        <p className={`text-sm font-semibold ${textPrimary}`}>
          Available Quota: {availableQuota}
        </p>

        <button
          onClick={onOrderClick}
          className="cursor-pointer mt-4 w-full py-2 px-4 rounded-full font-medium 
          bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-sm
          hover:shadow-md hover:from-emerald-600 hover:to-teal-600 
          transition-all duration-300 ease-in-out"
        >
          Order This Toy!
        </button>
      </div>
    </div>
  );
}
