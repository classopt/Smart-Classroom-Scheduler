import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Building,
  Users,
  BookOpen,
  Calendar
} from 'lucide-react'
import { departmentService, Department, Program, Batch } from '../../services/api/department.service'
import { useToast } from '../../components/ui/use-toast'

export default function DepartmentDetail() {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const [department, setDepartment] = useState<Department | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadDepartment(id)
    }
  }, [id])

  const loadDepartment = async (deptId: string) => {
    try {
      const data = await departmentService.getById(deptId)
      setDepartment(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load department details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProgram = async (programId: string, programName: string) => {
    if (!confirm(`Are you sure you want to delete ${programName}?`)) return

    try {
      await departmentService.deleteProgram(department!.id, programId)
      setDepartment({
        ...department!,
        programs: department!.programs.filter(p => p.id !== programId)
      })
      toast({
        title: "Success",
        description: "Program deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete program",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBatch = async (programId: string, batchId: string, batchName: string) => {
    if (!confirm(`Are you sure you want to delete ${batchName}?`)) return

    try {
      await departmentService.deleteBatch(department!.id, programId, batchId)
      setDepartment({
        ...department!,
        programs: department!.programs.map(p => 
          p.id === programId 
            ? { ...p, batches: p.batches.filter(b => b.id !== batchId) }
            : p
        )
      })
      toast({
        title: "Success",
        description: "Batch deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete batch",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!department) {
    return (
      <div className="text-center py-12">
        <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Department not found</h3>
        <p className="text-muted-foreground mb-4">
          The department you're looking for doesn't exist.
        </p>
        <Link to="/departments">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Departments
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Link to="/departments">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{department.name}</h1>
              <p className="text-muted-foreground">Code: {department.code}</p>
            </div>
          </div>
          {department.description && (
            <p className="text-muted-foreground">{department.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Department
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{department.programs?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {department.programs?.reduce((acc, prog) => acc + (prog.batches?.length || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {department.programs?.reduce((acc, prog) => 
                acc + prog.batches.reduce((batchAcc, batch) => batchAcc + batch.students_count, 0), 0
              ) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Programs and Batches */}
      <Tabs defaultValue="programs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="batches">All Batches</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Programs</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Program
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {department.programs?.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                      <CardDescription>
                        Code: {program.code} • Duration: {program.duration} years
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProgram(program.id, program.name)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Batches</span>
                      <Badge variant="secondary">{program.batches?.length || 0}</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {program.batches?.slice(0, 3).map((batch) => (
                        <div key={batch.id} className="flex items-center justify-between text-sm">
                          <span>Year {batch.year} - {batch.section}</span>
                          <span className="text-muted-foreground">{batch.students_count} students</span>
                        </div>
                      ))}
                      {(program.batches?.length || 0) > 3 && (
                        <p className="text-sm text-muted-foreground">
                          +{(program.batches?.length || 0) - 3} more batches
                        </p>
                      )}
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Batch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {(!department.programs || department.programs.length === 0) && (
            <div className="text-center py-8">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No programs yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding the first program to this department.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Program
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="batches" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Batches</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Batch
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {department.programs?.map((program) =>
              program.batches?.map((batch) => (
                <Card key={batch.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          Year {batch.year} - {batch.section}
                        </CardTitle>
                        <CardDescription>{program.name}</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBatch(program.id, batch.id, `Year ${batch.year} - ${batch.section}`)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Students</span>
                        <Badge variant="secondary">{batch.students_count}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Program Code</span>
                        <span className="text-sm font-medium">{program.code}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
