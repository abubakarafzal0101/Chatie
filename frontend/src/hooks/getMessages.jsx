import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/slices/messageSlice";

export const useGetMessages = (token) => {
  const dispatch = useDispatch();
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const { selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!token || !selectedUser?._id) {
      dispatch(setMessages([]));
      return;
    }

    const getMessages = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/message/get/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.success) {
          dispatch(setMessages(response.data.messages));
        }
      } catch (error) {
        if (error?.response?.status === 404) {
          dispatch(setMessages([]));
        }
        console.error("Get Messages Error:", error);
      }
    };

    getMessages();
  }, [token, selectedUser?._id]);
};
