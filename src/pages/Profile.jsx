import { useEffect, useState } from "react";
import "./Profile.css";
import { Link, useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSeedling,
  FaTractor,
  FaCalendarAlt,
  FaVenusMars,
} from "react-icons/fa";

function Profile() {

  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    state: "",
    district: "",
    village: "",
    pincode: "",
    farmSize: "",
    landUnit: "Acres",
    soilType: "",
    mainCrop: "",
    irrigation: "",
    experience: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  // =====================================
  // Load Profile
  // =====================================

  useEffect(() => {

    const fetchProfile = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        navigate("/");
        return;
      }

      try {

        const response = await fetch(
          "http://localhost:5000/api/profile",
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        const data = await response.json();


        if (!response.ok) {

          alert(
            data.message ||
            "Unable to load profile."
          );

          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
          }

          return;
        }


        const user = data.user;


        setProfile({
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          gender: user.gender || "",
          dob: user.dob || "",
          state: user.state || "",
          district: user.district || "",
          village: user.village || "",
          pincode: user.pincode || "",
          farmSize: user.farmSize ?? "",
          landUnit: user.landUnit || "Acres",
          soilType: user.soilType || "",
          mainCrop: user.mainCrop || "",
          irrigation: user.irrigation || "",
          experience: user.experience ?? "",
        });

      } catch (error) {

        console.error(
          "Profile Loading Error:",
          error
        );

        alert(
          "Unable to connect to the server."
        );

      } finally {

        setLoading(false);

      }
    };


    fetchProfile();

  }, [navigate]);


  // =====================================
  // Handle Input Changes
  // =====================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // =====================================
  // Save Profile
  // =====================================

  const handleSave = async (e) => {

    e.preventDefault();


    if (
      !profile.fullName.trim() ||
      !profile.email.trim() ||
      !profile.phone.trim() ||
      !profile.state.trim() ||
      !profile.district.trim() ||
      !profile.village.trim()
    ) {

      alert(
        "Please fill all required fields."
      );

      return;
    }


    if (profile.phone.length !== 10) {

      alert(
        "Phone number must be exactly 10 digits."
      );

      return;
    }


    if (
      profile.pincode &&
      profile.pincode.length !== 6
    ) {

      alert(
        "Pincode must be exactly 6 digits."
      );

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


     const response = await fetch(
  "http://localhost:5000/api/profile",
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  }
);


      const data = await response.json();


      if (!response.ok) {

        alert(
          data.message ||
          "Failed to update profile."
        );

        return;
      }


      // Update stored user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      alert(
        "Profile Saved Successfully!"
      );

        // Redirect to Dashboard
        navigate("/dashboard");


    } catch (error) {

      console.error(
        "Profile Save Error:",
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
  // Loading Screen
  // =====================================

  if (loading) {

    return (
      <div className="profile-container">

        <div className="profile-card">

          <h1>Loading Profile...</h1>

          <p className="subtitle">
            Please wait...
          </p>

        </div>

      </div>
    );
  }


  return (

    <div className="profile-container">

      <div className="profile-card">

        <h1>👤 Farmer Profile</h1>

        <p className="subtitle">
          Complete your farming profile
        </p>


        <form onSubmit={handleSave}>

          {/* ===========================
              Personal Information
          ============================ */}

          <h2>Personal Information</h2>


          <div className="input-box">

            <FaUser className="icon" />

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={profile.fullName}
              onChange={handleChange}
            />

          </div>


          <div className="input-box">

            <FaEnvelope className="icon" />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={profile.email}
              onChange={handleChange}
            />

          </div>


          <div className="input-box">

            <FaPhone className="icon" />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              maxLength={10}
              value={profile.phone}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  phone:
                    e.target.value.replace(
                      /[^0-9]/g,
                      ""
                    ),
                }))
              }
            />

          </div>


          <div className="input-box">

            <FaVenusMars className="icon" />

            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
            >

              <option value="">
                Select Gender
              </option>

              <option>Male</option>
              <option>Female</option>
              <option>Other</option>

            </select>

          </div>


          <div className="input-box">

            <FaCalendarAlt className="icon" />

            <input
              type="date"
              name="dob"
              value={profile.dob}
              onChange={handleChange}
            />

          </div>


          {/* ===========================
              Location
          ============================ */}

          <h2>Location</h2>


          <div className="input-box">

            <FaMapMarkerAlt className="icon" />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={profile.state}
              onChange={handleChange}
            />

          </div>


          <div className="input-box">

            <FaMapMarkerAlt className="icon" />

            <input
              type="text"
              name="district"
              placeholder="District"
              value={profile.district}
              onChange={handleChange}
            />

          </div>


          <div className="input-box">

            <FaMapMarkerAlt className="icon" />

            <input
              type="text"
              name="village"
              placeholder="Village"
              value={profile.village}
              onChange={handleChange}
            />

          </div>


          <div className="input-box">

            <FaMapMarkerAlt className="icon" />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              maxLength={6}
              value={profile.pincode}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  pincode:
                    e.target.value.replace(
                      /[^0-9]/g,
                      ""
                    ),
                }))
              }
            />

          </div>


          {/* ===========================
              Farm Information
          ============================ */}

          <h2>Farm Information</h2>


          <div className="input-box">

            <FaTractor className="icon" />

            <input
              type="number"
              name="farmSize"
              placeholder="Farm Size"
              value={profile.farmSize}
              onChange={handleChange}
            />

          </div>


          <div className="input-box">

            <FaSeedling className="icon" />

            <select
              name="landUnit"
              value={profile.landUnit}
              onChange={handleChange}
            >

              <option>Acres</option>
              <option>Hectares</option>

            </select>

          </div>


          <div className="input-box">

            <FaSeedling className="icon" />

            <select
              name="soilType"
              value={profile.soilType}
              onChange={handleChange}
            >

              <option value="">
                Select Soil Type
              </option>

              <option>Black Soil</option>
              <option>Red Soil</option>
              <option>Alluvial Soil</option>
              <option>Clay Soil</option>
              <option>Sandy Soil</option>
              <option>Loamy Soil</option>

            </select>

          </div>


          <div className="input-box">

            <FaSeedling className="icon" />

            <select
              name="mainCrop"
              value={profile.mainCrop}
              onChange={handleChange}
            >

              <option value="">
                Select Main Crop
              </option>

              <option>Rice</option>
              <option>Wheat</option>
              <option>Cotton</option>
              <option>Sugarcane</option>
              <option>Maize</option>
              <option>Soybean</option>
              <option>Vegetables</option>
              <option>Fruits</option>

            </select>

          </div>


          <div className="input-box">

            <FaSeedling className="icon" />

            <select
              name="irrigation"
              value={profile.irrigation}
              onChange={handleChange}
            >

              <option value="">
                Irrigation Type
              </option>

              <option>Drip</option>
              <option>Sprinkler</option>
              <option>Canal</option>
              <option>Rain-fed</option>
              <option>Tube Well</option>

            </select>

          </div>


          <div className="input-box">

            <FaTractor className="icon" />

            <input
              type="number"
              name="experience"
              placeholder="Farming Experience (Years)"
              value={profile.experience}
              onChange={handleChange}
            />

          </div>


          {/* ===========================
              Save
          ============================ */}

          <button
            className="save-btn"
            type="submit"
            disabled={saving}
          >

            {saving
              ? "Saving..."
              : "Save Profile"}

          </button>


          <p className="back-link">

            <Link to="/dashboard">
              ⬅ Back to Dashboard
            </Link>

          </p>


        </form>

      </div>

    </div>
  );
}

export default Profile;