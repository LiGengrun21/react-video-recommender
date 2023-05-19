import { Navigate, Route, Routes, Switch } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/recommender/Home";
import Register from "./pages/recommender/Register";
import Search from "./pages/recommender/Search";
import Profile from "./pages/recommender/Profile";
import VideoDetail from "./pages/recommender/VideoDetail";
import Dashboard from "./pages/backstage/Dashboard";
import UserManagement from "./pages/backstage/UserManagement";
import VideoManagement from "./pages/backstage/VideoManagement";
import AdminManagement from "./pages/backstage/AdminManagement";
import AdminProfile from "./pages/backstage/AdminProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/videoDetail" element={<VideoDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userManagement" element={<UserManagement />} />
        <Route path="/videoManagement" element={<VideoManagement />} />
        <Route path="/adminManagement" element={<AdminManagement />} />
        <Route path="/adminProfile" element={<AdminProfile />} />
        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
