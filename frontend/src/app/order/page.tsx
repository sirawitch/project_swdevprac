"use client";

import { useState, useEffect, Fragment } from "react";
import { format } from "date-fns";
import {
  UserIcon,
  TruckIcon,
  PencilSquareIcon,
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { 
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild
} from "@headlessui/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  artToy: {
    _id: string;
    name: string;
    sku: string;
  };
  orderAmount: number;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [userRole, setUserRole] = useState<string>("guest");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

  const fetchUserRole = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserRole("guest");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.data.role);
      } else {
        setUserRole("guest");
      }
    } catch (error) {
      console.error("Failed to fetch user role:", error);
      setUserRole("guest");
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to view orders.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setOrders(data.data);
    } catch (e: any) {
      console.error("Failed to fetch orders:", e);
      setError(`Failed to fetch orders. ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (order: Order) => {
    setEditingOrder(order);
    setEditQuantity(order.orderAmount);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (order: Order) => {
    setDeletingOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingOrder) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to delete orders.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/v1/orders/${deletingOrder._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Order deleted successfully!");
        setIsDeleteModalOpen(false);
        setDeletingOrder(null);
        fetchOrders(); // Refresh the list
      } else {
        const errorData = await response.json();
        alert(`Failed to delete order: ${errorData.message}`);
      }
    } catch (e: any) {
      console.error("Failed to delete order:", e);
      alert(`An error occurred: ${e.message}`);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingOrder) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to make changes.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/v1/orders/${editingOrder._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderAmount: editQuantity }),
        }
      );

      if (response.ok) {
        alert("Order updated successfully!");
        setIsEditModalOpen(false);
        fetchOrders(); // Refresh the list
      } else {
        const errorData = await response.json();
        alert(`Failed to update order: ${errorData.message}`);
      }
    } catch (e: any) {
      console.error("Failed to update order:", e);
      alert(`An error occurred: ${e.message}`);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingOrder(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingOrder(null);
  };

  const handleDecreaseQuantity = () => {
    setEditQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    // Set a reasonable maximum quantity, e.g., 100
    const maxQuantity = 100;
    setEditQuantity((prev) => Math.min(maxQuantity, prev + 1));
  };

  useEffect(() => {
    fetchUserRole();
    fetchOrders();
  }, []);

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
            <p className="mt-4 text-gray-700">Loading orders...</p>
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
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        All Orders
      </h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Order ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Art Toy
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Quantity
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" />
                  User
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-center">
                  <TruckIcon className="h-4 w-4 mr-2" />
                  Order Date
                </div>
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
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.artToy.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.orderAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userRole === "admin" ? order.user.name : "me"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(order.createdAt), "dd MMM yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleEditClick(order)}
                      className="cursor-pointer text-blue-600 hover:text-blue-900 transition-colors mr-2"
                    >
                      <PencilSquareIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(order)}
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

      <Transition show={isEditModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={handleCloseEditModal}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <button
                    className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                    onClick={handleCloseEditModal}
                    aria-label="Close"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-bold mb-4 text-center text-gray-800"
                  >
                    Edit Order for {editingOrder?.artToy.name}
                  </DialogTitle>
                  <div className="text-gray-600 mb-4 space-y-2">
                    <p>
                      <strong>Order ID:</strong> {editingOrder?._id}
                    </p>
                    <p>
                      <strong>Art Toy:</strong> {editingOrder?.artToy.name} (
                      {editingOrder?.artToy.sku})
                    </p>
                    <p>
                      <strong>Ordered by:</strong> {editingOrder?.user.name}
                    </p>
                  </div>

                  <div className="flex items-center justify-center space-x-4 mt-6">
                    <button
                      className="cursor-pointer p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      onClick={handleDecreaseQuantity}
                      disabled={editQuantity <= 1}
                    >
                      <MinusIcon className="w-5 h-5 text-gray-600 transition-colors duration-300 cursor-pointer" />
                    </button>
                    <span className="text-2xl font-bold text-gray-800">
                      {editQuantity}
                    </span>
                    <button
                      className={`
                        p-2 rounded-full transition-colors
                        ${
                          editQuantity >= 5
                            ? 'bg-blue-300 cursor-not-allowed text-white'
                            : 'bg-blue-600 hover:bg-blue-700 cursor-pointer text-white'
                        }
                      `}
                      onClick={handleIncreaseQuantity}
                      disabled={editQuantity >= 5}
                    >
                      <PlusIcon
                        className={`w-5 h-5 transition-colors duration-300 ${
                          editQuantity >= 5
                            ? 'text-white cursor-not-allowed'
                            : 'text-white cursor-pointer'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      className="cursor-pointer group relative inline-flex items-center justify-center px-5 py-2 rounded-full font-semibold text-gray-800 transition-all duration-300
                      bg-gradient-to-r from-zinc-200 to-zinc-300
                      hover:from-zinc-300 hover:to-zinc-400
                      shadow-md hover:shadow-lg hover:scale-105"
                      onClick={handleCloseEditModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="cursor-pointer group relative inline-flex items-center justify-center px-5 py-2 rounded-full font-semibold text-white transition-all duration-300
                      bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg hover:scale-105"
                      onClick={handleSaveEdit}
                    >
                      Save Changes
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition show={isDeleteModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={handleCloseDeleteModal}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50" />
          </TransitionChild>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <button
                      className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                      onClick={() => setIsDeleteModalOpen(false)}
                      aria-label="Close"
                    >
                      <XMarkIcon className="h-6 w-6" />
                  </button>
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-bold mb-4 text-center text-gray-800 mb-4"
                  >
                    Confirm Deletion
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 text-center">
                      Are you sure you want to delete this order? This action
                      cannot be undone.
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
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </main>
  );
}
