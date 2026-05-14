import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedUser } from "../redux/slices/userSlice";
import { LogOut } from "lucide-react";

const Sidebar = ({ userData, otherUsers, handlelogout }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const { onlineUsers } = useSelector((state) => state.user);

  // SEARCH FILTER
  const filteredUsers = otherUsers?.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );

  // ONLINE USERS ONLY
  const onlineUsersList = filteredUsers?.filter((user) =>
    onlineUsers?.includes(user._id),
  );

  // ALL USERS (SEARCHED)
  const allUsersList = filteredUsers;

  const openChat = (user) => {
    dispatch(setSelectedUser(user));
    navigate(`/chat/${user._id}`);
  };

  return (
    <div className="h-full flex flex-col bg-[#0b1220] text-white">
      {/* HEADER */}
      <div className="p-4 border-b border-white/10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Chatie Chat</h1>

          <button onClick={handlelogout} className="text-red-400">
            <LogOut />
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-1">Hi, {userData?.name}</p>

        <img
          src={userData?.image}
          onClick={() => navigate("/profile")}
          className="w-10 h-10 rounded-full mt-3 cursor-pointer object-cover"
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

      {/* ONLINE USERS */}
      <div className="px-3 mb-3">
        <h2 className="text-xs text-green-400 mb-2">Online Users</h2>

        {onlineUsersList?.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {onlineUsersList.map((user) => (
              <div
                key={user._id}
                onClick={() => openChat(user)}
                className="flex flex-col items-center cursor-pointer min-w-[60px]"
              >
                <div className="relative">
                  <img
                    src={user.image}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0b1220] rounded-full"></span>
                </div>

                <p className="text-[10px] text-gray-300 mt-1 truncate w-14 text-center">
                  {user.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500">No users online</p>
        )}
      </div>

      {/* ALL USERS */}
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-xs text-gray-400 px-3 mb-2">All Users</h2>

        {allUsersList?.map((user) => {
          const isOnline = onlineUsers?.includes(user._id);

          return (
            <div
              key={user._id}
              onClick={() => openChat(user)}
              className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer rounded-lg"
            >
              <div className="relative">
                <img
                  src={user.image}
                  className="w-10 h-10 rounded-full object-cover"
                />

                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0b1220] rounded-full"></span>
                )}
              </div>

              <div>
                <p className="text-sm font-medium">{user.name}</p>

                <p className="text-xs text-gray-400">
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
