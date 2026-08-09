const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();


//===========================
// Middleware
// ===========================

app.use(cors());
app.use(express.json());


// ===========================
// MongoDB
// ===========================

connectDB();


// ===========================
// Routes
// ===========================

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/farms", require("./routes/farmRoutes"));
app.use("/api/activities", require("./routes/activityRoutes"));
app.use("/api/advisory", require("./routes/advisoryRoutes"));


// ===========================
// Test Route
// ===========================

app.get("/", (req, res) => {
  res.send("AgrooveInd Backend is Running!");
});


// ===========================
// Server
// ===========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});