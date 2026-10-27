
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Advisory.css";

const emptyForm = {
  crop: "",
  soilType: "",
  title: "",
  description: "",
  sowing: "",
  irrigation: "",
  fertilizer: "",
  pestManagement: "",
  image: "",
};

const crops = [
  "Rice",
  "Wheat",
  "Cotton",
  "Sugarcane",
  "Maize",
  "Soybean",
  "Vegetables",
  "Fruits",
];

const soilTypes = [
  "Black Soil",
  "Red Soil",
  "Alluvial Soil",
  "Clay Soil",
  "Sandy Soil",
  "Loamy Soil",
];

function Advisory() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";
  const token = localStorage.getItem("token");

  const [crop, setCrop] = useState("");
  const [soilType, setSoilType] = useState("");
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [advisories, setAdvisories] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [editForm, setEditForm] = useState(emptyForm);
  const [newForm, setNewForm] = useState(emptyForm);

  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");

  // Load existing advisories for the admin
  useEffect(() => {
    if (!isAdmin || !token) return;

    const loadAdvisories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/advisory/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setAdminMessage(
            data.message || "Unable to load advisories."
          );
          return;
        }

        setAdvisories(data.advisories || []);
      } catch (error) {
        console.error("Load advisories error:", error);
        setAdminMessage("Unable to connect to the server.");
      }
    };

    loadAdvisories();
  }, [isAdmin, token]);

  // Select an existing advisory
  const handleSelectAdvisory = (id) => {
    setSelectedId(id);
    setAdminMessage("");

    const selected = advisories.find((item) => item._id === id);

    setEditForm(
      selected
        ? {
            crop: selected.crop || "",
            soilType: selected.soilType || "",
            title: selected.title || "",
            description: selected.description || "",
            sowing: selected.sowing || "",
            irrigation: selected.irrigation || "",
            fertilizer: selected.fertilizer || "",
            pestManagement: selected.pestManagement || "",
            image: selected.image || "",
          }
        : { ...emptyForm }
    );
  };

  // Handle changes in the edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Handle changes in the create form
  const handleNewChange = (e) => {
    const { name, value } = e.target;

    setNewForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save changes to an existing advisory
  const handleSaveAdvisory = async (e) => {
    e.preventDefault();

    if (!selectedId) {
      setAdminMessage("Please select an advisory first.");
      return;
    }

    setSaving(true);
    setAdminMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/advisory/${selectedId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setAdminMessage(
          data.message || "Unable to save changes."
        );
        return;
      }

      setAdvisories((previous) =>
        previous.map((item) =>
          item._id === selectedId ? data.advisory : item
        )
      );

      setAdvisory((previous) =>
        previous?._id === selectedId ? data.advisory : previous
      );

      setAdminMessage("Advisory updated successfully!");
    } catch (error) {
      console.error("Save advisory error:", error);
      setAdminMessage("Unable to connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  // Create a new advisory
  const handleCreateAdvisory = async (e) => {
    e.preventDefault();
    setCreating(true);
    setAdminMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/advisory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setAdminMessage(
          data.message || "Unable to create advisory."
        );
        return;
      }

      setAdvisories((previous) =>
        [...previous, data.advisory].sort(
          (a, b) =>
            a.crop.localeCompare(b.crop) ||
            a.soilType.localeCompare(b.soilType)
        )
      );

      setNewForm({ ...emptyForm });
      setAdminMessage("Advisory created successfully!");
    } catch (error) {
      console.error("Create advisory error:", error);
      setAdminMessage("Unable to connect to the server.");
    } finally {
      setCreating(false);
    }
  };

  // Search for crop and soil advice as a farmer
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!crop || !soilType) {
      setError("Please select both crop and soil type.");
      setAdvisory(null);
      return;
    }

    setLoading(true);
    setError("");
    setAdvisory(null);

    try {
      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/advisory?crop=${encodeURIComponent(
          crop
        )}&soilType=${encodeURIComponent(soilType)}`,
        {
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
      console.error("Advisory search error:", error);
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

        {/* Admin-only management panel */}
        {isAdmin && (
          <section className="admin-advisory-panel">
            <h2>🛠️ Admin Advisory Management</h2>

            <h3>Create New Advisory</h3>

            <form
              onSubmit={handleCreateAdvisory}
              className="advisory-form"
            >
              <div className="form-group">
                <label>Crop</label>
                <select
                  name="crop"
                  value={newForm.crop}
                  onChange={handleNewChange}
                  required
                >
                  <option value="">Select Crop</option>
                  {crops.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Soil Type</label>
                <select
                  name="soilType"
                  value={newForm.soilType}
                  onChange={handleNewChange}
                  required
                >
                  <option value="">Select Soil Type</option>
                  {soilTypes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {[
                ["title", "Title"],
                ["description", "Description"],
                ["sowing", "Sowing"],
                ["irrigation", "Irrigation"],
                ["fertilizer", "Fertilizer"],
                ["pestManagement", "Pest Management"],
                ["image", "Image URL (optional)"],
              ].map(([name, label]) => (
                <div className="form-group" key={name}>
                  <label>{label}</label>

                  {[
                    "description",
                    "sowing",
                    "irrigation",
                    "fertilizer",
                    "pestManagement",
                  ].includes(name) ? (
                    <textarea
                      name={name}
                      value={newForm[name]}
                      onChange={handleNewChange}
                      rows="3"
                      required={name === "description"}
                    />
                  ) : (
                    <input
                      name={name}
                      value={newForm[name]}
                      onChange={handleNewChange}
                      required={name === "title"}
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="advisory-btn"
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Advisory"}
              </button>
            </form>

            <hr />

            <h3>Edit Existing Advisory</h3>

            <div className="form-group">
              <label>Select Advisory</label>

              <select
                value={selectedId}
                onChange={(e) =>
                  handleSelectAdvisory(e.target.value)
                }
              >
                <option value="">Choose an advisory</option>

                {advisories.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.crop} - {item.soilType}
                  </option>
                ))}
              </select>
            </div>

            {selectedId && (
              <form
                onSubmit={handleSaveAdvisory}
                className="advisory-form"
              >
                {[
                  ["crop", "Crop"],
                  ["soilType", "Soil Type"],
                  ["title", "Title"],
                  ["description", "Description"],
                  ["sowing", "Sowing"],
                  ["irrigation", "Irrigation"],
                  ["fertilizer", "Fertilizer"],
                  ["pestManagement", "Pest Management"],
                  ["image", "Image URL"],
                ].map(([name, label]) => (
                  <div className="form-group" key={name}>
                    <label>{label}</label>

                    {[
                      "description",
                      "sowing",
                      "irrigation",
                      "fertilizer",
                      "pestManagement",
                    ].includes(name) ? (
                      <textarea
                        name={name}
                        value={editForm[name]}
                        onChange={handleEditChange}
                        rows="3"
                        required={name === "description"}
                      />
                    ) : (
                      <input
                        name={name}
                        value={editForm[name]}
                        onChange={handleEditChange}
                        required={["crop", "soilType", "title"].includes(
                          name
                        )}
                      />
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  className="advisory-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            )}

            {adminMessage && (
              <p role="status">{adminMessage}</p>
            )}
          </section>
        )}

        {/* Farmer crop advisory search */}
        <form onSubmit={handleSearch} className="advisory-form">
          <div className="form-group">
            <label>Crop</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              required
            >
              <option value="">Select Crop</option>
              {crops.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Soil Type</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              required
            >
              <option value="">Select Soil Type</option>
              {soilTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
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

        {error && <div className="advisory-error">{error}</div>}

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
