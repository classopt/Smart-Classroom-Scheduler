import api from './axios.config'

export interface Schedule {
  id: string
  name: string
  department_id: string
  academic_year: string
  semester: string
  status: 'draft' | 'generated' | 'published' | 'archived'
  created_at: string
  updated_at: string
  entries: ScheduleEntry[]
  statistics?: ScheduleStatistics
}

export interface ScheduleEntry {
  id: string
  course_id: string
  teacher_id: string
  room_id: string
  batch_id: string
  day_of_week: number
  start_time: string
  end_time: string
  course?: Course
  teacher?: Teacher
  room?: Room
  batch?: Batch
}

export interface Course {
  id: string
  name: string
  code: string
  type: 'theory' | 'lab' | 'tutorial'
}

export interface Teacher {
  id: string
  name: string
  email: string
}

export interface Room {
  id: string
  number: string
  building: string
  capacity: number
  type: string
}

export interface Batch {
  id: string
  year: number
  section: string
  program_id: string
}

export interface ScheduleStatistics {
  total_entries: number
  total_courses: number
  total_teachers: number
  total_rooms: number
  conflicts: Conflict[]
  room_utilization: RoomUtilization[]
  teacher_workload: TeacherWorkload[]
}

export interface Conflict {
  id: string
  type: 'teacher_conflict' | 'room_conflict' | 'batch_conflict'
  severity: 'low' | 'medium' | 'high'
  description: string
  affected_entities: {
    teacher_id?: string
    room_id?: string
    batch_id?: string
    course_id?: string
  }
  suggested_resolution?: string
}

export interface RoomUtilization {
  room_id: string
  room_number: string
  total_hours: number
  utilized_hours: number
  utilization_percentage: number
}

export interface TeacherWorkload {
  teacher_id: string
  teacher_name: string
  assigned_hours: number
  max_hours: number
  workload_percentage: number
}

export interface GenerateScheduleRequest {
  department_id: string
  academic_year: string
  semester: string
  constraints: ScheduleConstraints
  preferences?: SchedulePreferences
}

export interface ScheduleConstraints {
  max_continuous_hours: number
  break_duration: number
  preferred_time_slots: {
    theory: string[]
    lab: string[]
    tutorial: string[]
  }
  room_constraints: {
    lab_courses_only_in_labs: boolean
    max_capacity_utilization: number
  }
  teacher_constraints: {
    max_daily_hours: number
    preferred_departments: boolean
  }
}

export interface SchedulePreferences {
  distribute_workload_evenly: boolean
  minimize_gap_hours: boolean
  prefer_morning_slots: boolean
  group_same_batch_courses: boolean
}

export interface WorkloadAssignment {
  id: string
  teacher_id: string
  course_id: string
  batch_id: string
  hours_per_week: number
  is_confirmed: boolean
  course?: Course
  teacher?: Teacher
  batch?: Batch
}

export const schedulingService = {
  // Schedule management
  async getAll(filters?: {
    department_id?: string
    academic_year?: string
    semester?: string
    status?: string
  }): Promise<Schedule[]> {
    const params = new URLSearchParams()
    if (filters?.department_id) params.append('department_id', filters.department_id)
    if (filters?.academic_year) params.append('academic_year', filters.academic_year)
    if (filters?.semester) params.append('semester', filters.semester)
    if (filters?.status) params.append('status', filters.status)
    
    const response = await api.get(`/schedules?${params}`)
    return response.data
  },

  async getById(id: string): Promise<Schedule> {
    const response = await api.get(`/schedules/${id}`)
    return response.data
  },

  async create(data: Omit<Schedule, 'id' | 'created_at' | 'updated_at' | 'entries' | 'statistics'>): Promise<Schedule> {
    const response = await api.post('/schedules', data)
    return response.data
  },

  async update(id: string, data: Partial<Schedule>): Promise<Schedule> {
    const response = await api.put(`/schedules/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/schedules/${id}`)
  },

  // Schedule generation
  async generate(request: GenerateScheduleRequest): Promise<{
    schedule_id: string
    status: string
    estimated_time: number
  }> {
    const response = await api.post('/schedules/generate', request)
    return response.data
  },

  async getGenerationProgress(scheduleId: string): Promise<{
    progress: number
    status: string
    current_step: string
    conflicts_found: number
    entries_generated: number
  }> {
    const response = await api.get(`/schedules/${scheduleId}/generation-progress`)
    return response.data
  },

  // Conflict management
  async getConflicts(scheduleId: string): Promise<Conflict[]> {
    const response = await api.get(`/schedules/${scheduleId}/conflicts`)
    return response.data
  },

  async resolveConflict(scheduleId: string, conflictId: string, resolution: any): Promise<void> {
    await api.post(`/schedules/${scheduleId}/conflicts/${conflictId}/resolve`, { resolution })
  },

  // Schedule entries
  async addEntry(scheduleId: string, entry: Omit<ScheduleEntry, 'id'>): Promise<ScheduleEntry> {
    const response = await api.post(`/schedules/${scheduleId}/entries`, entry)
    return response.data
  },

  async updateEntry(scheduleId: string, entryId: string, entry: Partial<ScheduleEntry>): Promise<ScheduleEntry> {
    const response = await api.put(`/schedules/${scheduleId}/entries/${entryId}`, entry)
    return response.data
  },

  async deleteEntry(scheduleId: string, entryId: string): Promise<void> {
    await api.delete(`/schedules/${scheduleId}/entries/${entryId}`)
  },

  // Workload management
  async getWorkloadAssignments(filters?: {
    department_id?: string
    teacher_id?: string
    course_id?: string
  }): Promise<WorkloadAssignment[]> {
    const params = new URLSearchParams()
    if (filters?.department_id) params.append('department_id', filters.department_id)
    if (filters?.teacher_id) params.append('teacher_id', filters.teacher_id)
    if (filters?.course_id) params.append('course_id', filters.course_id)
    
    const response = await api.get(`/workload-assignments?${params}`)
    return response.data
  },

  async assignWorkload(data: Omit<WorkloadAssignment, 'id' | 'is_confirmed'>): Promise<WorkloadAssignment> {
    const response = await api.post('/workload-assignments', data)
    return response.data
  },

  async updateWorkloadAssignment(id: string, data: Partial<WorkloadAssignment>): Promise<WorkloadAssignment> {
    const response = await api.put(`/workload-assignments/${id}`, data)
    return response.data
  },

  async deleteWorkloadAssignment(id: string): Promise<void> {
    await api.delete(`/workload-assignments/${id}`)
  },

  async confirmWorkloadAssignment(id: string): Promise<WorkloadAssignment> {
    const response = await api.post(`/workload-assignments/${id}/confirm`)
    return response.data
  },

  // Analytics
  async getScheduleAnalytics(scheduleId: string): Promise<ScheduleStatistics> {
    const response = await api.get(`/schedules/${scheduleId}/analytics`)
    return response.data
  },

  async exportSchedule(scheduleId: string, format: 'pdf' | 'excel'): Promise<Blob> {
    const response = await api.get(`/schedules/${scheduleId}/export?format=${format}`, {
      responseType: 'blob'
    })
    return response.data
  }
}
