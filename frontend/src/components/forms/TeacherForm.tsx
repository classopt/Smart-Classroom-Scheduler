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
import { teacherService, Teacher } from '../../services/api/teacher.service';
import { departmentService } from '../../services/api/department.service';
import { Department } from '../../services/api/department.service';

const teacherSchema = z.object({
  name: z.string().min(2, 'Teacher name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  employee_id: z.string().min(2, 'Employee ID must be at least 2 characters'),
  designation: z.string().min(2, 'Designation is required'),
  department_id: z.string().min(1, 'Department is required'),
  phone: z.string().optional(),
  max_workload: z.number().min(1, 'Max workload must be at least 1 hour').max(40, 'Max workload cannot exceed 40 hours'),
  specialization: z.array(z.string()).optional(),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

interface TeacherFormProps {
  teacher?: Teacher;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TeacherForm({ teacher, onSuccess, onCancel }: TeacherFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [specializationInput, setSpecializationInput] = useState('');

  const form = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: teacher?.name || '',
      email: teacher?.email || '',
      employee_id: teacher?.employee_id || '',
      designation: teacher?.designation || '',
      department_id: teacher?.department_id || teacher?.department?.id || '',
      phone: teacher?.phone || '',
      max_workload: teacher?.max_workload || 20,
      specialization: teacher?.specialization || [],
    },
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    if (teacher) {
      form.reset({
        name: teacher.name,
        email: teacher.email,
        employee_id: teacher.employee_id,
        designation: teacher.designation,
        department_id: teacher.department_id || teacher.department?.id || '',
        phone: teacher.phone || '',
        max_workload: teacher.max_workload,
        specialization: teacher.specialization || [],
      });
    }
  }, [teacher, form]);

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

  const addSpecialization = () => {
    if (specializationInput.trim()) {
      const currentSpecializations = form.getValues('specialization') || [];
      if (!currentSpecializations.includes(specializationInput.trim())) {
        form.setValue('specialization', [...currentSpecializations, specializationInput.trim()]);
      }
      setSpecializationInput('');
    }
  };

  const removeSpecialization = (index: number) => {
    const currentSpecializations = form.getValues('specialization') || [];
    form.setValue('specialization', currentSpecializations.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: TeacherFormData) => {
    try {
      setLoading(true);
      
      if (teacher) {
        await teacherService.update(teacher.id, data);
        toast({
          title: "Success",
          description: "Teacher updated successfully",
        });
      } else {
        await teacherService.create(data);
        toast({
          title: "Success",
          description: "Teacher created successfully",
        });
      }
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${teacher ? 'update' : 'create'} teacher`,
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
          {teacher ? 'Edit Teacher' : 'Add New Teacher'}
        </CardTitle>
        <CardDescription>
          {teacher 
            ? 'Update the teacher information below.'
            : 'Fill in the details to add a new teacher to the system.'
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
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., John Smith" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., EMP001" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="e.g., john.smith@university.edu" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., +1 234 567 8900" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Assistant Professor" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>

            <FormField
              control={form.control}
              name="max_workload"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Workload (hours/week) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="1"
                      max="40"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum teaching hours per week
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Areas of Specialization</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add specialization..."
                          value={specializationInput}
                          onChange={(e) => setSpecializationInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addSpecialization();
                            }
                          }}
                        />
                        <Button type="button" onClick={addSpecialization}>
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {field.value?.map((spec, index) => (
                          <div key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {spec}
                            <button
                              type="button"
                              onClick={() => removeSpecialization(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Press Enter or click Add to add specializations
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
                    {teacher ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  teacher ? 'Update Teacher' : 'Create Teacher'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
