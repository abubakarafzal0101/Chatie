import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";
import { useGetUserData } from "./hooks/getUserData";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Protected Route
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  useGetUserData(token);

  return (
    <>
      <Toaster />

      <ScrollToTop />

      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home setToken={setToken} />
            </ProtectedRoute>
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            token ? <Navigate to="/" replace /> : <Login setToken={setToken} />
          }
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={
            token ? <Navigate to="/" replace /> : <Signup setToken={setToken} />
          }
        />
      </Routes>
    </>
  );
};

export default App;
