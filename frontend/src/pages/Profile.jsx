import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Loader2, Camera, ArrowLeft } from "lucide-react";

const Profile = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  // 🚀 FAST CLOUDINARY OPTIMIZATION
  const optimizedImage = userData?.image?.replace(
    "/upload/",
    "/upload/w_200,h_200,c_fill,q_auto,f_auto/",
  );

  useEffect(() => {
    setPreview(userData?.image);
    setName(userData?.name || "");
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("Name cannot be empty");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("image", image);

      const response = await axios.put(
        `${serverUrl}/api/user/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Profile updated successfully ✨");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white px-4 relative">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      {/* CARD */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl"
      >
        {/* TITLE */}
        <h1 className="text-2xl font-bold text-center mb-6">Update Profile</h1>

        {/* IMAGE */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={
                preview ||
                optimizedImage ||
                "https://ui-avatars.com/api/?name=User"
              }
              className="w-28 h-28 rounded-full object-cover border border-white/20 shadow-lg"
            />

            <label className="absolute bottom-0 right-0 bg-cyan-500 p-2 rounded-full cursor-pointer hover:scale-110 transition">
              <Camera size={16} />
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
        </div>

        {/* NAME */}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-3 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-cyan-500"
        />

        {/* EMAIL */}
        <input
          type="text"
          value={userData?.email}
          readOnly
          className="w-full mb-3 p-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed"
        />

        {/* USERNAME */}
        <input
          type="text"
          value={userData?.userName}
          readOnly
          className="w-full mb-5 p-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed"
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition cursor-pointer
            ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90"
            }
          `}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </button>
      </form>
    </div>
  );
};

export default Profile;
