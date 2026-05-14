import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";
import { useGetUserData } from "./hooks/getUserData";
import Profile from "./pages/Profile";
import { useGetOtherUsers } from "./hooks/getOtherUsersData";
import ChatArea from "./components/ChatArea";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers, setSocket } from "./redux/slices/userSlice";
const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const { userData, socket, onlineUsers } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  useGetUserData(token);
  useGetOtherUsers(token);

  useEffect(() => {
    if (userData) {
      const socketio = io(serverUrl, {
        transports: ["websocket", "polling"],
        query: {
          userId: userData?._id,
        },
      });

      dispatch(setSocket(socketio));

      socketio.on("connect", () => {
        console.log("SOCKET CONNECTED:", socketio.id);
      });

      socketio.on("getOnlineUser", (users) => {
        console.log("ONLINE USERS:", users);

        dispatch(setOnlineUsers(users));
      });

      return () => socketio.close();
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData]);

  return (
    <>
      <Toaster />

      <ScrollToTop />

      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            token ? (
              <Home setToken={setToken} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route
            path="chat/:id"
            element={
              token ? (
                <ChatArea setToken={setToken} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Route>

        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" replace />}
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
