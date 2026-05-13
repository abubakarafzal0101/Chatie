import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedUser } from "../redux/slices/userSlice";
import { LogOut } from "lucide-react";

const Sidebar = ({ userData, otherUsers, handlelogout }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredUsers = otherUsers?.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );

  const openChat = (user) => {
    dispatch(setSelectedUser(user));
    navigate(`/chat/${user._id}`);
  };

  return (
    <div className="h-full flex flex-col bg-[#0b1220]">
      {/* HEADER */}
      <div className="p-4 border-b border-white/10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Chatie Chat</h1>

          <button
            onClick={handlelogout}
            className="text-red-400 cursor-pointer"
          >
            <LogOut />
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-1">Hi, {userData?.name}</p>

        {/* PROFILE IMAGE */}
        <img
          src={userData?.image}
          onClick={() => navigate("/profile")}
          className="w-10 h-10 rounded-full mt-3 cursor-pointer hover:scale-105 transition object-cover"
        />
      </div>

      {/* SEARCH */}
      <div className="p-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full p-2 rounded-lg bg-white/5 border border-white/10 outline-none"
        />
      </div>

      {/* USERS STRIP (ONLINE STYLE UI - STATIC FOR NOW) */}
      <div className="px-3 mb-3">
        <h2 className="text-xs text-gray-400 mb-2">Users</h2>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {otherUsers?.map((user) => (
            <div
              key={user._id}
              onClick={() => openChat(user)}
              className="flex flex-col items-center cursor-pointer min-w-15"
            >
              <img
                src={user.image}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/10 hover:border-cyan-400 transition"
              />

              <p className="text-[10px] text-gray-400 mt-1 truncate w-14 text-center">
                {user.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* USERS */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers?.map((user) => (
          <div
            key={user._id}
            onClick={() => openChat(user)}
            className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer rounded-lg"
          >
            <img
              src={user.image}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
