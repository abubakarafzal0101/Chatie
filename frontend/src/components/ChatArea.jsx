import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedUser } from "../redux/slices/userSlice";
import { ArrowLeft, MessageCircle, Send, Image } from "lucide-react";

const ChatArea = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.user);

  const handleBack = () => {
    dispatch(setSelectedUser(null));
    navigate("/");
  };

  return (
    <div className="h-full flex flex-col bg-[#0b1220]">
      {/* EMPTY STATE (NO USER SELECTED) */}
      {!selectedUser && (
        <div className="hidden md:flex h-full items-center justify-center text-center text-gray-400 flex-col gap-3">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
            <MessageCircle className="text-cyan-400" size={32} />
          </div>

          <h1 className="text-2xl font-bold text-white">Chatie Chat</h1>

          <p>Select a user to start conversation</p>
        </div>
      )}

      {/* CHAT UI */}
      {selectedUser && (
        <>
          {/* HEADER */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <button onClick={handleBack} className="md:hidden cursor-pointer">
              <ArrowLeft />
            </button>

            <img
              src={selectedUser.image}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <p className="font-medium">{selectedUser.name}</p>
              <p className="text-xs text-gray-400">{selectedUser.email}</p>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4"></div>

          {/* INPUT */}
          <div className="p-3 border-t border-white/10 flex items-center gap-2">
            <button className="cursor-pointer">
              <Image />
            </button>

            <input
              placeholder="Type message..."
              className="flex-1 p-2 bg-white/5 rounded-lg outline-none"
            />

            <button className="p-2 bg-cyan-500 rounded-lg cursor-pointer">
              <Send />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatArea;
