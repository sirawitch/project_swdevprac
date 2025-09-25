"use client";

import { useState, useEffect, Fragment } from "react";
import { format } from "date-fns";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ArtToy {
  _id: string;
  name: string;
  sku: string;
  availableQuota: number;
  description: string;
  posterPicture: string;
  // New field for arrival date
  arrivalDate: string;
}

interface Order {
  _id: string;
  artToy: {
    _id: string;
  };
  quantity: number;
  // Add other fields as needed
}

export default function AdminPage() {
  const [artToys, setArtToys] = useState<ArtToy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingArtToy, setEditingArtToy] = useState<ArtToy | null>(null);
  const [deletingArtToy, setDeletingArtToy] = useState<ArtToy | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    availableQuota: 0,
    description: "",
    posterPicture: "",
    // Initialize new field in form data
    arrivalDate: "",
  });

  const fetchArtToys = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in with admin privileges to manage products.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/arttoys`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setArtToys(data.data);
    } catch (e: any) {
      console.error("Failed to fetch art toys:", e);
      setError(`Failed to fetch art toys. ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtToys();
  }, []);

  const handleOpenModal = (artToy: ArtToy | null = null) => {
    setEditingArtToy(artToy);
    if (artToy) {
      setFormData({
        name: artToy.name,
        sku: artToy.sku,
        availableQuota: artToy.availableQuota,
        description: artToy.description,
        posterPicture: artToy.posterPicture,
        // Set arrivalDate when editing
        arrivalDate: artToy.arrivalDate,
      });
    } else {
      setFormData({
        name: "",
        sku: "",
        availableQuota: 0,
        description: "",
        posterPicture: "",
        // Reset arrivalDate for new product
        arrivalDate: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArtToy(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "availableQuota" ? Number(value) : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to manage products.");
      return;
    }

    try {
      let response;
      if (editingArtToy) {
        // Update an existing art toy
        response = await fetch(
          `${API_URL}/api/v1/arttoys/${editingArtToy._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          }
        );
      } else {
        // Add a new art toy
        response = await fetch(`${API_URL}/api/v1/arttoys`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        alert(`Art Toy ${editingArtToy ? "updated" : "added"} successfully!`);
        handleCloseModal();
        fetchArtToys();
      } else {
        const errorData = await response.json();
        alert(
          `Failed to ${editingArtToy ? "update" : "add"} art toy: ${
            errorData.message
          }`
        );
      }
    } catch (e: any) {
      console.error("Failed to save art toy:", e);
      alert(`An error occurred: ${e.message}`);
    }
  };

  const handleDeleteClick = (artToy: ArtToy) => {
    setDeletingArtToy(artToy);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingArtToy) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to delete products.");
      return;
    }

    try {
      const ordersResponse = await fetch(`${API_URL}/api/v1/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!ordersResponse.ok) {
        throw new Error("Failed to fetch orders for pre-deletion check.");
      }

      const ordersData = await ordersResponse.json();
      const hasRelatedOrders = ordersData.data.some(
        (order: Order) => order.artToy._id === deletingArtToy._id
      );

      if (hasRelatedOrders) {
        alert(
          "ไม่สามารถลบสินค้านี้ได้ เนื่องจากมีการสั่งซื้อสินค้าชิ้นนี้อยู่"
        );
        setIsDeleteModalOpen(false);
        return;
      }
      const response = await fetch(
        `${API_URL}/api/v1/arttoys/${deletingArtToy._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        alert("Art Toy deleted successfully!");
        setIsDeleteModalOpen(false);
        setDeletingArtToy(null);
        fetchArtToys();
      } else {
        const errorData = await response.json();
        alert(`Failed to delete art toy: ${errorData.message}`);
      }
    } catch (e: any) {
      console.error("Failed to delete art toy:", e);
      alert(`An error occurred: ${e.message}`);
    }
  };

  if (isLoading) {
    return (
      <main className="p-8">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <svg
              className="animate-spin h-10 w-10 text-gray-800 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-4 text-gray-700">Loading products...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8">
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={() => handleOpenModal()}
          className="cursor-pointer flex items-center space-x-2 py-2 px-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                SKU
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                AvailableQuota
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Poster
              </th>
              {/* New column for arrival date */}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Arrival Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {artToys.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                >
                  No art toys found.
                </td>
              </tr>
            ) : (
              artToys.map((artToy) => (
                <tr key={artToy._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {artToy.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {artToy.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {artToy.availableQuota}
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs">
                    {artToy.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {artToy.posterPicture && (
                      <img
                        src={artToy.posterPicture}
                        alt={artToy.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                  </td>
                  {/* Display formatted arrival date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {artToy.arrivalDate
                      ? format(new Date(artToy.arrivalDate), "dd/MM/yyyy")
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleOpenModal(artToy)}
                      className="cursor-pointer text-blue-600 hover:text-blue-900 transition-colors mr-2"
                    >
                      <PencilSquareIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(artToy)}
                      className="cursor-pointer text-red-600 hover:text-red-900 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Transition show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <button
                    className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                    onClick={handleCloseModal}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold mb-4 text-center text-gray-800"
                  >
                    {editingArtToy ? "Edit Art Toy" : "Add New Art Toy"}
                  </Dialog.Title>
                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="sku"
                        className="block text-sm font-medium text-gray-700"
                      >
                        SKU
                      </label>
                      <input
                        type="text"
                        name="sku"
                        id="sku"
                        value={formData.sku}
                        onChange={handleFormChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="availableQuota"
                        className="block text-sm font-medium text-gray-700"
                      >
                        AvailableQuota
                      </label>
                      <input
                        type="number"
                        name="availableQuota"
                        id="availableQuota"
                        value={formData.availableQuota}
                        onChange={handleFormChange}
                        required
                        min="0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        rows={3}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      ></textarea>
                    </div>
                    <div>
                      <label
                        htmlFor="posterPicture"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Poster Picture URL
                      </label>
                      <input
                        type="text"
                        name="posterPicture"
                        id="posterPicture"
                        value={formData.posterPicture}
                        onChange={handleFormChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    {/* New input field for arrival date */}
                    <div>
                      <label
                        htmlFor="arrivalDate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Arrival Date
                      </label>
                      <input
                        type="date"
                        name="arrivalDate"
                        id="arrivalDate"
                        value={formData.arrivalDate}
                        onChange={handleFormChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        className="cursor-pointer group relative inline-flex items-center justify-center px-5 py-2 rounded-full font-semibold text-gray-800 transition-all duration-300
                        bg-gradient-to-r from-zinc-200 to-zinc-300
                        hover:from-zinc-300 hover:to-zinc-400
                        shadow-md hover:shadow-lg hover:scale-105"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="cursor-pointer group relative inline-flex items-center justify-center px-5 py-2 rounded-full font-semibold text-white transition-all duration-300
                        bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg hover:scale-105"
                      >
                        {editingArtToy ? "Save Changes" : "Add Product"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition show={isDeleteModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center mb-4"
                  >
                    Confirm Deletion
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 text-center">
                      Are you sure you want to delete the product{' '}
                      <strong className="font-semibold text-gray-900">{deletingArtToy?.name}</strong>
                      ? This action cannot be undone.
                    </p>
                  </div>
                  <div className="mt-4 flex justify-center space-x-6">
                    <button
                      type="button"
                      className="cursor-pointer group relative inline-flex items-center justify-center px-5 py-2 rounded-full font-semibold text-white transition-all duration-300
                        bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800
                        shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={handleConfirmDelete}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer group relative inline-flex items-center justify-center px-5 py-2 rounded-full font-semibold text-gray-800 transition-all duration-300
                        bg-gradient-to-r from-zinc-200 to-zinc-300 hover:from-zinc-300 hover:to-zinc-400
                        shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </main>
  );
}
