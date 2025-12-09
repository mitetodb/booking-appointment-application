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
import { DoctorSchedulePage } from './pages/Doctors/DoctorSchedulePage.jsx';
import { DoctorAppointmentsPage } from './pages/Doctors/DoctorAppointmentsPage.jsx';
import { AssistantDashboardPage } from './pages/Assistant/AssistantDashboardPage.jsx';
import { AssistantDoctorAppointmentsPage } from './pages/Assistant/AssistantDoctorAppointmentsPage.jsx';
import { MyAppointmentsPage } from './pages/Appointments/MyAppointmentsPage.jsx';
import { AdminDashboardPage } from './pages/Admin/AdminDashboardPage.jsx';
import { UserProfilePage } from './pages/User/UserProfilePage.jsx';
import { NotFoundPage } from './components/common/NotFoundPage.jsx';
import { Roles } from './constants/role.js';

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
       

        {/* Login/Register – guest only */}
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

      {/* private - authenticated */}
      <Route element={<RequireAuth />}>
        <Route element={<PrivateLayout />}>
         <Route path="/doctors" element={<DoctorsCatalogPage />} />
         <Route path="/doctors/:doctorId" element={<DoctorDetailsPage />} />
         <Route path="/appointments" element={<MyAppointmentsPage />} />
         <Route path="/profile" element={<UserProfilePage />} />
        </Route>
      </Route>

      {/* doctor-only */}
      <Route element={<RequireRole allowedRoles={[Roles.DOCTOR]} />}>
        <Route element={<PrivateLayout />}>
          <Route path="/doctor/schedule" element={<DoctorSchedulePage />} />
          <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
        </Route>
      </Route>

      {/* assistant-only */}
      <Route element={<RequireRole allowedRoles={[Roles.ASSISTANT]} />}>
        <Route element={<PrivateLayout />}>
          <Route path="/assistant" element={<AssistantDashboardPage />} />
          <Route path="/assistant/doctor/:doctorId" element={<AssistantDoctorAppointmentsPage />} />
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

      {/* 404 page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;