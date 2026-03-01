import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/tables/DataTable';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useToast } from '../../components/ui/use-toast';
import { roomService, Room } from '../../services/api/course.service';

export default function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomService.getAll();
      setRooms(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch rooms",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (room: Room) => {
    if (!confirm(`Are you sure you want to delete ${room.building} ${room.number}?`)) {
      return;
    }

    try {
      await roomService.delete(room.id);
      toast({
        title: "Success",
        description: "Room deleted successfully",
      });
      fetchRooms();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete room",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (room: Room) => {
    // TODO: Navigate to edit form
    console.log('Edit room:', room);
  };

  const handleView = (room: Room) => {
    // TODO: Navigate to detail view
    console.log('View room:', room);
  };

  const handleAdd = () => {
    // TODO: Navigate to create form
    console.log('Add new room');
  };

  const columns = [
    {
      key: 'number' as keyof Room,
      title: 'Room Number',
      sortable: true,
      render: (value: string, row: Room) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{row.building}</div>
        </div>
      ),
    },
    {
      key: 'type' as keyof Room,
      title: 'Type',
      sortable: true,
      render: (value: string) => {
        const typeColors = {
          classroom: 'default',
          lab: 'secondary',
          lecture_hall: 'outline',
          seminar_room: 'destructive'
        };
        const typeLabels = {
          classroom: 'Classroom',
          lab: 'Laboratory',
          lecture_hall: 'Lecture Hall',
          seminar_room: 'Seminar Room'
        };
        return (
          <Badge variant={typeColors[value as keyof typeof typeColors] as "default" | "secondary" | "outline" | "destructive"}>
            {typeLabels[value as keyof typeof typeLabels]}
          </Badge>
        );
      },
    },
    {
      key: 'capacity' as keyof Room,
      title: 'Capacity',
      sortable: true,
      render: (value: number) => `${value} seats`,
    },
    {
      key: 'equipment' as keyof Room,
      title: 'Equipment',
      render: (value: string[]) => (
        <div className="max-w-xs">
          {value && value.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {value.slice(0, 2).map((item, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
              {value.length > 2 && (
                <span className="text-xs text-gray-500">+{value.length - 2} more</span>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-500">No equipment</span>
          )}
        </div>
      ),
    },
    {
      key: 'created_at' as keyof Room,
      title: 'Created',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <DataTable
        data={rooms}
        columns={columns}
        loading={loading}
        title="Rooms"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search rooms..."
        emptyMessage="No rooms found. Create your first room to get started."
      />
    </div>
  );
}
