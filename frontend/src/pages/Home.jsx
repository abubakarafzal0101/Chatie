import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const Home = ({ setToken }) => {
  const navigate = useNavigate();
  const handlelogout = () => {
    localStorage.clear();
    setToken(null);
    navigate("/login");
  };
  const { userData } = useSelector((state) => state.user);
  return (
    <div>
      <button onClick={handlelogout}>Logout</button>
      <h1>{userData?.email || "User"}</h1>
    </div>
  );
};

export default Home;
