# 🏥 Praxis Booking Appointment Application – Frontend

A modern React Single Page Application (SPA) for managing medical appointment bookings within the Praxis Clinic System. Built with React 18, Vite, and React Router, providing a comprehensive UI for patients, doctors, assistants, and administrators.

## 📌 Overview

This frontend application provides a complete booking system with role-based access control, real-time validation, internationalization support, and seamless integration with a Spring Boot REST API backend.

**Repository:** [booking-appointment-application](https://github.com/mitetodb/booking-appointment-application)  
**Backend API:** [booking-appointment-svc](https://github.com/mitetodb/booking-appointment-svc)

---

## 🏗️ Architecture

### Application Structure

```
┌─────────────────────────────────────────────────────────┐
│                    React Application                     │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Contexts   │  │   Services   │  │   Components │  │
│  │              │  │              │  │              │  │
│  │ • Auth       │  │ • API Client │  │ • Pages      │  │
│  │ • Language   │  │ • Auth       │  │ • Layouts    │  │
│  │ • Notifications│ │ • Doctors   │  │ • Forms      │  │
│  └──────────────┘  │ • Appointments│ │ • Modals     │  │
│                    │ • Assistant  │  │ • Routing    │  │
│                    │ • Admin      │  └──────────────┘  │
│                    └──────────────┘                    │
│                           │                             │
│                           ▼                             │
│                    ┌──────────────┐                    │
│                    │  REST API    │                    │
│                    │ (Spring Boot)│                    │
│                    └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

### Key Architectural Patterns

- **Context API**: Global state management for authentication, language, and notifications
- **Service Layer**: Centralized API communication with Axios interceptors
- **Route Guards**: Protected routes based on authentication and role
- **Component Composition**: Reusable UI components with clear separation of concerns
- **Custom Hooks**: Encapsulated logic for auth, translations, and notifications

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18.3 |
| **Build Tool** | Vite 7.2 |
| **Routing** | React Router 6.30 |
| **HTTP Client** | Axios 1.5 |
| **State Management** | Context API (React) |
| **Styling** | Custom CSS with CSS Variables |
| **Internationalization** | Custom i18n implementation |

---

## 📁 Project Structure

```
my-app/
├── components/              # Reusable UI components
│   ├── admin/              # Admin-specific components
│   ├── appointments/       # Appointment booking & management
│   ├── assistant/          # Assistant-specific components
│   ├── common/             # Shared components (ErrorBoundary, Loading, etc.)
│   ├── doctors/            # Doctor-related components
│   ├── layout/             # Layout components (Header, Footer, Layouts)
│   ├── notifications/      # Notification components
│   └── routing/            # Route guards (RequireAuth, RequireRole)
│
├── constants/              # Application constants
│   ├── role.js            # User role definitions
│   └── specialties.js     # Medical specialties data
│
├── contexts/               # React Context providers
│   ├── AuthContext.jsx    # Authentication state
│   ├── LanguageContext.jsx # i18n state
│   └── NotificationsContext.jsx # Notifications state
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.js         # Authentication hook
│   ├── useNotifications.js # Notifications hook
│   └── useTranslation.js  # Translation hook
│
├── pages/                  # Page components
│   ├── Admin/             # Admin dashboard
│   ├── Appointments/      # User appointments
│   ├── Assistant/         # Assistant dashboard
│   ├── Auth/              # Login/Register
│   ├── Doctors/           # Doctor catalog & details
│   ├── Home/              # Homepage
│   └── User/              # User profile
│
├── services/               # API service layer
│   ├── apiClient.js       # Axios configuration & interceptors
│   ├── authService.js     # Authentication API
│   ├── doctorService.js   # Doctor-related API
│   ├── appointmentService.js # Appointment API
│   ├── assistantService.js  # Assistant API
│   ├── adminService.js    # Admin API
│   ├── userService.js     # User profile API
│   └── notificationService.js # Notifications API
│
├── translations/           # i18n translation files
│   ├── en.js              # English
│   ├── bg.js              # Bulgarian
│   └── de.js              # German
│
├── utils/                  # Utility functions
│   ├── dateUtils.js       # Date formatting utilities
│   ├── generateSlots.js   # Time slot generation
│   └── validation.js     # Input validation functions
│
├── App.jsx                 # Main app component with routes
├── main.jsx                # Application entry point
└── index.css               # Global styles
```

---

## 🚀 Features

### 👤 User (Patient)
- User registration and authentication (JWT)
- Browse public doctor catalog
- View detailed doctor profiles with specialties
- Book appointments with 20-minute time slots
- Edit or cancel own appointments
- View appointment history
- Receive in-app notifications
- Update personal profile

### 🩺 Doctor Panel
- View schedule and upcoming patient list
- Manage working hours (daily schedule)
- Edit or cancel appointments
- View appointment details

### 🧑‍💼 Assistant Panel
- View assigned doctors
- Manage appointments for assigned doctors
- Create new appointments for patients (desk/phone workflow)
- Edit or cancel appointments
- Select patients from user list

### 🔧 Admin Panel
- List all registered users
- Change user roles (Admin, Doctor, Assistant, User)
- Change account status (Active, Blocked, Inactive)
- Manage Assistant ↔ Doctor assignments

---

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Login/Register** → Backend returns JWT token
2. **Token Storage** → Stored in `localStorage` as `booking_app_auth`
3. **Request Interceptor** → Axios automatically attaches `Authorization: Bearer <token>` header
4. **Token Expiration** → App automatically logs out on 401 responses

### Route Protection

- **Public Routes**: `/`, `/doctors`, `/login`, `/register`
- **Authenticated Routes**: `/appointments`, `/profile`, `/doctors/:doctorId`
- **Role-Based Routes**:
  - `DOCTOR` → `/doctor/schedule`, `/doctor/appointments`
  - `ASSISTANT` → `/assistant`, `/assistant/doctor/:doctorId`
  - `ADMIN` → `/admin`

### Route Guards

- `RequireAuth`: Ensures user is authenticated
- `RequireGuest`: Ensures user is NOT authenticated (for login/register)
- `RequireRole`: Ensures user has specific role(s)

---

## ✅ Data Validation & Error Handling

### Client-Side Validation

Centralized validation utilities (`utils/validation.js`) provide:
- Email format validation
- Password strength (minimum 6 characters)
- Name validation (minimum 2 characters)
- URL format validation
- Date/time validation
- UUID format validation
- Appointment type validation (PRIMARY, FOLLOW_UP)
- Payment type validation (PRIVATE, NHIF)

### Error Handling

- **Form Validation**: Real-time validation with field-specific error messages
- **API Error Handling**: Comprehensive error extraction from API responses
- **Defensive Programming**: Checks for null/undefined data and array types
- **User Feedback**: Clear, translated error messages displayed to users
- **Error Boundary**: Catches React component errors and displays fallback UI

### API Interceptors

- **Request Interceptor**: Attaches JWT token and handles corrupted localStorage
- **Response Interceptor**: Logs errors and provides detailed error information

---

## 🌍 Internationalization (i18n)

The application supports multiple languages:
- **English** (en)
- **Bulgarian** (bg)
- **German** (de)

Language switching is available via `LanguageSwitcher` component in the header. All user-facing text is translated, including:
- Form labels and placeholders
- Error messages
- Button labels
- Page titles and descriptions

---

## 🔌 API Integration

### Base Configuration

- **Base URL**: `http://localhost:8082/api`
- **Content-Type**: `application/json`
- **Authentication**: JWT Bearer token in `Authorization` header

### Service Layer

Each service module (`authService`, `doctorService`, etc.) encapsulates API endpoints:
- **GET**: Fetch data
- **POST**: Create resources
- **PUT**: Update resources
- **DELETE**: Remove resources

### Error Response Handling

API errors are handled consistently:
- Network errors: "Could not reach the server"
- 400 Bad Request: Validation error messages
- 401 Unauthorized: Automatic logout
- 403 Forbidden: Permission denied message
- 404 Not Found: Resource not found message
- 500+ Server Error: Generic server error message

---

## 📦 Installation & Setup

### Prerequisites

- Node.js 16+ and npm
- Backend API running (see [backend repository](https://github.com/mitetodb/booking-appointment-svc))

### Installation

```bash
# Clone the repository
git clone https://github.com/mitetodb/booking-appointment-application.git
cd booking-appointment-application/my-app

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# App will be available at:
# http://localhost:5173
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the `my-app` directory (see `env.example`):

```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:8082/api

# AI Model (optional)
VITE_AI_MODEL=claude-haiku-4.5
```

### Backend Setup

1. Clone the backend repository: [booking-appointment-svc](https://github.com/mitetodb/booking-appointment-svc)
2. Configure MySQL/PostgreSQL (see backend README)
3. Start the backend: `mvn spring-boot:run`
4. Backend should run on `http://localhost:8082`

---

## 🚀 Deployment

The application can be deployed to **Vercel** or **Netlify** for free. Both platforms support automatic deployments from GitHub.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "Add New Project" and import your repository
4. Configure:
   - Framework Preset: **Vite**
   - Root Directory: `my-app`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable: `VITE_API_BASE_URL` = `https://your-backend-domain.com/api`
6. Click "Deploy"

### Quick Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Configure:
   - Base directory: `my-app`
   - Build command: `npm run build`
   - Publish directory: `my-app/dist`
5. Add environment variable: `VITE_API_BASE_URL` = `https://your-backend-domain.com/api`
6. Click "Deploy site"

📖 **Detailed deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.

**Note**: Make sure your backend API has CORS configured to allow requests from your deployment domain.

---

## 🎨 UI/Styling

- **Custom CSS**: Modern, responsive design with CSS variables
- **Design System**: Consistent color scheme, typography, and spacing
- **Responsive Layout**: Mobile-friendly design
- **Component Styling**: Modular CSS with reusable classes
- **Form Validation Styles**: Visual feedback for input errors (`.input-error`, `.field-error`)

---

## 🔧 Development Notes

### Environment Variables

- `VITE_AI_MODEL`: AI model selection (default: `claude-haiku-4.5`)

### Code Organization

- **Components**: Functional components with hooks
- **Services**: Pure functions for API calls
- **Contexts**: Global state management
- **Utils**: Pure utility functions
- **Constants**: Static data and configuration

### Best Practices

- All API calls go through service layer
- Form validation happens before API calls
- Error messages are user-friendly and translated
- Defensive checks prevent crashes from invalid data
- Token management is handled automatically by interceptors

---

## 📝 License

ISC

---

## 🤝 Contributing

This is a private project. For issues or questions, please contact the repository owner.

---

## 🏁 Conclusion

The frontend provides a clean SPA architecture with:
- ✅ Multi-role support (User, Doctor, Assistant, Admin)
- ✅ Comprehensive input validation and error handling
- ✅ Internationalization support
- ✅ Role-based route protection
- ✅ Real-time notifications
- ✅ Responsive, modern UI
- ✅ Seamless backend integration

Designed for performance, maintainability, and real-world clinic workflows.
