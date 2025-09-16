"use client";
import React, { useState, useEffect } from "react";
import TopMenuItem from "./TopMenuItem";

export default function TopMenu() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("guest");
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

  // This useEffect hook runs once when the component is mounted
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(`${API_URL}/api/v1/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            console.log("User role from API:", data); 
            setIsLoggedIn(true);
            setUserRole(data.data.role);
          } else {
            // Token is invalid or expired, clear it
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            setUserRole("guest");
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUserRole("guest");
        }
      }
    };

    checkAuthStatus();
  }, [API_URL]);

  const handleLoginClick = () => {
    setModalMessage("");
    setIsModalOpen(true);
  };

  const handleLogoutClick = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      setUserRole("guest");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: "GET", // Changed to POST for better practice
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUserRole("guest");
        setIsModalOpen(false);
        setModalMessage("Logout successful");
      } else {
        const errorData = await response.json();
        setModalMessage(errorData.message || "Logout failed");
      }
    } catch (error) {
      setModalMessage("Connection error during logout");
      console.error("Fetch error during logout:", error);
    }
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
    <header className="w-full h-20 bg-gray-900 text-white flex items-center justify-between px-8 shadow-md">
      <div className="flex items-center space-x-10">
        <TopMenuItem href="/" text="Home" />
        <TopMenuItem href="/order" text="Order" />
        {isLoggedIn && userRole === "admin" && (
          <TopMenuItem href="/admin" text="Admin" />
        )}
      </div>

      <div>
        {isLoggedIn ? (
          <button
            onClick={handleLogoutClick}
            className="group cursor-pointer py-2 px-5 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <span className="group-hover:opacity-90">Logout</span>
          </button>
        ) : (
          <button
            onClick={handleLoginClick}
            className="group cursor-pointer py-2 px-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <span className="group-hover:opacity-90">Login</span>
          </button>
        )}
      </div>
      
      {/* Login/Register Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-2xl relative">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              {isRegisterMode ? "Register" : "Login"}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {isRegisterMode && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
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
                    cursor-pointer py-2 px-4 rounded-md bg-gray-300 text-gray-800 
                    font-bold hover:bg-gray-400 transition-colors
                  "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`cursor-pointer group relative inline-flex items-center justify-center px-5 py-2 rounded-full font-semibold text-white transition-all duration-300
                    ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg hover:scale-105"
                    }
                  `}
                >
                  {isLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : isRegisterMode ? (
                    "Register"
                  ) : (
                    "Confirm"
                  )}
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
