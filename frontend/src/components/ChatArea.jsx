import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedUser } from "../redux/slices/userSlice";
import { setMessages } from "../redux/slices/messageSlice";
import { useEffect, useRef } from "react";
import { ArrowLeft, MessageCircle, Send, Image, Smile } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import RecieverMessage from "./RecieverMessage";

const ChatArea = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const { selectedUser, userData } = useSelector((state) => state.user);
  const { messages = [] } = useSelector((state) => state.message);

  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const handleBack = () => {
    dispatch(setSelectedUser(null));
    navigate("/");
  };

  // SEND MESSAGE
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() && !image) {
      return toast.error("Message or image required");
    }

    try {
      const formData = new FormData();
      formData.append("message", message);
      if (image) formData.append("image", image);

      const response = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser?._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);

        dispatch(setMessages([...messages, response.data.newMessage]));

        setMessage("");
        setImage(null);
        setImagePreview("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Error sending message");
    }
  };

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-full flex flex-col bg-[#0b1220]">
      {/* EMPTY STATE */}
      {!selectedUser && (
        <div className="hidden md:flex h-full items-center justify-center text-gray-400 flex-col gap-3">
          <MessageCircle className="text-cyan-400" size={40} />
          <h1 className="text-xl font-bold text-white">Chatie Chat</h1>
          <p>Select a user to start conversation</p>
        </div>
      )}

      {/* CHAT */}
      {selectedUser && (
        <>
          {/* HEADER */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <button onClick={handleBack} className="md:hidden">
              <ArrowLeft />
            </button>

            <img
              src={selectedUser?.image}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <p className="font-medium">{selectedUser?.name}</p>
              <p className="text-xs text-gray-400">{selectedUser?.email}</p>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {Array.isArray(messages) && messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                No conversation yet
              </div>
            ) : (
              messages.map((msg) => {
                const isSender =
                  msg?.sender?.toString() === userData?._id?.toString();

                // SAFE TEXT HANDLING
                const text =
                  typeof msg?.message === "string"
                    ? msg.message
                    : msg?.message?.text || msg?.message?.message || "";

                // SAFE IMAGE HANDLING
                const img =
                  typeof msg?.image === "string"
                    ? msg.image
                    : msg?.image?.url || null;

                return isSender ? (
                  <div key={msg._id} className="flex justify-end">
                    <SenderMessage message={text} image={img} />
                  </div>
                ) : (
                  <div key={msg._id} className="flex justify-start">
                    <RecieverMessage message={text} image={img} />
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <form
            onSubmit={sendMessage}
            className="p-3 border-t border-white/10 flex items-center gap-2 relative"
          >
            {/* IMAGE PREVIEW */}
            {imagePreview && (
              <div className="absolute left-4 bottom-16">
                <img
                  src={imagePreview}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview("");
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full"
                >
                  x
                </button>
              </div>
            )}

            {/* EMOJI */}
            {showPicker && (
              <div className="absolute bottom-20 left-5">
                <EmojiPicker
                  theme="dark"
                  emojiStyle="apple"
                  onEmojiClick={onEmojiClick}
                />
              </div>
            )}

            <button type="button" onClick={() => setShowPicker(!showPicker)}>
              <Smile />
            </button>

            {/* IMAGE INPUT */}
            <label htmlFor="image">
              <Image />
            </label>

            <input
              id="image"
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImage(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
            />

            {/* TEXT INPUT */}
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message..."
              className="flex-1 p-2 bg-white/5 rounded-lg outline-none"
            />

            {/* SEND */}
            <button type="submit" className="p-2 bg-cyan-500 rounded-lg">
              <Send />
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatArea;
