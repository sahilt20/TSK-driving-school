import toast from 'react-hot-toast'

export function handleError(error: any, customMessage?: string) {
  console.error('Error:', error)

  const message = customMessage || error?.message || 'An unexpected error occurred'
  toast.error(message)

  return {
    success: false,
    error: message
  }
}

export function handleSuccess(message: string) {
  toast.success(message)
  return { success: true }
}

export function handleWarning(message: string) {
  toast(message, {
    icon: '⚠️',
    style: {
      background: '#f59e0b',
      color: '#fff',
    },
  })
}

export function handleInfo(message: string) {
  toast(message, {
    icon: 'ℹ️',
    style: {
      background: '#3b82f6',
      color: '#fff',
    },
  })
}
