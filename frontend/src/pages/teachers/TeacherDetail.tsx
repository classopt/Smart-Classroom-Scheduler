import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { ArrowLeft, Users, Mail, Phone, Building } from 'lucide-react'

export default function TeacherDetail() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Teacher Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teacher ID: {id}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Teacher details page - to be implemented</p>
        </CardContent>
      </Card>
    </div>
  )
}
