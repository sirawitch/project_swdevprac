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
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <div className="relative w-full h-64 overflow-hidden">
        {posterPicture ? (
          <Image
            src={posterPicture}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500 mb-2">SKU: {sku}</p>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
        </div>
        <p className="text-gray-600 font-semibold text-sm">
          Available Quota: {availableQuota}
        </p>
        <div className="mt-4">
          <button
            onClick={onOrderClick}
            className="w-full py-2 px-4 rounded-md font-bold transition-colors bg-blue-600 text-white hover:bg-blue-700"
          >
            Order this toy
          </button>
        </div>
      </div>
    </div>
  );
}
