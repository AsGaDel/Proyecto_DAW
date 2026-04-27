import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import IncidentList from "./pages/IncidentList"
import { useTheme } from "./hooks/useTheme";
import IncidentDetails from "./pages/IncidentDetails";
import CreateIncident from "./pages/CreateIncident";
import UserProfile from "./pages/UserProfile";


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Login />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/incident-list" element={<IncidentList />} />
        <Route path="/incident-details" element={<IncidentDetails />} />
        <Route path="/create-incident" element={<CreateIncident />} />
        <Route path="/user-profile" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
} 

export default App
