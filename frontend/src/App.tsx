import { useState } from 'react'
import { ThemeProvider } from "./components/ThemeProvider"
import { ToastProvider } from "./components/Toast"
import ErrorBoundary from "./components/ErrorBoundary"
import { ThemeToggle } from "./components/ui/theme-toggle"
import { useTheme } from "./components/ThemeProvider"
import './App.css'


function AppContent() {
  const [count, setCount] = useState(0)
  const { theme } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div className="flex flex-col items-center space-y-8 flex-1">
            <div className="flex items-center space-x-8">
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-2xl">
                V
              </div>
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                R
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-center">Vite + React</h1>
            
            <div className="card">
              <button 
                onClick={() => setCount((count) => count + 1)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md transition-colors"
              >
                count is {count}
              </button>
              <p className="mt-4 text-muted-foreground">
                Edit <code>src/App.tsx</code> and save to test HMR
              </p>
            </div>
            
            <p className="read-the-docs text-muted-foreground">
              Smart Classroom Scheduling System - Day 2 Complete ✅
            </p>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Current theme: <span className="font-mono bg-muted px-2 py-1 rounded">{theme}</span>
              </p>
            </div>
          </div>
          
          <div className="ml-8">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}

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
          <AppContent />
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
