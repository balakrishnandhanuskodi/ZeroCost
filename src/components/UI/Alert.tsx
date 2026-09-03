import React from 'react'
import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle, X } from 'lucide-react'

type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  type: AlertType
  title?: string
  message: string
  onClose?: () => void
}

const typeConfig: Record<AlertType, { bg: string; border: string; icon: React.ReactNode; text: string }> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    text: 'text-green-800'
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: <AlertCircle className="w-5 h-5 text-red-600" />,
    text: 'text-red-800'
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    text: 'text-amber-800'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: <InfoIcon className="w-5 h-5 text-blue-600" />,
    text: 'text-blue-800'
  }
}

export default function Alert({ type, title, message, onClose }: AlertProps) {
  const config = typeConfig[type]

  return (
    <div className={`
      ${config.bg} ${config.border} border rounded-lg p-4 mb-4
      flex gap-3 items-start
    `}>
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="flex-1">
        {title && <h3 className={`font-semibold ${config.text}`}>{title}</h3>}
        <p className={`text-sm ${config.text}`}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${config.text} hover:opacity-70 transition-opacity`}
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
