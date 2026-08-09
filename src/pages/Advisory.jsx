import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Advisory.css";

function Advisory() {
  const navigate = useNavigate();
  const [crop, setCrop] = useState("");
  const [soilType, setSoilType] = useState("");
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!crop || !soilType) {
      alert("Please select both crop and soil type.");
      return;
    }

    setLoading(true);
    setError("");
    setAdvisory(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/advisory?crop=${encodeURIComponent(
          crop
        )}&soilType=${encodeURIComponent(soilType)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "No advisory found.");
        return;
      }

      setAdvisory(data.advisory);
    } catch (error) {
      console.error("Advisory Error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="advisory-container">
      <div className="advisory-card">

        <button
          className="back-dashboard-btn"
          onClick={() => navigate("/dashboard")}
        >
          ⬅ Back to Dashboard
        </button>

        <h1>🌱 Crop & Soil Advisory</h1>

        <p className="subtitle">
          Get farming guidance based on your crop and soil type.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="advisory-form">

          <div className="form-group">
            <label>Crop</label>

            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            >
              <option value="">Select Crop</option>
              <option value="Rice">Rice</option>
              <option value="Wheat">Wheat</option>
              <option value="Cotton">Cotton</option>
              <option value="Sugarcane">Sugarcane</option>
              <option value="Maize">Maize</option>
              <option value="Soybean">Soybean</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
            </select>
          </div>

          <div className="form-group">
            <label>Soil Type</label>

            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
            >
              <option value="">Select Soil Type</option>
              <option value="Black Soil">Black Soil</option>
              <option value="Red Soil">Red Soil</option>
              <option value="Alluvial Soil">Alluvial Soil</option>
              <option value="Clay Soil">Clay Soil</option>
              <option value="Sandy Soil">Sandy Soil</option>
              <option value="Loamy Soil">Loamy Soil</option>
            </select>
          </div>

          <button
            type="submit"
            className="advisory-btn"
            disabled={loading}
          >
            {loading ? "Loading..." : "Get Advisory"}
          </button>

        </form>

        {/* Error */}
        {error && (
          <div className="advisory-error">
            {error}
          </div>
        )}

        {/* Advisory Result */}
        {advisory && (
          <div className="advisory-result">

            <h2>{advisory.title}</h2>

            <p className="advisory-description">
              {advisory.description}
            </p>

            <div className="advisory-section">
              <h3>🌱 Sowing</h3>
              <p>{advisory.sowing}</p>
            </div>

            <div className="advisory-section">
              <h3>💧 Irrigation</h3>
              <p>{advisory.irrigation}</p>
            </div>

            <div className="advisory-section">
              <h3>🧪 Fertilizer</h3>
              <p>{advisory.fertilizer}</p>
            </div>

            <div className="advisory-section">
              <h3>🐛 Pest Management</h3>
              <p>{advisory.pestManagement}</p>
            </div>

            {advisory.image && (
              <img
                src={advisory.image}
                alt={advisory.title}
                className="advisory-image"
              />
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default Advisory;