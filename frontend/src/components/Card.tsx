"use client";

import Image from "next/image";
import React from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";

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

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] w-full max-w-[70%]">
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
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">SKU: {sku}</p>
        <p className="text-sm text-gray-600">{description}</p>

        <div className="flex items-center text-gray-500 text-sm mt-2">
          <CalendarIcon className="w-4 h-4 mr-1" />
          <span>{formattedDate}</span>
        </div>

        <p className="text-sm font-semibold text-gray-700">
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
