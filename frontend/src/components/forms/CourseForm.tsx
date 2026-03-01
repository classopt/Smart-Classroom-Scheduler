import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../ui/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { courseService, Course } from '../../services/api/course.service';
import { departmentService } from '../../services/api/department.service';
import { Department } from '../../services/api/department.service';

const courseSchema = z.object({
  name: z.string().min(2, 'Course name must be at least 2 characters'),
  code: z.string().min(2, 'Course code must be at least 2 characters'),
  description: z.string().optional(),
  credits: z.number().min(1, 'Credits must be at least 1').max(10, 'Credits cannot exceed 10'),
  type: z.enum(['theory', 'lab', 'tutorial']),
  hours_per_week: z.number().min(1, 'Hours per week must be at least 1').max(20, 'Hours per week cannot exceed 20'),
  department_id: z.string().min(1, 'Department is required'),
  prerequisites: z.array(z.string()).optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  course?: Course;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CourseForm({ course, onSuccess, onCancel }: CourseFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [prerequisiteInput, setPrerequisiteInput] = useState('');
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: course?.name || '',
      code: course?.code || '',
      description: course?.description || '',
      credits: course?.credits || 3,
      type: course?.type || 'theory',
      hours_per_week: course?.hours_per_week || 3,
      department_id: course?.department_id || '',
      prerequisites: course?.prerequisites || [],
    },
  });

  useEffect(() => {
    loadDepartments();
    loadAvailableCourses();
  }, []);

  useEffect(() => {
    if (course) {
      form.reset({
        name: course.name,
        code: course.code,
        description: course.description || '',
        credits: course.credits,
        type: course.type,
        hours_per_week: course.hours_per_week,
        department_id: course.department_id,
        prerequisites: course.prerequisites || [],
      });
    }
  }, [course, form]);

  const loadDepartments = async () => {
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load departments",
        variant: "destructive",
      });
    }
  };

  const loadAvailableCourses = async () => {
    try {
      const data = await courseService.getAll();
      setAvailableCourses(data.filter(c => c.id !== course?.id));
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  const addPrerequisite = () => {
    if (prerequisiteInput.trim()) {
      const selectedCourse = availableCourses.find(c => c.id === prerequisiteInput);
      if (selectedCourse) {
        const currentPrerequisites = form.getValues('prerequisites') || [];
        if (!currentPrerequisites.includes(prerequisiteInput)) {
          form.setValue('prerequisites', [...currentPrerequisites, prerequisiteInput]);
        }
        setPrerequisiteInput('');
      }
    }
  };

  const removePrerequisite = (courseId: string) => {
    const currentPrerequisites = form.getValues('prerequisites') || [];
    form.setValue('prerequisites', currentPrerequisites.filter(id => id !== courseId));
  };

  const onSubmit = async (data: CourseFormData) => {
    try {
      setLoading(true);
      
      if (course) {
        await courseService.update(course.id, data);
        toast({
          title: "Success",
          description: "Course updated successfully",
        });
      } else {
        await courseService.create(data);
        toast({
          title: "Success",
          description: "Course created successfully",
        });
      }
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${course ? 'update' : 'create'} course`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {course ? 'Edit Course' : 'Create New Course'}
        </CardTitle>
        <CardDescription>
          {course 
            ? 'Update the course information below.'
            : 'Fill in the details to create a new academic course.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Introduction to Computer Science" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Code *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., CS101" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for the course
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Type *</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full p-2 border rounded-md">
                        <option value="theory">Theory</option>
                        <option value="lab">Laboratory</option>
                        <option value="tutorial">Tutorial</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credits *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="1"
                        max="10"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Academic credits for this course
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hours_per_week"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours per Week *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="1"
                        max="20"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Contact hours per week
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="department_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department *</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border rounded-md">
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of the course..."
                      className="resize-none"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prerequisites"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prerequisites</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <select
                          value={prerequisiteInput}
                          onChange={(e) => setPrerequisiteInput(e.target.value)}
                          className="flex-1 p-2 border rounded-md"
                        >
                          <option value="">Select prerequisite course...</option>
                          {availableCourses.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.code})
                            </option>
                          ))}
                        </select>
                        <Button type="button" onClick={addPrerequisite}>
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {field.value?.map((courseId) => {
                          const prereqCourse = availableCourses.find(c => c.id === courseId);
                          return (
                            <div key={courseId} className="bg-blue-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                              {prereqCourse?.name || courseId}
                              <button
                                type="button"
                                onClick={() => removePrerequisite(courseId)}
                                className="text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Courses that must be completed before taking this course
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-6 border-t">
              {onCancel && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {course ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  course ? 'Update Course' : 'Create Course'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
