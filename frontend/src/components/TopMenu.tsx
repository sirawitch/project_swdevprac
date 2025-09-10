"use client";

import React, { useState } from "react";
import TopMenuItem from "./TopMenuItem";

export default function TopMenu() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("user");
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // States for Login and Register forms
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [role, setRole] = useState("member");

  // State to switch between Login and Register forms
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Backend URL from Environment Variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLoginClick = () => {
    setModalMessage("");
    setIsModalOpen(true);
  };

  const handleLogoutClick = async () => {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/v1/auth/logout`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserRole("guest");
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmail("");
    setPassword("");
    setName("");
    setTel("");
    setRole("member");
    setIsRegisterMode(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegisterMode) {
        const response = await fetch(`${API_URL}/api/v1/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, tel, role, password }),
        });

        if (response.ok) {
          setModalMessage("Registration successful! Please log in.");
          setIsRegisterMode(false);
        } else {
          const errorData = await response.json();
          setModalMessage(errorData.message || "Registration failed");
        }
      } else {
        const response = await fetch(`${API_URL}/api/v1/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Response data from backend:", data);
          let userRoleFromBackend = data.role;
          // สมมติว่า response.data.token คือค่า token ที่ได้จาก API
          localStorage.setItem("token", data.token);
          console.log(
            "Extracted role before setting state:",
            userRoleFromBackend
          );

          setIsLoggedIn(true);
          setUserRole(userRoleFromBackend);
          setModalMessage("Login successful");
          handleCloseModal();
        } else {
          const errorData = await response.json();
          setModalMessage(errorData.message || "Invalid email or password");
        }
      }
    } catch (error) {
      setModalMessage("Connection error");
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="w-full h-16 bg-gray-800 text-white grid grid-cols-4 gap-16 items-center px-5">
      <TopMenuItem href="/" text="Home" />
      <TopMenuItem href="/order" text="Order" />
      {isLoggedIn && userRole === "admin" && (
        <TopMenuItem href="/admin" text="Admin" />
      )}

      {/* Spacer to push the button to the last column */}
      <div className="col-start-4 flex justify-end">
        {isLoggedIn ? (
          <button
            onClick={handleLogoutClick}
            className="
              py-2 px-4 rounded-md bg-red-600 text-white 
              font-bold hover:bg-red-700 transition-colors
            "
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLoginClick}
            className="
              py-2 px-4 rounded-md bg-blue-600 text-white 
              font-bold hover:bg-blue-700 transition-colors
            "
          >
            Login
          </button>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {isRegisterMode ? "Register" : "Login"}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {isRegisterMode && (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </>
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="
                    py-2 px-4 rounded-md bg-gray-300 text-gray-800 
                    font-bold hover:bg-gray-400 transition-colors
                  "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`
                    py-2 px-4 rounded-md text-white 
                    font-bold transition-colors
                    ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }
                  `}
                >
                  {isLoading
                    ? "Loading..."
                    : isRegisterMode
                    ? "Register"
                    : "Confirm"}
                </button>
              </div>
            </form>

            {/* Status or alert message */}
            <p className="text-gray-600 my-4">{modalMessage}</p>

            {/* Button to switch between Login/Register modes */}
            {isRegisterMode ? (
              <p className="text-gray-600 mt-4">
                Already have an account?{" "}
                <a
                  onClick={() => setIsRegisterMode(false)}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  Login
                </a>
              </p>
            ) : (
              <p className="text-gray-600 mt-4">
                Don't have an account?{" "}
                <a
                  onClick={() => setIsRegisterMode(true)}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  Register
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
