import api from './axios.config'

export interface Department {
  id: string
  name: string
  code: string
  description?: string
  head_of_department?: string
  programs: Program[]
  created_at: string
  updated_at: string
}

export interface Program {
  id: string
  name: string
  code: string
  duration: number
  department_id: string
  batches: Batch[]
}

export interface Batch {
  id: string
  year: number
  section: string
  program_id: string
  students_count: number
}

export interface CreateDepartmentData {
  name: string
  code: string
  description?: string
  head_of_department?: string
}

export interface UpdateDepartmentData extends Partial<CreateDepartmentData> {}

export const departmentService = {
  async getAll(): Promise<Department[]> {
    const response = await api.get('/departments')
    return response.data
  },

  async getById(id: string): Promise<Department> {
    const response = await api.get(`/departments/${id}`)
    return response.data
  },

  async create(data: CreateDepartmentData): Promise<Department> {
    const response = await api.post('/departments', data)
    return response.data
  },

  async update(id: string, data: UpdateDepartmentData): Promise<Department> {
    const response = await api.put(`/departments/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/departments/${id}`)
  },

  // Program management
  async createProgram(departmentId: string, data: Omit<Program, 'id' | 'department_id' | 'batches'>): Promise<Program> {
    const response = await api.post(`/departments/${departmentId}/programs`, data)
    return response.data
  },

  async updateProgram(departmentId: string, programId: string, data: Partial<Program>): Promise<Program> {
    const response = await api.put(`/departments/${departmentId}/programs/${programId}`, data)
    return response.data
  },

  async deleteProgram(departmentId: string, programId: string): Promise<void> {
    await api.delete(`/departments/${departmentId}/programs/${programId}`)
  },

  // Batch management
  async createBatch(departmentId: string, programId: string, data: Omit<Batch, 'id' | 'program_id'>): Promise<Batch> {
    const response = await api.post(`/departments/${departmentId}/programs/${programId}/batches`, data)
    return response.data
  },

  async updateBatch(departmentId: string, programId: string, batchId: string, data: Partial<Batch>): Promise<Batch> {
    const response = await api.put(`/departments/${departmentId}/programs/${programId}/batches/${batchId}`, data)
    return response.data
  },

  async deleteBatch(departmentId: string, programId: string, batchId: string): Promise<void> {
    await api.delete(`/departments/${departmentId}/programs/${programId}/batches/${batchId}`)
  }
}
