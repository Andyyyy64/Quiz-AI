import { useState, useCallback } from 'react'

type NotificationType = 'success' | 'error' | 'info'

interface Notification {
    message: string
    type: NotificationType
}

export function useNotification() {
    const [notification, setNotification] = useState<Notification | null>(null)

    const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
        setNotification({ message, type })
        setTimeout(() => setNotification(null), 3000) // Hide after 3 seconds
    }, [])

    return { notification, showNotification }
}