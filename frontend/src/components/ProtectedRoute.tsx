import React, { useEffect } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useToast } from "./Toast"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const { addToast } = useToast()

  // TODO: Implement actual authentication check
  // For now, we'll simulate authentication
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  React.useEffect(() => {
    if (!isAuthenticated) {
      addToast({
        title: "Authentication Required",
        description: "Please login to access this page",
        variant: "warning"
      })
    }
  }, [isAuthenticated, addToast])

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
