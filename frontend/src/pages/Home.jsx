import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useGetMessages } from "../hooks/getMessages";

const Home = ({ setToken }) => {
  const { selectedUser, userData, otherUsers } = useSelector(
    (state) => state.user,
  );
  useGetMessages(localStorage.getItem("token"));
  const handlelogout = () => {
    localStorage.clear();
    setToken(null);
    window.location.href = "/login";
  };

  return (
    <div className="w-screen h-screen flex bg-[#050816] text-white">
      {/* SIDEBAR */}
      <div
        className={`
          h-full border-r border-white/10
          ${selectedUser ? "hidden md:block md:w-[30%]" : "w-full md:w-[30%]"}
        `}
      >
        <Sidebar
          userData={userData}
          otherUsers={otherUsers}
          handlelogout={handlelogout}
        />
      </div>

      {/* CHAT AREA */}
      <div
        className={`
          h-full
          ${selectedUser ? "w-full md:w-[70%]" : "hidden md:block md:w-[70%]"}
        `}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
