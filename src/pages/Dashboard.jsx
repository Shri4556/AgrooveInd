import "./Dashboard.css";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
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

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";


function Dashboard() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  console.log("Logged-in user:", user);
  
  const [cropAreaData, setCropAreaData] = useState([]);

  const [farmSummary, setFarmSummary] = useState({
  totalFarms: 0,
  totalLand: 0,
  totalCrops: 0,
  });
 const [chartLoading, setChartLoading] = useState(true);
 const [chartError, setChartError] = useState("");

 useEffect(() => {
  const fetchCropArea = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in to view crop area data.");
      }

      const response = await fetch("http://localhost:5000/api/farms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to load farm data.");
      }

      const result = await response.json();
      const farms = result.farms || [];
const cropTotals = {};

let totalLand = 0;
const uniqueCrops = new Set();

farms.forEach((farm) => {
  const area = Number(farm.area);

  // Convert land area to hectares
  if (Number.isFinite(area) && area >= 0) {
    const areaInHectares =
      farm.areaUnit === "Acres"
        ? area * 0.404686
        : area;

    totalLand += areaInHectares;
  }

  // Count different crop types
  const crop = farm.mainCrop?.trim();

  if (crop) {
    uniqueCrops.add(crop);
  }
});

// Save summary values for the cards
setFarmSummary({
  totalFarms: farms.length,
  totalLand: Number(totalLand.toFixed(2)),
  totalCrops: uniqueCrops.size,
});

      farms.forEach((farm) => {
        const crop = farm.mainCrop?.trim();
        const area = Number(farm.area);

        if (!crop || !Number.isFinite(area) || area < 0) {
          return;
        }

        // Convert every area to hectares.
        const areaInHectares =
          farm.areaUnit === "Acres" ? area * 0.404686 : area;

        cropTotals[crop] =
          (cropTotals[crop] || 0) + areaInHectares;
      });

      setCropAreaData(
        Object.entries(cropTotals).map(([crop, area]) => ({
          crop,
          area: Number(area.toFixed(2)),
        }))
      );
    } catch (error) {
      console.error("Crop area chart error:", error);
      setChartError(error.message);
    } finally {
      setChartLoading(false);
    }
  };

  fetchCropArea();
}, []);

 const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  
      alert("Logged Out Successfully");
      navigate("/");    
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
            Welcome, {user?.role === "admin"
           ? "Admin"
           : user?.fullName || "Farmer"} 👋
          </h1>

          <p>
            Smart Agriculture Dashboard
          </p>

        </div>

  {/* Dashboard Summary Cards */}
<div className="summary-cards">

  {/* Total Farms */}
  <div className="summary-card farms-card">
    <div className="summary-icon">🌱</div>
    <div>
      <p>Total Farms</p>
      <h2>{farmSummary.totalFarms}</h2>
      <span>Registered farms</span>
    </div>
  </div>

  {/* Total Land */}
  <div className="summary-card land-card">
    <div className="summary-icon">🌾</div>
    <div>
      <p>Total Land</p>
      <h2>{farmSummary.totalLand} ha</h2>
      <span>Total cultivated area</span>
    </div>
  </div>

  {/* Total Crops */}
  <div className="summary-card crops-card">
    <div className="summary-icon">🌿</div>
    <div>
      <p>Total Crops</p>
      <h2>{farmSummary.totalCrops}</h2>
      <span>Different crop types</span>
    </div>
  </div>

</div>


{/* Crop Area Chart */}
<div className="crop-chart-card">
  <h2>Crop Area by Type</h2>
  <p className="chart-description">
    Total cultivated area in hectares
  </p>

  {chartLoading ? (
    <p>Loading crop area data...</p>
  ) : chartError ? (
    <p className="chart-message">{chartError}</p>
  ) : cropAreaData.length === 0 ? (
    <p className="chart-message">
      No farm data available. Add a farm to view your chart.
    </p>
  ) : (
    <div className="crop-chart">
      <ResponsiveContainer width="100%" height={220}>
  <BarChart
    data={cropAreaData}
    margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
    barCategoryGap="35%"
  >
    <CartesianGrid
      strokeDasharray="3 3"
      vertical={false}
      stroke="#e5e7eb"
    />

    <XAxis
      dataKey="crop"
      axisLine={false}
      tickLine={false}
      tick={{ fill: "#555", fontSize: 12 }}
    />

    <YAxis
      axisLine={false}
      tickLine={false}
      tick={{ fill: "#666", fontSize: 12 }}
      label={{
        value: "Area (hectares)",
        angle: -90,
        position: "insideLeft",
        style: { fill: "#666", fontSize: 12 },
      }}
    />

    <Tooltip
      formatter={(value) => [
        `${Number(value).toFixed(2)} hectares`,
        "Crop area",
      ]}
      contentStyle={{
        borderRadius: "10px",
        border: "1px solid #e0e8df",
      }}
    />

    <Bar
      dataKey="area"
      name="Crop area"
      fill="#2e8b57"
      radius={[6, 6, 0, 0]}
      maxBarSize={70}
    />
  </BarChart>
</ResponsiveContainer>
    </div>
  )}
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