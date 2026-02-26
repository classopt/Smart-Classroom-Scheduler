import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { ArrowLeft, BookOpen } from 'lucide-react'

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Course Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course ID: {id}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Course details page - to be implemented</p>
        </CardContent>
      </Card>
    </div>
  )
}
