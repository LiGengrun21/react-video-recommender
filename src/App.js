import { Navigate, Route, Routes, Switch } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/recommender/Home";
import Register from "./pages/recommender/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
