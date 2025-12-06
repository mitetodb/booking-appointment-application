import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout.jsx';
import { PrivateLayout } from './components/layout/PrivateLayout.jsx';
import { RequireAuth } from './components/routing/RequireAuth.jsx';
import { RequireGuest } from './components/routing/RequireGuest.jsx';
import { RequireRole } from './components/routing/RequireRole.jsx';
import { HomePage } from './pages/Home/HomePage.jsx';
import { LoginPage } from './pages/Auth/LoginPage.jsx';
import { RegisterPage } from './pages/Auth/RegisterPage.jsx';
import { DoctorsCatalogPage } from './pages/Doctors/DoctorsCatalogPage.jsx';
import { DoctorDetailsPage } from './pages/Doctors/DoctorDetailsPage.jsx';
import { MyAppointmentsPage } from './pages/Appointments/MyAppointmentsPage.jsx';
import { AdminDashboardPage } from './pages/Admin/AdminDashboardPage.jsx';
import { UserProfilePage } from './pages/User/UserProfilePage.jsx';
import { Roles } from './constants/role.js';

function App() {
  return (
    <Routes>
      {/* Публични маршрути */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
       

        {/* Login/Register – само за guest */}
        <Route
          path="/login"
          element={
            <RequireGuest>
              <LoginPage />
            </RequireGuest>
          }
        />
        <Route
          path="/register"
          element={
            <RequireGuest>
              <RegisterPage />
            </RequireGuest>
          }
        />
      </Route>

      {/* Частни маршрути – всички логнати */}
      <Route element={<RequireAuth />}>
        <Route element={<PrivateLayout />}>
         <Route path="/doctors" element={<DoctorsCatalogPage />} />
         <Route path="/doctors/:doctorId" element={<DoctorDetailsPage />} />
         <Route path="/appointments" element={<MyAppointmentsPage />} />
         <Route path="/profile" element={<UserProfilePage />} />
        </Route>
      </Route>

      {/* Admin-only */}
      <Route
        element={<RequireRole allowedRoles={[Roles.ADMIN]} />}
      >
        <Route element={<PrivateLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>
      </Route>

      {/* TODO: 404 page */}
    </Routes>
  );
}

export default App;