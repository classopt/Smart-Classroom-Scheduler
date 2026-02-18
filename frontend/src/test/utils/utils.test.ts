import { describe, it, expect } from 'vitest'
import { cn } from '../../lib/utils'

describe('Utils', () => {
  it('merges class names correctly', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary')
  })
})
