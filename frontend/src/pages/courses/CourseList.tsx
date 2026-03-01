import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/tables/DataTable';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useToast } from '../../components/ui/use-toast';
import { courseService, Course } from '../../services/api/course.service';

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getAll();
      setCourses(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (course: Course) => {
    if (!confirm(`Are you sure you want to delete ${course.name}?`)) {
      return;
    }

    try {
      await courseService.delete(course.id);
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
      fetchCourses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (course: Course) => {
    // TODO: Navigate to edit form
    console.log('Edit course:', course);
  };

  const handleView = (course: Course) => {
    // TODO: Navigate to detail view
    console.log('View course:', course);
  };

  const handleAdd = () => {
    // TODO: Navigate to create form
    console.log('Add new course');
  };

  const columns = [
    {
      key: 'name' as keyof Course,
      title: 'Course Name',
      sortable: true,
      render: (value: string, row: Course) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{row.code}</div>
        </div>
      ),
    },
    {
      key: 'type' as keyof Course,
      title: 'Type',
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'theory' ? 'default' : value === 'lab' ? 'secondary' : 'outline'}>
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'credits' as keyof Course,
      title: 'Credits',
      sortable: true,
      render: (value: number) => `${value} credits`,
    },
    {
      key: 'description' as keyof Course,
      title: 'Description',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value || 'No description'}
        </div>
      ),
    },
    {
      key: 'created_at' as keyof Course,
      title: 'Created',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <DataTable
        data={courses}
        columns={columns}
        loading={loading}
        title="Courses"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search courses..."
        emptyMessage="No courses found. Create your first course to get started."
      />
    </div>
  );
}
