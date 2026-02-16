import { cn } from '../lib/utils'
import { Spinner } from './ui/spinner'
import { Card, CardContent } from './ui/card'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Spinner className={sizeClasses[size]} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  )
}

interface FullPageLoadingProps {
  text?: string
  subtext?: string
}

export function FullPageLoading({ text = 'Loading...', subtext }: FullPageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Spinner className="w-8 h-8" />
              <div className="absolute inset-0 w-8 h-8 animate-ping bg-primary/20 rounded-full" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-medium">{text}</h3>
              {subtext && (
                <p className="text-sm text-muted-foreground">{subtext}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface SkeletonLoaderProps {
  className?: string
  lines?: number
}

export function SkeletonLoader({ className, lines = 3 }: SkeletonLoaderProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 bg-muted rounded animate-pulse',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

interface CardSkeletonProps {
  className?: string
}

export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <Card className={cn('p-6', className)}>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
          </div>
        </div>
        <SkeletonLoader lines={2} />
      </div>
    </Card>
  )
}

interface TableSkeletonProps {
  rows?: number
  columns?: number
  className?: string
}

export function TableSkeleton({ rows = 5, columns = 4, className }: TableSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-8 bg-muted rounded animate-pulse" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-6 bg-muted rounded animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  )
}

interface ProgressLoaderProps {
  progress: number
  text?: string
  className?: string
}

export function ProgressLoader({ progress, text, className }: ProgressLoaderProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {text && (
        <div className="flex justify-between text-sm">
          <span>{text}</span>
          <span className="text-muted-foreground">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full bg-secondary rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

interface DotsLoaderProps {
  className?: string
  text?: string
}

export function DotsLoader({ className, text }: DotsLoaderProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {text && <span className="text-sm text-muted-foreground mr-2">{text}</span>}
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}
