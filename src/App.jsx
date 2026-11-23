import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ManageFarms from "./pages/ManageFarms";
import Advisory from "./pages/Advisory";
import Activity from "./pages/Activity";
import Weather from "./pages/Weather";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/manage-farms"
            element={<ManageFarms />}
          />

          <Route
            path="/advisory"
            element={<Advisory />}
          />

          <Route
            path="/activities"
            element={<Activity />}
          />

           <Route path="/weather"
            element={<Weather />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;