import { createBrowserRouter } from "react-router-dom"
import App from "./App"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/auth/Login"
import RegisterPage from "./pages/auth/Register"
import DashboardPage from "./pages/dashboard/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import DepartmentList from "./pages/departments/DepartmentList"
import DepartmentDetail from "./pages/departments/DepartmentDetail"
import TeacherList from "./pages/teachers/TeacherList"
import CourseList from "./pages/courses/CourseList"
import RoomList from "./pages/rooms/RoomList"
import SchedulingDashboard from "./pages/scheduling/SchedulingDashboard"
import WorkloadManagement from "./pages/scheduling/WorkloadManagement"
import GenerateTimetable from "./pages/scheduling/GenerateTimetable"
import ViewTimetable from "./pages/scheduling/ViewTimetable"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: "app/login",
        element: <LoginPage />
      },
      {
        path: "app/register",
        element: <RegisterPage />
      },
      {
        path: "app",
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "departments",
            element: <DepartmentList />,
          },
          {
            path: "departments/:id",
            element: <DepartmentDetail />,
          },
          {
            path: "teachers",
            element: <TeacherList />,
          },
          {
            path: "courses",
            element: <CourseList />,
          },
          {
            path: "rooms",
            element: <RoomList />,
          },
          {
            path: "scheduling",
            element: <SchedulingDashboard />,
          },
          {
            path: "scheduling/workload",
            element: <WorkloadManagement />,
          },
          {
            path: "scheduling/generate",
            element: <GenerateTimetable />,
          },
          {
            path: "scheduling/view",
            element: <ViewTimetable />,
          },
        ],
      },
    ],
  },
])
