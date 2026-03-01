import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  Home, 
  Users, 
  Building, 
  BookOpen, 
  Calendar, 
  Settings,
  LogOut,
  BarChart3,
  Target,
  FileText,
  HelpCircle,
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { authService } from '../../services/api/auth.service';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
  badge?: number;
}

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const currentUser = authService.getCurrentUser();

  const navigationSections: NavSection[] = [
    {
      title: 'Main',
      items: [
        { title: 'Dashboard', href: '/app/dashboard', icon: <Home className="h-4 w-4" /> },
        { title: 'Departments', href: '/app/departments', icon: <Building className="h-4 w-4" /> },
        { title: 'Teachers', href: '/app/teachers', icon: <Users className="h-4 w-4" /> },
        { title: 'Courses', href: '/app/courses', icon: <BookOpen className="h-4 w-4" /> },
        { title: 'Rooms', href: '/app/rooms', icon: <Calendar className="h-4 w-4" /> },
      ],
    },
    {
      title: 'Scheduling',
      items: [
        { title: 'Dashboard', href: '/app/scheduling', icon: <BarChart3 className="h-4 w-4" /> },
        { title: 'Generate', href: '/app/scheduling/generate', icon: <Target className="h-4 w-4" /> },
        { title: 'View Timetables', href: '/app/scheduling/view', icon: <FileText className="h-4 w-4" /> },
        { title: 'Workload Management', href: '/app/scheduling/workload', icon: <Clock className="h-4 w-4" /> },
      ],
    },
    {
      title: 'Analytics',
      items: [
        { title: 'Dashboard', href: '/app/analytics', icon: <TrendingUp className="h-4 w-4" /> },
        { title: 'Reports', href: '/app/reports', icon: <FileText className="h-4 w-4" /> },
        { title: 'Settings', href: '/app/settings', icon: <Settings className="h-4 w-4" /> },
      ],
    },
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href);
  };

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

  return (
    <div className={`fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Smart Classroom</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">Scheduler</p>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="space-y-6 px-3 py-4">
          {navigationSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    to={item.href}
                    className={`flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50 ${
                      isActive(item.href) 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {item.icon}
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    {item.badge && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Link>
                ))}
              </div>
              
              {/* Section Children */}
              {section.title === 'Main' && (
                <div className="mt-2 space-y-1">
                  <Link
                    to="/app/dashboard"
                    className={`flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50 ${
                      isActive('/app/dashboard') 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Home className="h-4 w-4" />
                      <div>
                        <span className="text-sm font-medium">Dashboard</span>
                        <p className="text-xs text-muted-foreground">Overview</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-border p-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Smart Classroom</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">Scheduler</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          {currentUser ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {currentUser.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Link
                  to="/app/dashboard"
                  className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm font-medium">Dashboard</span>
                      <p className="text-xs text-muted-foreground">Analytics</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                
                <Link
                  to="/app/settings"
                  className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center space-x-3">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm font-medium">Settings</span>
                      <p className="text-xs text-muted-foreground">Preferences</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center justify-between w-full rounded-lg p-3 transition-colors hover:bg-muted/50 text-red-600 hover:text-red-700"
              >
                <div className="flex items-center space-x-3">
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Logout</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <Link
                to="/app/login"
                className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center space-x-3">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm font-medium">Login</span>
                    <p className="text-xs text-muted-foreground">Access account</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              
              <Link
                to="/app/register"
                className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm font-medium">Register</span>
                    <p className="text-xs text-muted-foreground">Create account</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2026 Smart Classroom Scheduler</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
