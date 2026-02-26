import { ThemeProvider } from "./components/ThemeProvider"
import { Toaster } from "./components/ui/toaster"
import ErrorBoundary from "./components/ErrorBoundary"
import { RouterProvider } from "react-router-dom"
import { router } from "./router"


function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen bg-background text-foreground">
          <RouterProvider router={router} />
          <Toaster />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
