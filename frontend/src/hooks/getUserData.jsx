import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import { setUserData } from "../redux/slices/userSlice";

export const useGetUserData = (token) => {
  const dispatch = useDispatch();

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(setUserData(response.data.user));
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [token]);
};
