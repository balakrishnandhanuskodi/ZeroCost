import React from 'react'

interface CardProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}

export default function Card({
  title,
  subtitle,
  children,
  className = '',
  action
}: CardProps) {
  return (
    <div className={`
      bg-white rounded-lg shadow-md border border-gray-200
      overflow-hidden hover:shadow-lg transition-shadow duration-200
      ${className}
    `}>
      {(title || subtitle || action) && (
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-start">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="px-6 py-4">
        {children}
      </div>
    </div>
  )
}
