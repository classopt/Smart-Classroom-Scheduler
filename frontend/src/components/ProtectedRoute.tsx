import React from "react"
import { Navigate, useLocation, Outlet } from "react-router-dom"
import { useToast } from "./ui/use-toast"

export default function ProtectedRoute() {
  const location = useLocation()
  const { toast } = useToast()

  // TODO: Implement actual authentication check
  // For now, we'll simulate authentication
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  React.useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to access this page",
        variant: "destructive"
      })
    }
  }, [isAuthenticated, toast])

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
