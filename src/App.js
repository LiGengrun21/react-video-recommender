import { Navigate, Route, Routes, Switch } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/recommender/Home";
import Register from "./pages/recommender/Register";
import Dashboard from "./pages/backstage/Dashboard";
import Search from "./pages/recommender/Search";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
