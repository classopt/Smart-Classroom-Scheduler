import api from './axios.config'

export interface Teacher {
  id: string
  name: string
  email: string
  phone?: string
  department_id: string
  employee_id: string
  designation: string
  specialization?: string[]
  max_workload: number
  current_workload: number
  availability: Availability[]
  qualifications: CourseQualification[]
  created_at: string
  updated_at: string
  department?: Department
}

export interface Department {
  id: string
  name: string
  code: string
}

export interface Availability {
  id: string
  day_of_week: number // 0-6 (Sunday-Saturday)
  start_time: string // HH:MM format
  end_time: string // HH:MM format
  is_available: boolean
}

export interface CourseQualification {
  id: string
  course_id: string
  is_preferred: boolean
  course?: Course
}

export interface Course {
  id: string
  name: string
  code: string
  credits: number
  type: 'theory' | 'lab' | 'tutorial'
}

export interface CreateTeacherData {
  name: string
  email: string
  phone?: string
  department_id: string
  employee_id: string
  designation: string
  specialization?: string[]
  max_workload: number
}

export interface UpdateTeacherData extends Partial<CreateTeacherData> {}

export const teacherService = {
  async getAll(filters?: {
    department_id?: string
    search?: string
  }): Promise<Teacher[]> {
    const params = new URLSearchParams()
    if (filters?.department_id) params.append('department_id', filters.department_id)
    if (filters?.search) params.append('search', filters.search)
    
    const response = await api.get(`/teachers?${params}`)
    return response.data
  },

  async getById(id: string): Promise<Teacher> {
    const response = await api.get(`/teachers/${id}`)
    return response.data
  },

  async create(data: CreateTeacherData): Promise<Teacher> {
    const response = await api.post('/teachers', data)
    return response.data
  },

  async update(id: string, data: UpdateTeacherData): Promise<Teacher> {
    const response = await api.put(`/teachers/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/teachers/${id}`)
  },

  // Availability management
  async updateAvailability(teacherId: string, availability: Omit<Availability, 'id'>[]): Promise<Availability[]> {
    const response = await api.put(`/teachers/${teacherId}/availability`, { availability })
    return response.data
  },

  async getAvailability(teacherId: string): Promise<Availability[]> {
    const response = await api.get(`/teachers/${teacherId}/availability`)
    return response.data
  },

  // Course qualifications
  async updateQualifications(teacherId: string, qualifications: { course_id: string; is_preferred: boolean }[]): Promise<CourseQualification[]> {
    const response = await api.put(`/teachers/${teacherId}/qualifications`, { qualifications })
    return response.data
  },

  async getQualifications(teacherId: string): Promise<CourseQualification[]> {
    const response = await api.get(`/teachers/${teacherId}/qualifications`)
    return response.data
  },

  // Workload management
  async getWorkload(teacherId: string): Promise<{
    current: number
    max: number
    assignments: WorkloadAssignment[]
  }> {
    const response = await api.get(`/teachers/${teacherId}/workload`)
    return response.data
  }
}

export interface WorkloadAssignment {
  id: string
  course_id: string
  batch_id: string
  hours_per_week: number
  course?: Course
  batch?: Batch
}

export interface Batch {
  id: string
  year: number
  section: string
  program_id: string
}
