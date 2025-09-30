"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Card from "@/components/Card";
import { useTheme } from '../context/ThemeContext';
import SearchBar from "@/components/SearchBar";

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
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [quotaFilter, setQuotaFilter] = useState<number | null>(null); 
  const [searchField, setSearchField] = useState<"name" | "sku">("name"); 

  const fetchArtToys = async (
    query: string = "",
    quota: number | null = 0,
    field: "name" | "sku" = "name"
  ) => {
    setIsLoading(true);
    try {
      let API=""
      const params = new URLSearchParams();
      if(field == "name"&& query) {
        API = `${API_URL}/api/v1/arttoys/name/${query}/`;
      }
      else if(field == "sku"&& query){ 
        API = `${API_URL}/api/v1/arttoys/sku/${query}/`;
      }
      else{
        API = `${API_URL}/api/v1/arttoys`;
      }
      if(query&&quota!==null) params.append("minQuota", quota.toString());
      const queryString = params.toString();
      const response = await fetch(`${API}${queryString ? `?${queryString}` : ""}`);
      console.log(response)
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
  const handleSearch = (
    query: string,
    days: number | null,
    field: "name" | "sku"
  ) => {
    setSearchQuery(query);
    setQuotaFilter(days);
    setSearchField(field);
    fetchArtToys(query, days, field);
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

  // Set background and text colors based on theme
  const bgClass = theme === 'dark' ? 'bg-black' : 'bg-white';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <main className="p-8">
      <SearchBar
        onSearch={handleSearch}
        currentQuery={searchQuery}
        currentQuota={quotaFilter}
        currentField={searchField}
      />
      <br/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artToys.map((toy) => (
          <div key={toy._id} className="flex justify-center items-center">
            <Card
              key={toy._id}
              sku={toy.sku}
              name={toy.name}
              description={toy.description}
              arrivalDate={toy.arrivalDate}
              availableQuota={toy.availableQuota}
              posterPicture={toy.posterPicture}
              onOrderClick={() => handleOrderClick(toy.sku)}
              userRole={userRole}
            />
          </div>
        ))}
      </div>

      {isModalOpen && selectedToy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div
            className={`relative ${bgClass} rounded-lg shadow-lg p-6 max-w-lg w-full m-4`}
          >
            <button
              className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setIsModalOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2
              className={`text-2xl font-bold mb-4 text-center ${textPrimary}`}
            >
              Confirm Order for {selectedToy.name}
            </h2>
            <div className={`${textSecondary} mb-4 space-y-2`}>
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
                className={`
                  p-2 rounded-full transition-colors
                  ${
                    selectedToy?.availableQuota === 0 || orderQuantity <= 1
                      ? "bg-gray-300 cursor-not-allowed text-gray-400"
                      : "bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-600"
                  }
                `}
                onClick={handleDecreaseQuantity}
                disabled={
                  selectedToy?.availableQuota === 0 || orderQuantity <= 1
                }
              >
                <MinusIcon
                  className={`w-5 h-5 transition-colors duration-300 ${
                    selectedToy?.availableQuota === 0 || orderQuantity <= 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 cursor-pointer"
                  }`}
                />
              </button>
              <span className={`text-2xl font-bold ${textPrimary}`}>
                {orderQuantity}
              </span>
              <button
                className={`
                  p-2 rounded-full transition-colors
                  ${
                    !selectedToy ||
                    selectedToy.availableQuota === 0 ||
                    orderQuantity >= selectedToy.availableQuota ||
                    orderQuantity >= 5
                      ? "bg-blue-300 cursor-not-allowed text-white"
                      : "bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
                  }
                `}
                onClick={handleIncreaseQuantity}
                disabled={
                  !selectedToy ||
                  selectedToy.availableQuota === 0 ||
                  orderQuantity >= selectedToy.availableQuota ||
                  orderQuantity >= 5
                }
              >
                <PlusIcon
                  className={`w-5 h-5 transition-colors duration-300 ${
                    !selectedToy ||
                    selectedToy.availableQuota === 0 ||
                    orderQuantity >= selectedToy.availableQuota ||
                    orderQuantity >= 5
                      ? "text-white cursor-not-allowed"
                      : "text-white cursor-pointer"
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer group relative inline-flex items-center justify-center px-5 py-2 rounded-full font-semibold text-gray-800 transition-all duration-300
                bg-gradient-to-r from-zinc-200 to-zinc-300
                hover:from-zinc-300 hover:to-zinc-400
                shadow-md hover:shadow-lg hover:scale-105"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer group relative inline-flex items-center justify-center px-5 py-2 rounded-full font-semibold text-white transition-all duration-300
                bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg hover:scale-105"
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
