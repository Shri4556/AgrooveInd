import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSeedling,
  FaTint,
  FaFlask,
  FaBug,
  FaTractor,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import "./Activity.css";

function Activity() {
  const navigate = useNavigate();

  const [farms, setFarms] = useState([]);
  const [activities, setActivities] = useState([]);

  const [form, setForm] = useState({
    farmId: "",
    activityType: "Sowing",
    date: "",
    crop: "",
    quantity: "",
    quantityUnit: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // =====================================
  // Load Farms + Activities
  // =====================================

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        navigate("/");
        return;
      }

      try {
        const [farmResponse, activityResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/farms", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            fetch("http://localhost:5000/api/activities", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        const farmData = await farmResponse.json();
        const activityData =
          await activityResponse.json();

        if (!farmResponse.ok) {
          alert(
            farmData.message ||
              "Unable to load farms."
          );
          return;
        }

        if (!activityResponse.ok) {
          alert(
            activityData.message ||
              "Unable to load activities."
          );
          return;
        }

        setFarms(farmData.farms || []);
        setActivities(
          activityData.activities || []
        );

      } catch (error) {
        console.error(
          "Activity Loading Error:",
          error
        );

        alert(
          "Unable to connect to the server."
        );

      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);


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
// EDIT ACTIVITY
// =====================================

const handleEdit = (activity) => {
  setEditingId(activity._id);

  setForm({
    farmId: activity.farmId?._id || activity.farmId,
    activityType: activity.activityType,
    date: activity.date
      ? activity.date.substring(0, 10)
      : "",
    crop: activity.crop || "",
    quantity: activity.quantity ?? "",
    quantityUnit: activity.quantityUnit || "",
    notes: activity.notes || "",
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};


 // =====================================
// ADD / UPDATE ACTIVITY
// =====================================

const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !form.farmId ||
    !form.activityType ||
    !form.date ||
    !form.crop
  ) {
    alert("Please fill all required fields.");
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
      ? `http://localhost:5000/api/activities/${editingId}`
      : "http://localhost:5000/api/activities";

    const response = await fetch(url, {
      method: editingId ? "PUT" : "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(
        data.message ||
          "Failed to save activity."
      );
      return;
    }

    if (editingId) {
      // Update activity in list
      setActivities((prev) =>
        prev.map((activity) =>
          activity._id === editingId
            ? data.activity
            : activity
        )
      );

      alert("Activity updated successfully!");
    } else {
      // Add new activity to list
      setActivities((prev) => [
        data.activity,
        ...prev,
      ]);

      alert("Activity added successfully!");
    }

    // Reset
    setForm({
      farmId: "",
      activityType: "Sowing",
      date: "",
      crop: "",
      quantity: "",
      quantityUnit: "",
      notes: "",
    });

    setEditingId(null);

  } catch (error) {
    console.error(
      "Activity Save Error:",
      error
    );

    alert(
      "Unable to connect to the server."
    );

  } finally {
    setSaving(false);
  }
};

// =====================================
// DELETE ACTIVITY
// =====================================

const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this activity?"
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
      `http://localhost:5000/api/activities/${id}`,
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
          "Failed to delete activity."
      );
      return;
    }

    setActivities((prev) =>
      prev.filter(
        (activity) =>
          activity._id !== id
      )
    );

    // If currently editing this activity
    if (editingId === id) {
      setEditingId(null);

      setForm({
        farmId: "",
        activityType: "Sowing",
        date: "",
        crop: "",
        quantity: "",
        quantityUnit: "",
        notes: "",
      });
    }

    alert("Activity deleted successfully!");

  } catch (error) {
    console.error(
      "Delete Activity Error:",
      error
    );

    alert(
      "Unable to connect to the server."
    );
  }
};


  // =====================================
  // Activity Icon
  // =====================================

  const getActivityIcon = (type) => {
    switch (type) {
      case "Sowing":
        return <FaSeedling />;

      case "Irrigation":
        return <FaTint />;

      case "Fertilizer":
        return <FaFlask />;

      case "Pesticide":
        return <FaBug />;

      case "Harvest":
        return <FaTractor />;

      default:
        return <FaSeedling />;
    }
  };


  if (loading) {
    return (
      <div className="activity-container">
        <div className="activity-card">
          <h2>Loading Activities...</h2>
          <p>Please wait...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="activity-container">

      <div className="activity-card">

        <h1>🌱 Farming Activities</h1>

        <p className="subtitle">
          Record and manage your farming activities
        </p>


        {/* =================================
            ADD ACTIVITY FORM
        ================================= */}

        <form
          className="activity-form"
          onSubmit={handleSubmit}
        >

          {/* Farm */}

          <div className="form-group">

            <label>Farm / Field *</label>

            <select
              name="farmId"
              value={form.farmId}
              onChange={handleChange}
            >

              <option value="">
                Select Farm
              </option>

              {farms.map((farm) => (
                <option
                  key={farm._id}
                  value={farm._id}
                >
                  {farm.fieldName}
                </option>
              ))}

            </select>

          </div>


          {/* Activity */}

          <div className="form-group">

            <label>Activity Type *</label>

            <select
              name="activityType"
              value={form.activityType}
              onChange={handleChange}
            >

              <option>Sowing</option>

              <option>Irrigation</option>

              <option>Fertilizer</option>

              <option>Pesticide</option>

              <option>Harvest</option>

            </select>

          </div>


          {/* Date */}

          <div className="form-group">

            <label>Date *</label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />

          </div>


          {/* Crop */}

          <div className="form-group">

            <label>Crop *</label>

            <input
              type="text"
              name="crop"
              placeholder="e.g. Cotton"
              value={form.crop}
              onChange={handleChange}
            />

          </div>


          {/* Quantity */}

          <div className="form-row">

            <div className="form-group">

              <label>Quantity</label>

              <input
                type="number"
                name="quantity"
                placeholder="e.g. 10"
                value={form.quantity}
                onChange={handleChange}
              />

            </div>


            <div className="form-group">

              <label>Unit</label>

              <select
                name="quantityUnit"
                value={form.quantityUnit}
                onChange={handleChange}
              >

                <option value="">
                  Select Unit
                </option>

                <option>kg</option>
                <option>litres</option>
                <option>bags</option>
                <option>tonnes</option>

              </select>

            </div>

          </div>


          {/* Notes */}

          <div className="form-group">

            <label>Notes</label>

            <textarea
              name="notes"
              placeholder="Additional information..."
              value={form.notes}
              onChange={handleChange}
              rows="4"
            />

          </div>


          <button
          type="submit"
          className="activity-btn"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : editingId
            ? "Update Activity"
            : "Add Activity"}
        </button>

        {editingId && (
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setEditingId(null);

              setForm({
                farmId: "",
                activityType: "Sowing",
                date: "",
                crop: "",
                quantity: "",
                quantityUnit: "",
                notes: "",
              });
            }}
          >
            <FaTimes /> Cancel Edit
          </button>
        )}

        </form>


        {/* =================================
            ACTIVITY LIST
        ================================= */}

        <div className="activity-list">

          <h2>Recent Activities</h2>

          {activities.length === 0 ? (

            <p className="no-activity">
              No farming activities recorded yet.
            </p>

          ) : (

            activities.map((activity) => (

              <div
                className="activity-item"
                key={activity._id}
              >

                <div className="activity-icon">
                  {getActivityIcon(
                    activity.activityType
                  )}
                </div>


                <div className="activity-info">

                <div className="activity-title-row">

                  <h3>
                    {activity.activityType}
                  </h3>

                  <div className="activity-actions">

                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() =>
                        handleEdit(activity)
                      }
                    >
                      <FaEdit /> Edit
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(activity._id)
                      }
                    >
                      <FaTrash /> Delete
                    </button>

                  </div>

                </div>

                  <p>
                    <strong>Farm:</strong>{" "}
                    {activity.farmId?.fieldName ||
                      "Farm"}
                  </p>

                  <p>
                    <strong>Crop:</strong>{" "}
                    {activity.crop}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(
                      activity.date
                    ).toLocaleDateString()}
                  </p>

                  {activity.quantity && (
                    <p>
                      <strong>Quantity:</strong>{" "}
                      {activity.quantity}{" "}
                      {activity.quantityUnit}
                    </p>
                  )}

                  {activity.notes && (
                    <p>
                      <strong>Notes:</strong>{" "}
                      {activity.notes}
                    </p>
                  )}

                </div>

              </div>

            ))

          )}

        </div>


        {/* Back */}

        <button
          className="back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default Activity;