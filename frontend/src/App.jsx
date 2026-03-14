import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import Layout from "./pages/layout";
import Payments from "./pages/Payments";
import Staff from "./pages/Staff";
import Notifications from "./pages/Notifications";
import SingleOrder from "./pages/SingleOrder";
import AuthContext from "./context/AuthContext";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<AuthContext />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Orders />} />
          <Route path="/orders/:id" element={<SingleOrder />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
