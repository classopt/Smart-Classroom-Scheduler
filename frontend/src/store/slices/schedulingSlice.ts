import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Schedule {
  id: string
  name: string
  department_id: string
  generated_at: string
  status: 'generating' | 'completed' | 'failed'
  conflicts: any[]
  assignments: any[]
}

interface Conflict {
  id: string
  type: 'teacher' | 'room' | 'student'
  description: string
  severity: 'low' | 'medium' | 'high'
  resolved: boolean
  created_at: string
}

interface Workload {
  teacher_id: string
  teacher_name: string
  current_hours: number
  max_hours: number
  assignments: any[]
}

interface SchedulingState {
  currentSchedule: Schedule | null
  schedules: Schedule[]
  conflicts: Conflict[]
  workloads: Workload[]
  generationProgress: number
  isGenerating: boolean
  error: string | null
}

const initialState: SchedulingState = {
  currentSchedule: null,
  schedules: [],
  conflicts: [],
  workloads: [],
  generationProgress: 0,
  isGenerating: false,
  error: null,
}

const schedulingSlice = createSlice({
  name: 'scheduling',
  initialState,
  reducers: {
    setCurrentSchedule: (state, action: PayloadAction<Schedule | null>) => {
      state.currentSchedule = action.payload
    },
    setSchedules: (state, action: PayloadAction<Schedule[]>) => {
      state.schedules = action.payload
    },
    addSchedule: (state, action: PayloadAction<Schedule>) => {
      state.schedules.push(action.payload)
    },
    updateSchedule: (state, action: PayloadAction<Schedule>) => {
      const index = state.schedules.findIndex(s => s.id === action.payload.id)
      if (index !== -1) {
        state.schedules[index] = action.payload
      }
    },
    removeSchedule: (state, action: PayloadAction<string>) => {
      state.schedules = state.schedules.filter(s => s.id !== action.payload)
    },
    setConflicts: (state, action: PayloadAction<Conflict[]>) => {
      state.conflicts = action.payload
    },
    addConflict: (state, action: PayloadAction<Conflict>) => {
      state.conflicts.push(action.payload)
    },
    updateConflict: (state, action: PayloadAction<Conflict>) => {
      const index = state.conflicts.findIndex(c => c.id === action.payload.id)
      if (index !== -1) {
        state.conflicts[index] = action.payload
      }
    },
    removeConflict: (state, action: PayloadAction<string>) => {
      state.conflicts = state.conflicts.filter(c => c.id !== action.payload)
    },
    setWorkloads: (state, action: PayloadAction<Workload[]>) => {
      state.workloads = action.payload
    },
    addWorkload: (state, action: PayloadAction<Workload>) => {
      state.workloads.push(action.payload)
    },
    updateWorkload: (state, action: PayloadAction<Workload>) => {
      const index = state.workloads.findIndex(w => w.teacher_id === action.payload.teacher_id)
      if (index !== -1) {
        state.workloads[index] = action.payload
      }
    },
    removeWorkload: (state, action: PayloadAction<string>) => {
      state.workloads = state.workloads.filter(w => w.teacher_id !== action.payload)
    },
    setGenerationProgress: (state, action: PayloadAction<number>) => {
      state.generationProgress = action.payload
    },
    setIsGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearSchedulingData: (state) => {
      state.currentSchedule = null
      state.schedules = []
      state.conflicts = []
      state.workloads = []
      state.generationProgress = 0
      state.isGenerating = false
      state.error = null
    },
  },
})

export const {
  setCurrentSchedule,
  setSchedules,
  addSchedule,
  updateSchedule,
  removeSchedule,
  setConflicts,
  addConflict,
  updateConflict,
  removeConflict,
  setWorkloads,
  addWorkload,
  updateWorkload,
  removeWorkload,
  setGenerationProgress,
  setIsGenerating,
  setError,
  clearSchedulingData,
} = schedulingSlice.actions

export default schedulingSlice.reducer
