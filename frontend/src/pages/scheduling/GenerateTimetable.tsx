import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Calendar, Settings, Play } from 'lucide-react'

export default function GenerateTimetable() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Generate Timetable</h1>
        <p className="text-muted-foreground">Create optimized schedules with AI-powered algorithms</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Schedule Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Timetable generation wizard - to be implemented with constraint configuration</p>
          <Button className="mt-4">
            <Play className="mr-2 h-4 w-4" />
            Generate Schedule
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
