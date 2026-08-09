import "./Dashboard.css";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaCloudSun,
  FaSeedling,
  FaFlask,
  FaRobot,
  FaStore,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

function Dashboard() {

  const navigate = useNavigate();

  const auth = getAuth();
  const user = auth.currentUser;

 const handleLogout = () => {

  signOut(auth)
    .then(() => {

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      alert("Logged Out Successfully");

      navigate("/");
    })
    .catch((error) => {
      alert(error.message);
    });

};

  return (

    <div className="dashboard">

      {/* Sidebar */}

      <div className="sidebar">

        <h2>🌱 AgrooveInd</h2>

        <Link to="/profile">
          <FaUser /> Profile
        </Link>

              <Link to="/manage-farms">
               <FaSeedling />Manage Farms
            </Link>

            <Link to="/activities">
            <FaSeedling /> Farming Activities
          </Link>

        <Link to="/weather">
          <FaCloudSun /> Weather
        </Link>

       <Link to="/advisory" >
          <FaSeedling />Crop & Soil Advisory
        </Link>

        <Link to="/soil">
          <FaFlask /> Soil Analysis
        </Link>

        <Link to="/chatbot">
          <FaRobot /> AI Assistant
        </Link>

        <Link to="/market">
          <FaStore /> Marketplace
        </Link>

        <Link to="/analytics">
          <FaChartLine /> Analytics
        </Link>

        <Link to="/settings">
          <FaCog /> Settings
        </Link>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> Logout
        </button>

      </div>

      {/* Main */}

      <div className="main-content">
          <Navbar />

          <div className="header">

          <h1>
            Welcome,
            {user ? ` ${user.email}` : " Farmer"} 👋
          </h1>

          <p>
            Smart Agriculture Dashboard
          </p>

        </div>

        {/* Cards */}

        <div className="card-container">

         <Link to="/profile" className="card">

            <FaUser className="card-icon" />

            <h3>Profile</h3>

            <p>
              Manage your farming profile.
            </p>

          </Link>


          <Link to="/manage-farms" className="card">

            <FaSeedling className="card-icon" />

            <h3>Manage Farms</h3>

            <p>
              Add and manage your farms and fields.
            </p>

          </Link>

          <Link to="/activities" className="card">

            <FaSeedling className="card-icon" />

            <h3>Farming Activities</h3>

            <p>
              Record sowing, irrigation,
              fertilizer, pesticide and harvest.
            </p>

          </Link>


          <Link to="/weather" className="card">

            <FaCloudSun className="card-icon" />

            <h3>Weather</h3>

            <p>
              Check today's weather forecast.
            </p>

          </Link>

       <Link to="/advisory" className="card">

            <FaSeedling className="card-icon" />

            <h3>Crop & Soil Advisory</h3>

          <p>
            Get farming guidance based on your crop and soil type.
          </p>

          </Link>

          <Link to="/soil" className="card">

            <FaFlask className="card-icon" />

            <h3>Soil Analysis</h3>

            <p>
              Analyze your soil health.
            </p>

          </Link>

          <Link to="/chatbot" className="card">

            <FaRobot className="card-icon" />

            <h3>AI Assistant</h3>

            <p>
              Ask farming-related questions.
            </p>

          </Link>

          <Link to="/market" className="card">

            <FaStore className="card-icon" />

            <h3>Marketplace</h3>

            <p>
              Buy & Sell agricultural products.
            </p>

          </Link>

          <Link to="/analytics" className="card">

            <FaChartLine className="card-icon" />

            <h3>Analytics</h3>

            <p>
              View farm reports.
            </p>

          </Link>

          <Link to="/settings" className="card">

            <FaCog className="card-icon" />

            <h3>Settings</h3>

            <p>
              Manage application settings.
            </p>

          </Link>

        </div>

      </div>

    </div>

  );

}

export default Dashboard;