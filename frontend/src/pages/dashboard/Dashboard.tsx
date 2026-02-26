import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { 
  Users, 
  Building, 
  BookOpen, 
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Activity,
  ArrowRight,
  Zap,
  Target
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalDepartments: 8,
    totalTeachers: 45,
    totalCourses: 120,
    totalRooms: 30,
    activeSchedules: 3,
    pendingConflicts: 5,
  })

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: 'New schedule generated', time: '2 hours ago', status: 'success' },
    { id: 2, action: 'Teacher assignment updated', time: '4 hours ago', status: 'info' },
    { id: 3, action: 'Room conflict detected', time: '6 hours ago', status: 'warning' },
    { id: 4, action: 'Department added', time: '1 day ago', status: 'success' },
  ])

  const [isLoading, setIsLoading] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalTeachers: prev.totalTeachers + Math.floor(Math.random() * 3),
        activeSchedules: Math.max(1, prev.activeSchedules + (Math.random() > 0.7 ? 1 : 0))
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleQuickAction = (action: string) => {
    setIsLoading(true)
    // Simulate action
    setTimeout(() => {
      setIsLoading(false)
      setRecentActivities(prev => [
        { id: Date.now(), action: `${action} initiated`, time: 'Just now', status: 'info' },
        ...prev.slice(0, 3)
      ])
    }, 1000)
  }

  const StatCard = ({ title, value, change, icon: Icon, color = "primary" }: any) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-transparent hover:border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon className={`h-4 w-4 text-${color}-500`} />
          </motion.div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <motion.div 
              className="text-2xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {value}
            </motion.div>
            {change && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`text-xs ${
                  change > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change > 0 ? '+' : ''}{change}
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Smart Classroom Scheduling System</p>
      </div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, staggerChildren: 0.1 }}
      >
        <StatCard 
          title="Departments" 
          value={stats.totalDepartments} 
          change={2} 
          icon={Building} 
          color="blue" 
        />
        <StatCard 
          title="Teachers" 
          value={stats.totalTeachers} 
          change={5} 
          icon={Users} 
          color="green" 
        />
        <StatCard 
          title="Courses" 
          value={stats.totalCourses} 
          change={12} 
          icon={BookOpen} 
          color="purple" 
        />
        <StatCard 
          title="Active Schedules" 
          value={stats.activeSchedules} 
          change={1} 
          icon={Calendar} 
          color="orange" 
        />
      </motion.div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks you might want to perform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="w-full justify-start group" 
                  variant="outline"
                  onClick={() => handleQuickAction('Schedule Generation')}
                  disabled={isLoading}
                >
                  <Calendar className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                  Generate New Schedule
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="w-full justify-start group" 
                  variant="outline"
                  onClick={() => handleQuickAction('Workload Management')}
                  disabled={isLoading}
                >
                  <Users className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                  Manage Teacher Workload
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to="/departments">
                  <Button 
                    className="w-full justify-start group" 
                    variant="outline"
                    onClick={() => handleQuickAction('Department Management')}
                  >
                    <Building className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                    Add Department
                    <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to="/courses">
                  <Button 
                    className="w-full justify-start group" 
                    variant="outline"
                    onClick={() => handleQuickAction('Course Creation')}
                  >
                    <BookOpen className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                    Create Course
                    <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </Button>
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Recent Activities
              </CardTitle>
              <CardDescription>
                Latest system updates and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-all cursor-pointer"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: activity.status === 'warning' ? [0, -10, 10, -10, 0] : [0, 0, 0]
                      }}
                      transition={{ 
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                        rotate: activity.status === 'warning' ? { duration: 0.5, repeat: 3, ease: "easeInOut" } : {}
                      }}
                      className={`w-3 h-3 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'warning' ? 'bg-yellow-500' :
                        activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge 
                      variant={activity.status === 'success' ? 'default' : 
                              activity.status === 'warning' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {activity.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Alerts & Notifications */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                </motion.div>
                Pending Conflicts
                <Badge variant="destructive" className="ml-auto">
                  {stats.pendingConflicts}
                </Badge>
              </CardTitle>
              <CardDescription>
                Schedule conflicts that need attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">Room Double Booking</p>
                    <p className="text-xs text-muted-foreground">
                      Room 101 - Monday 9:00 AM
                    </p>
                  </div>
                  <Button size="sm" variant="outline">Resolve</Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">Teacher Overload</p>
                    <p className="text-xs text-muted-foreground">
                      Dr. Smith - 28 hours this week
                    </p>
                  </div>
                  <Button size="sm" variant="outline">Review</Button>
                </motion.div>
              </div>
              <Button className="w-full mt-3" variant="outline">
                View All Conflicts ({stats.pendingConflicts})
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                </motion.div>
                System Status
              </CardTitle>
              <CardDescription>
                Overall system health and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Schedule Generation', value: 'Operational', color: 'text-green-600' },
                  { label: 'Database Sync', value: 'Up to date', color: 'text-green-600' },
                  { label: 'API Response Time', value: '120ms', color: 'text-green-600' },
                  { label: 'Storage Usage', value: '68%', color: 'text-yellow-600' },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{item.label}</span>
                    <span className={`text-sm font-medium ${item.color}`}>{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
