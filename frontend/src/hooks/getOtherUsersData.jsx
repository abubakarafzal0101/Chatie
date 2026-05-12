import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOtherUsers } from "../redux/slices/userSlice";

export const useGetOtherUsers = (token) => {
  const dispatch = useDispatch();

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    if (!token) return;

    const fetchOtherUsers = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/user/others`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(setOtherUsers(response.data.users));
      } catch (error) {
        console.error(error);
      }
    };

    fetchOtherUsers();
  }, [token]);
};
