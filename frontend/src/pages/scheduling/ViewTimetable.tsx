import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Calendar, ArrowLeft } from 'lucide-react'

export default function ViewTimetable() {
  const { scheduleId } = useParams<{ scheduleId: string }>()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">View Timetable</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule ID: {scheduleId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Interactive timetable viewer - to be implemented with calendar views</p>
        </CardContent>
      </Card>
    </div>
  )
}
