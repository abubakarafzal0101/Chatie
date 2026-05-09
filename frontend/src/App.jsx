import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [setToken]);

  return (
    <>
      <Toaster />

      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={token ? <Home setToken={setToken} /> : <Login />}
        />
        <Route
          path="/login"
          element={token ? <Home /> : <Login setToken={setToken} />}
        />
        <Route
          path="/signup"
          element={token ? <Home /> : <Signup setToken={setToken} />}
        />
      </Routes>
    </>
  );
};

export default App;
