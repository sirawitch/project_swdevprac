"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Card from "@/components/Card";
import Image from "next/image";
import { Fragment } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ArtToy {
  _id: string;
  name: string;
  description: string;
  arrivalDate: string;
  posterPicture: string;
  availableQuota: number;
  sku: string;
}

export default function Home() {
  const [artToys, setArtToys] = useState<ArtToy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>("guest");
  const [selectedToy, setSelectedToy] = useState<ArtToy | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);

  const fetchArtToys = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/arttoys`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setArtToys(data.data);
    } catch (e: any) {
      console.error("Failed to fetch art toys:", e);
      setError("Failed to fetch art toys. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRole = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const role = data.data.role;
        setUserRole(role);
        setIsLoggedIn(true);
        return role;
      } else {
        const guestRole = "guest";
        setIsLoggedIn(false);
        setUserRole(guestRole);
        localStorage.removeItem("token");
        return guestRole;
      }
    } catch (error) {
      const guestRole = "guest";
      setIsLoggedIn(false);
      setUserRole(guestRole);
      localStorage.removeItem("token");
      console.error("Failed to fetch user role:", error);
      return guestRole;
    }
  };

  const handleOrderClick = (toySku: string) => {
    const toyToOrder = artToys.find((toy) => toy.sku === toySku);
    if (toyToOrder) {
      setSelectedToy(toyToOrder);
      setIsModalOpen(true);
      setOrderQuantity(1); // Reset quantity when modal opens
    }
  };

  const handleOrderSubmit = async (toyId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to place an order.");
      setIsModalOpen(false);
      setOrderQuantity(1);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          artToy: toyId,
          orderAmount: orderQuantity,
        }),
      });

      if (response.ok) {
        alert("Order submitted successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to place order: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("An error occurred. Please try again later.");
    }

    setIsModalOpen(false);
    setOrderQuantity(1);
  };

  const handleDecreaseQuantity = () => {
    setOrderQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    if (selectedToy && orderQuantity < selectedToy.availableQuota) {
      setOrderQuantity((prev) => prev + 1);
    } else if (selectedToy && orderQuantity >= selectedToy.availableQuota) {
      alert("Cannot order more than the available quota.");
    }
  };

  useEffect(() => {
    fetchArtToys();
    fetchUserRole();

    const handleLoginStateChange = () => {
      fetchUserRole();
    };

    window.addEventListener("loginStateChange", handleLoginStateChange);

    return () => {
      window.removeEventListener("loginStateChange", handleLoginStateChange);
    };
  }, []);

  if (isLoading) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-700">Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Available Art Toys
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artToys.map((toy) => (
          <Card
            key={toy._id}
            sku={toy.sku}
            name={toy.name}
            description={toy.description}
            arrivalDate={new Date(toy.arrivalDate).toLocaleDateString()}
            availableQuota={toy.availableQuota}
            posterPicture={toy.posterPicture}
            onOrderClick={() => handleOrderClick(toy.sku)}
            userRole={userRole}
          />
        ))}
      </div>

      {isModalOpen && selectedToy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-lg w-full m-4">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setIsModalOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Confirm Order for {selectedToy.name}
            </h2>
            <div className="text-gray-600 mb-4 space-y-2">
              <p>
                <strong>SKU:</strong> {selectedToy.sku}
              </p>
              <p>
                <strong>Description:</strong> {selectedToy.description}
              </p>
              <p>
                <strong>Available Quota:</strong> {selectedToy.availableQuota}
              </p>
            </div>

            <div className="flex items-center justify-center space-x-4 mt-6">
              <button
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                onClick={handleDecreaseQuantity}
                disabled={orderQuantity <= 1}
              >
                <MinusIcon className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-2xl font-bold text-gray-800">
                {orderQuantity}
              </span>
              <button
                className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={handleIncreaseQuantity}
                disabled={
                  selectedToy
                    ? orderQuantity >= selectedToy.availableQuota
                    : true
                }
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                className="py-2 px-4 rounded-md bg-gray-300 text-gray-800 font-bold hover:bg-gray-400 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
                onClick={() => handleOrderSubmit(selectedToy._id)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
