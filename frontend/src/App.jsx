import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import IncidentList from "./pages/IncidentList"
import IncidentDetails from "./pages/IncidentDetails";
import CreateIncident from "./pages/CreateIncident";
import UserProfile from "./pages/UserProfile";
import PublicProfile from "./pages/PublicProfile";
import SubscribedList from "./pages/SubscribedList";
import MyIncidentsList from "./pages/MyIncidentsList";
import UserList from "./pages/UserList";
import CategoryList from "./pages/CategoryList";
import NotificationList from "./pages/NotificationList";
import AssignedList from "./pages/AssignedList";
import LegalNotice from "./pages/LegalNotice";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import Contact from "./pages/Contact";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/"          element={<Login />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/incident-list" element={<IncidentList />} />
        <Route path="/incident" element={<IncidentDetails />} />
        <Route path="/create-incident" element={<CreateIncident />} />
        <Route path="/subscribed" element={<SubscribedList />} />
        <Route path="/my-incidents" element={<MyIncidentsList />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/profile/:username" element={<PublicProfile />} />
        <Route path="/user-list" element={<UserList />} />
        <Route path="/category-list" element={<CategoryList />} />
        <Route path="/assigned-list" element={<AssignedList />} />
        <Route path="/notifications" element={<NotificationList />} />
        <Route path="/aviso-legal" element={<LegalNotice />} />
        <Route path="/privacidad" element={<PrivacyPolicy />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/contacto" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
} 

export default App

/* import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import IncidentList from "./pages/IncidentList"
import IncidentDetails from "./pages/IncidentDetails";
import CreateIncident from "./pages/CreateIncident";
import UserProfile from "./pages/UserProfile";
import PublicProfile from "./pages/PublicProfile";
import SubscribedList from "./pages/SubscribedList";
import MyIncidentsList from "./pages/MyIncidentsList";
import UserList from "./pages/UserList";
import CategoryList from "./pages/CategoryList";
import NotificationList from "./pages/NotificationList";
import AssignedList from "./pages/AssignedList";
import LegalNotice from "./pages/LegalNotice";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import Contact from "./pages/Contact";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/"          element={<Login />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/aviso-legal" element={<LegalNotice />} />
        <Route path="/privacidad" element={<PrivacyPolicy />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/contacto" element={<Contact />} />


        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/incident-list" element={<PrivateRoute><IncidentList /></PrivateRoute>} />
        <Route path="/incident" element={<PrivateRoute><IncidentDetails /></PrivateRoute>} />
        <Route path="/create-incident" element={<PrivateRoute><CreateIncident /></PrivateRoute>} />
        <Route path="/subscribed" element={<PrivateRoute></PrivateRoute>} />
        <Route path="/my-incidents" element={<PrivateRoute><MyIncidentsList /></PrivateRoute>} />
        <Route path="/user-profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/profile/:username" element={<PrivateRoute><PublicProfile /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><NotificationList /></PrivateRoute>} />


        <Route path="/assigned-list" element={<PrivateRoute roles={["worker"]}><AssignedList /></PrivateRoute>} />


        <Route path="/user-list" element={<PrivateRoute roles={["admin"]}><UserList /></PrivateRoute>} />
        <Route path="/category-list" element={<PrivateRoute roles={["admin"]}><CategoryList /></PrivateRoute>} />
       
      </Routes>
    </BrowserRouter>
  );
} 

export default App
 */
