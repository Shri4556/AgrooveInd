import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageFarms.css";


function ManageFarms() {
  const navigate = useNavigate();

  const [farms, setFarms] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    fieldName: "",
    area: "",
    areaUnit: "Acres",
    mainCrop: "",
    soilType: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =====================================
  // Load Farms
  // =====================================

  const fetchFarms = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/farms",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to load farms.");
        return;
      }

      setFarms(data.farms || []);

    } catch (error) {
      console.error("Load Farms Error:", error);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  // =====================================
  // Handle Input
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // Add Farm
  // =====================================

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !form.fieldName.trim() ||
    !form.area ||
    !form.mainCrop ||
    !form.soilType
  ) {
    alert("Please fill all fields.");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first.");
    navigate("/");
    return;
  }

  try {
    setSaving(true);

    const url = editingId
      ? `http://localhost:5000/api/farms/${editingId}`
      : "http://localhost:5000/api/farms";

    const method = editingId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Operation failed.");
      return;
    }

    if (editingId) {
      // Update existing farm in UI
      setFarms((prev) =>
        prev.map((farm) =>
          farm._id === editingId
            ? data.farm
            : farm
        )
      );

      alert("Farm updated successfully!");
    } else {
      // Add new farm to UI
      setFarms((prev) => [
        data.farm,
        ...prev,
      ]);

      alert("Farm added successfully!");
    }

    // Reset form
    setForm({
      fieldName: "",
      area: "",
      areaUnit: "Acres",
      mainCrop: "",
      soilType: "",
    });

    setEditingId(null);

  } catch (error) {

    console.error(
      "Farm Save Error:",
      error
    );

    alert(
      "Unable to connect to server."
    );

  } finally {

    setSaving(false);

  }
};

const handleEdit = (farm) => {

  setEditingId(farm._id);

  setForm({
    fieldName: farm.fieldName,
    area: farm.area,
    areaUnit: farm.areaUnit,
    mainCrop: farm.mainCrop,
    soilType: farm.soilType,
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const handleDelete = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this farm?"
  );

  if (!confirmDelete) {
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first.");
    navigate("/");
    return;
  }

  try {

    const response = await fetch(
      `http://localhost:5000/api/farms/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(
        data.message ||
        "Failed to delete farm."
      );

      return;
    }

    setFarms((prev) =>
      prev.filter(
        (farm) => farm._id !== id
      )
    );

    alert("Farm deleted successfully!");

  } catch (error) {

    console.error(
      "Delete Farm Error:",
      error
    );

    alert(
      "Unable to connect to server."
    );
  }
};

  // =====================================
  // Loading
  // =====================================

  if (loading) {
    return (
      <div className="manage-farms-container">
        <div className="farm-card">
          <h2>Loading farms...</h2>
        </div>
      </div>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <div className="manage-farms-container">

      <div className="farm-card">

        <h1>🌾 Manage Farms & Fields</h1>

        <p className="subtitle">
          Register your farm and field information
        </p>

        {/* Add Farm Form */}

        <form onSubmit={handleSubmit}>

          <h2>Add New Field</h2>

          <div className="farm-input">
            <label>Field Name</label>

            <input
              type="text"
              name="fieldName"
              placeholder="Example: North Field"
              value={form.fieldName}
              onChange={handleChange}
            />
          </div>

          <div className="farm-input">
            <label>Area</label>

            <input
              type="number"
              name="area"
              min="0"
              step="0.01"
              placeholder="Example: 5"
              value={form.area}
              onChange={handleChange}
            />
          </div>

          <div className="farm-input">
            <label>Area Unit</label>

            <select
              name="areaUnit"
              value={form.areaUnit}
              onChange={handleChange}
            >
              <option value="Acres">Acres</option>
              <option value="Hectares">Hectares</option>
            </select>
          </div>

          <div className="farm-input">
            <label>Main Crop</label>

            <select
              name="mainCrop"
              value={form.mainCrop}
              onChange={handleChange}
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

          <div className="farm-input">
            <label>Soil Type</label>

            <select
              name="soilType"
              value={form.soilType}
              onChange={handleChange}
            >
              <option value="">Select Soil Type</option>
              <option value="Black Soil">Black Soil</option>
              <option value="Red Soil">Red Soil</option>
              <option value="Alluvial Soil">
                Alluvial Soil
              </option>
              <option value="Clay Soil">Clay Soil</option>
              <option value="Sandy Soil">Sandy Soil</option>
              <option value="Loamy Soil">Loamy Soil</option>
            </select>
          </div>

          <button
            type="submit"
            className="add-farm-btn"
            disabled={saving}
          >
            {saving ? "Saving..." : "Add Farm"}
          </button>

        </form>

        {/* Farm List */}

        <div className="farm-list">

          <h2>Your Fields</h2>

          {farms.length === 0 ? (
            <p className="no-farms">
              No farms registered yet.
            </p>
          ) : (
            farms.map((farm) => (
             <div
              className="farm-item"
              key={farm._id}
            >
              <h3>🌾 {farm.fieldName}</h3>

              <p>
                <strong>Area:</strong>{" "}
                {farm.area} {farm.areaUnit}
              </p>

              <p>
                <strong>Crop:</strong>{" "}
                {farm.mainCrop}
              </p>

              <p>
                <strong>Soil:</strong>{" "}
                {farm.soilType}
              </p>

              <div className="farm-actions">

                <button
                  className="edit-btn"
                  onClick={() => handleEdit(farm)}
                >
                  ✏️ Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(farm._id)}
                >
                  🗑️ Delete
                </button>

              </div>
            </div>
            ))
          )}

        </div>

        <button
          className="back-dashboard-btn"
          onClick={() => navigate("/dashboard")}
        >
          ⬅ Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default ManageFarms;