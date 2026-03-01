import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Department {
  id: string
  name: string
  code: string
  description?: string
  head_of_department?: string
  programs: any[]
  created_at: string
  updated_at: string
}

interface Teacher {
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
  availability: any[]
  qualifications: any[]
  created_at: string
  updated_at: string
}

interface Course {
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
}

interface Room {
  id: string
  number: string
  building: string
  capacity: number
  type: 'classroom' | 'lab' | 'lecture_hall' | 'seminar_room'
  equipment?: string[]
  created_at: string
  updated_at: string
}

interface EntitiesState {
  departments: Department[]
  teachers: Teacher[]
  courses: Course[]
  rooms: Room[]
  loading: boolean
  error: string | null
}

const initialState: EntitiesState = {
  departments: [],
  teachers: [],
  courses: [],
  rooms: [],
  loading: false,
  error: null,
}

const entitiesSlice = createSlice({
  name: 'entities',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setDepartments: (state, action: PayloadAction<Department[]>) => {
      state.departments = action.payload
    },
    addDepartment: (state, action: PayloadAction<Department>) => {
      state.departments.push(action.payload)
    },
    updateDepartment: (state, action: PayloadAction<Department>) => {
      const index = state.departments.findIndex(d => d.id === action.payload.id)
      if (index !== -1) {
        state.departments[index] = action.payload
      }
    },
    removeDepartment: (state, action: PayloadAction<string>) => {
      state.departments = state.departments.filter(d => d.id !== action.payload)
    },
    setTeachers: (state, action: PayloadAction<Teacher[]>) => {
      state.teachers = action.payload
    },
    addTeacher: (state, action: PayloadAction<Teacher>) => {
      state.teachers.push(action.payload)
    },
    updateTeacher: (state, action: PayloadAction<Teacher>) => {
      const index = state.teachers.findIndex(t => t.id === action.payload.id)
      if (index !== -1) {
        state.teachers[index] = action.payload
      }
    },
    removeTeacher: (state, action: PayloadAction<string>) => {
      state.teachers = state.teachers.filter(t => t.id !== action.payload)
    },
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload
    },
    addCourse: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload)
    },
    updateCourse: (state, action: PayloadAction<Course>) => {
      const index = state.courses.findIndex(c => c.id === action.payload.id)
      if (index !== -1) {
        state.courses[index] = action.payload
      }
    },
    removeCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter(c => c.id !== action.payload)
    },
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload
    },
    addRoom: (state, action: PayloadAction<Room>) => {
      state.rooms.push(action.payload)
    },
    updateRoom: (state, action: PayloadAction<Room>) => {
      const index = state.rooms.findIndex(r => r.id === action.payload.id)
      if (index !== -1) {
        state.rooms[index] = action.payload
      }
    },
    removeRoom: (state, action: PayloadAction<string>) => {
      state.rooms = state.rooms.filter(r => r.id !== action.payload)
    },
    clearEntities: (state) => {
      state.departments = []
      state.teachers = []
      state.courses = []
      state.rooms = []
    },
  },
})

export const {
  setLoading,
  setError,
  setDepartments,
  addDepartment,
  updateDepartment,
  removeDepartment,
  setTeachers,
  addTeacher,
  updateTeacher,
  removeTeacher,
  setCourses,
  addCourse,
  updateCourse,
  removeCourse,
  setRooms,
  addRoom,
  updateRoom,
  removeRoom,
  clearEntities,
} = entitiesSlice.actions

export default entitiesSlice.reducer
