import { createBrowserRouter } from "react-router-dom"
import AppLayout from "./layouts/AppLayout"
import LoginPage from "./pages/auth/Login"
import RegisterPage from "./pages/auth/Register"
import DashboardPage from "./pages/dashboard/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"

// Department pages
import DepartmentList from "./pages/departments/DepartmentList"
import DepartmentDetail from "./pages/departments/DepartmentDetail"

// Teacher pages
import TeacherList from "./pages/teachers/TeacherList"
import TeacherDetail from "./pages/teachers/TeacherDetail"

// Course pages
import CourseList from "./pages/courses/CourseList"
import CourseDetail from "./pages/courses/CourseDetail"

// Room pages
import RoomList from "./pages/rooms/RoomList"
import RoomDetail from "./pages/rooms/RoomDetail"

// Scheduling pages
import SchedulingDashboard from "./pages/scheduling/SchedulingDashboard"
import WorkloadManagement from "./pages/scheduling/WorkloadManagement"
import GenerateTimetable from "./pages/scheduling/GenerateTimetable"
import ViewTimetable from "./pages/scheduling/ViewTimetable"

// Analytics pages
import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      // Auth routes
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      
      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          // Dashboard
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          
          // Department management
          {
            path: "departments",
            children: [
              {
                index: true,
                element: <DepartmentList />,
              },
              {
                path: ":id",
                element: <DepartmentDetail />,
              },
            ],
          },
          
          // Teacher management
          {
            path: "teachers",
            children: [
              {
                index: true,
                element: <TeacherList />,
              },
              {
                path: ":id",
                element: <TeacherDetail />,
              },
            ],
          },
          
          // Course management
          {
            path: "courses",
            children: [
              {
                index: true,
                element: <CourseList />,
              },
              {
                path: ":id",
                element: <CourseDetail />,
              },
            ],
          },
          
          // Room management
          {
            path: "rooms",
            children: [
              {
                index: true,
                element: <RoomList />,
              },
              {
                path: ":id",
                element: <RoomDetail />,
              },
            ],
          },
          
          // Scheduling
          {
            path: "scheduling",
            children: [
              {
                index: true,
                element: <SchedulingDashboard />,
              },
              {
                path: "workload",
                element: <WorkloadManagement />,
              },
              {
                path: "generate",
                element: <GenerateTimetable />,
              },
              {
                path: "view/:scheduleId",
                element: <ViewTimetable />,
              },
            ],
          },
          
          // Analytics
          {
            path: "analytics",
            element: <AnalyticsDashboard />,
          },
        ],
      },
    ],
  },
])
