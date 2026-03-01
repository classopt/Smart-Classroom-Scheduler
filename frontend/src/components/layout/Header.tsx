import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Menu, 
  X, 
  Bell, 
  Settings, 
  LogOut,
  User,
  ChevronDown,
  Search
} from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { ThemeToggle } from '../ui/theme-toggle';
import { authService } from '../../services/api/auth.service';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New schedule generated', time: '2 hours ago', read: false },
    { id: 2, title: 'Room conflict detected', time: '4 hours ago', read: false },
    { id: 3, title: 'System maintenance scheduled', time: '1 day ago', read: true },
  ]);
  const { toast } = useToast();
  const currentUser = authService.getCurrentUser();

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      window.location.href = '/app/login';
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter:saturate(180%)]">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Link to="/app/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Smart Classroom</h1>
                <p className="text-sm text-muted-foreground">Scheduler</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/app/dashboard" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/app/departments" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Departments
            </Link>
            <Link 
              to="/app/teachers" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Teachers
            </Link>
            <Link 
              to="/app/courses" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Courses
            </Link>
            <Link 
              to="/app/rooms" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Rooms
            </Link>
            <Link 
              to="/app/scheduling" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Scheduling
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
              
              {/* Notifications Dropdown */}
              {isMenuOpen && (
                <div className="absolute right-0 top-12 w-80 bg-popover rounded-md border shadow-lg z-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Notifications</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setNotifications([])}
                      >
                        Mark all as read
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                            notification.read ? 'opacity-50' : ''
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(notification.time).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {currentUser ? (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <ChevronDown className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Login</span>
                  </div>
                )}
              </Button>
              
              {/* User Dropdown */}
              {isMenuOpen && (
                <div className="absolute right-0 top-12 w-64 bg-popover rounded-md border shadow-lg z-50">
                  <div className="p-2">
                    {currentUser ? (
                      <div className="space-y-1">
                        <div className="px-3 py-2">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <div>
                              <p className="text-sm font-medium">{currentUser.name}</p>
                              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                            </div>
                          </div>
                        </div>
                        <Link
                          to="/app/dashboard"
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/app/departments"
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          Departments
                        </Link>
                        <Link
                          to="/app/teachers"
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          Teachers
                        </Link>
                        <Link
                          to="/app/courses"
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          Courses
                        </Link>
                        <Link
                          to="/app/rooms"
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          Rooms
                        </Link>
                        <Link
                          to="/app/scheduling"
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          Scheduling
                        </Link>
                        <div className="border-t mt-2 pt-2">
                          <Link
                            to="/app/settings"
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                          >
                            Settings
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors text-red-600"
                          >
                            <LogOut className="inline h-4 w-4 mr-2" />
                            Logout
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Link
                          to="/app/login"
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          Login
                        </Link>
                        <Link
                          to="/app/register"
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          Register
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>
    </div>
  );
}
