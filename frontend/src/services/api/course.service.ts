import api from './axios.config'

export interface Course {
  id: string
  name: string
  code: string
  description?: string
  credits: number
  type: 'theory' | 'lab' | 'tutorial'
  hours_per_week: number
  department_id: string
  prerequisites?: string[]
  created_at: string
  updated_at: string
  department?: Department
}

export interface Department {
  id: string
  name: string
  code: string
}

export interface Room {
  id: string
  number: string
  building: string
  capacity: number
  type: 'classroom' | 'lab' | 'lecture_hall' | 'seminar_room'
  equipment?: string[]
  created_at: string
  updated_at: string
}

export interface CreateCourseData {
  name: string
  code: string
  description?: string
  credits: number
  type: 'theory' | 'lab' | 'tutorial'
  hours_per_week: number
  department_id: string
  prerequisites?: string[]
}

export interface UpdateCourseData extends Partial<CreateCourseData> {}

export interface CreateRoomData {
  number: string
  building: string
  capacity: number
  type: 'classroom' | 'lab' | 'lecture_hall' | 'seminar_room'
  equipment?: string[]
}

export interface UpdateRoomData extends Partial<CreateRoomData> {}

export const courseService = {
  async getAll(filters?: {
    department_id?: string
    type?: string
    search?: string
  }): Promise<Course[]> {
    const params = new URLSearchParams()
    if (filters?.department_id) params.append('department_id', filters.department_id)
    if (filters?.type) params.append('type', filters.type)
    if (filters?.search) params.append('search', filters.search)
    
    const response = await api.get(`/courses?${params}`)
    return response.data
  },

  async getById(id: string): Promise<Course> {
    const response = await api.get(`/courses/${id}`)
    return response.data
  },

  async create(data: CreateCourseData): Promise<Course> {
    const response = await api.post('/courses', data)
    return response.data
  },

  async update(id: string, data: UpdateCourseData): Promise<Course> {
    const response = await api.put(`/courses/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/courses/${id}`)
  },

  async getPrerequisites(id: string): Promise<Course[]> {
    const response = await api.get(`/courses/${id}/prerequisites`)
    return response.data
  },

  async addPrerequisite(courseId: string, prerequisiteId: string): Promise<void> {
    await api.post(`/courses/${courseId}/prerequisites`, { prerequisite_id: prerequisiteId })
  },

  async removePrerequisite(courseId: string, prerequisiteId: string): Promise<void> {
    await api.delete(`/courses/${courseId}/prerequisites/${prerequisiteId}`)
  }
}

export const roomService = {
  async getAll(filters?: {
    type?: string
    building?: string
    min_capacity?: number
    search?: string
  }): Promise<Room[]> {
    const params = new URLSearchParams()
    if (filters?.type) params.append('type', filters.type)
    if (filters?.building) params.append('building', filters.building)
    if (filters?.min_capacity) params.append('min_capacity', filters.min_capacity.toString())
    if (filters?.search) params.append('search', filters.search)
    
    const response = await api.get(`/rooms?${params}`)
    return response.data
  },

  async getById(id: string): Promise<Room> {
    const response = await api.get(`/rooms/${id}`)
    return response.data
  },

  async create(data: CreateRoomData): Promise<Room> {
    const response = await api.post('/rooms', data)
    return response.data
  },

  async update(id: string, data: UpdateRoomData): Promise<Room> {
    const response = await api.put(`/rooms/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/rooms/${id}`)
  },

  async getAvailability(id: string, filters?: {
    start_date?: string
    end_date?: string
  }): Promise<RoomAvailability[]> {
    const params = new URLSearchParams()
    if (filters?.start_date) params.append('start_date', filters.start_date)
    if (filters?.end_date) params.append('end_date', filters.end_date)
    
    const response = await api.get(`/rooms/${id}/availability?${params}`)
    return response.data
  }
}

export interface RoomAvailability {
  id: string
  room_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
  scheduled_course?: {
    id: string
    name: string
    code: string
  }
}
