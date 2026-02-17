import { ThemeProvider } from "./components/ThemeProvider"
import { ToastProvider } from "./components/Toast"
import ErrorBoundary from "./components/ErrorBoundary"
import './App.css'


function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ToastProvider>
          <div className="min-h-screen bg-background text-foreground">
            <div id="root-router-outlet" />
          </div>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
