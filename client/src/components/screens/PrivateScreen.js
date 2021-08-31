import { useState, useEffect } from "react";
import { useHistory} from "react-router-dom";
import axios from "axios";
import "./PrivateScreen.css";

const PrivateScreen = () => {
  const [error, setError] = useState("");
  const [privateData, setPrivateData] = useState("");
  const history = useHistory();

  useEffect(() => {
    const fetchPrivateDate = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const { data } = await axios.get("/api/private", config);
        setPrivateData(data.data);
      } catch (error) {
        localStorage.removeItem("authToken");
        setError("You are not authorized please login");
      }
    };

    fetchPrivateDate();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    history.push('/login')
  }

  return error ? (
    <span className="error-message">{error}</span>
  ) : (

    <div style={{ background:'green', color:'white' }}>
      {privateData}
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default PrivateScreen;
