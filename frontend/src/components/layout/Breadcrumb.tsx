import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const location = useLocation()
  
  // Generate breadcrumbs from pathname if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    let currentPath = ''
    
    // Add home
    breadcrumbs.push({
      label: 'Home',
      href: '/app/dashboard'
    })
    
    // Generate path segments
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      breadcrumbs.push({
        label,
        href: currentPath
      })
    })
    
    return breadcrumbs
  }

  const breadcrumbItems = items || generateBreadcrumbs()

  if (breadcrumbItems.length <= 1) {
    return null
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.href}>
          {index === breadcrumbItems.length - 1 ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : (
            <Link
              to={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )}
          {index < breadcrumbItems.length - 1 && (
            <ChevronRight className="h-4 w-4" />
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
