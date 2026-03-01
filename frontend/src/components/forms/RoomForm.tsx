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
import { roomService, Room } from '../../services/api/course.service';

const roomSchema = z.object({
  number: z.string().min(1, 'Room number is required'),
  building: z.string().min(2, 'Building name must be at least 2 characters'),
  capacity: z.number().min(1, 'Capacity must be at least 1').max(500, 'Capacity cannot exceed 500'),
  type: z.enum(['classroom', 'lab', 'lecture_hall', 'seminar_room']),
  equipment: z.array(z.string()).optional(),
});

type RoomFormData = z.infer<typeof roomSchema>;

interface RoomFormProps {
  room?: Room;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RoomForm({ room, onSuccess, onCancel }: RoomFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [equipmentInput, setEquipmentInput] = useState('');

  const form = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      number: room?.number || '',
      building: room?.building || '',
      capacity: room?.capacity || 30,
      type: room?.type || 'classroom',
      equipment: room?.equipment || [],
    },
  });

  useEffect(() => {
    if (room) {
      form.reset({
        number: room.number,
        building: room.building,
        capacity: room.capacity,
        type: room.type,
        equipment: room.equipment || [],
      });
    }
  }, [room, form]);

  const addEquipment = () => {
    if (equipmentInput.trim()) {
      const currentEquipment = form.getValues('equipment') || [];
      if (!currentEquipment.includes(equipmentInput.trim())) {
        form.setValue('equipment', [...currentEquipment, equipmentInput.trim()]);
      }
      setEquipmentInput('');
    }
  };

  const removeEquipment = (index: number) => {
    const currentEquipment = form.getValues('equipment') || [];
    form.setValue('equipment', currentEquipment.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: RoomFormData) => {
    try {
      setLoading(true);
      
      if (room) {
        await roomService.update(room.id, data);
        toast({
          title: "Success",
          description: "Room updated successfully",
        });
      } else {
        await roomService.create(data);
        toast({
          title: "Success",
          description: "Room created successfully",
        });
      }
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${room ? 'update' : 'create'} room`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {room ? 'Edit Room' : 'Add New Room'}
        </CardTitle>
        <CardDescription>
          {room 
            ? 'Update the room information below.'
            : 'Fill in the details to add a new room to the system.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Number *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 101" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="building"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Building *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Science Block" 
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type *</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full p-2 border rounded-md">
                        <option value="classroom">Classroom</option>
                        <option value="lab">Laboratory</option>
                        <option value="lecture_hall">Lecture Hall</option>
                        <option value="seminar_room">Seminar Room</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="1"
                        max="500"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum number of students
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="equipment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add equipment..."
                          value={equipmentInput}
                          onChange={(e) => setEquipmentInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addEquipment();
                            }
                          }}
                        />
                        <Button type="button" onClick={addEquipment}>
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {field.value?.map((item, index) => (
                          <div key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {item}
                            <button
                              type="button"
                              onClick={() => removeEquipment(index)}
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
                    Press Enter or click Add to add equipment
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
                    {room ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  room ? 'Update Room' : 'Create Room'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
