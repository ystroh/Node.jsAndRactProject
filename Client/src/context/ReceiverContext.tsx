import React, { createContext, useContext, useState } from 'react'
import * as api from '../api/requests'

type RequestsContextValue = {
    myRequests: any[]
    loading: boolean
    submitRequest: (itemId: string, message: string) => Promise<void>
    fetchMyRequests: () => Promise<void>
    fetchAllRequests:()=> Promise<void>
    deleteRequest: (requestId: string) => Promise<void>
}

const RequestsContext = createContext<RequestsContextValue | undefined>(undefined)

export const RequestsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [myRequests, setMyRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    async function fetchMyRequests() {
        setLoading(true)
        try {
            const data = await api.getMyRequests()
            setMyRequests(data)
        } finally { setLoading(false) }
    }

    
    async function fetchAllRequests() {
        setLoading(true)
        try {
            const data = await api.getAllRequests()
            setMyRequests(data)
        } finally { setLoading(false) }
    }

    async function submitRequest(itemId: string, message: string) {
        await api.createRequest({ itemId, message })
        await fetchMyRequests() // רענון רשימה לאחר הגשת בקשה
    }

    async function deleteRequest(requestId: string) {
        setLoading(true)
        try {
            await api.deleteRequest(requestId) // קריאה ל-API
            // עדכון הסטייט המקומי: מסירים את הבקשה שמחקנו
            setMyRequests((prev) => prev.filter((r) => (r._id || r.id) !== requestId))
        } catch (err) {
            console.error("Error deleting request:", err)
            throw err // זורקים את השגיאה כדי שנוכל לטפל בה ב-UI אם צריך
        } finally {
            setLoading(false)
        }
    }

    return (
        <RequestsContext.Provider value={{ myRequests, loading, submitRequest, fetchMyRequests,fetchAllRequests, deleteRequest }}>
            {children}
        </RequestsContext.Provider>
    )
}

export function useRequests() {
    const ctx = useContext(RequestsContext)
    if (!ctx) throw new Error('useRequests must be used within RequestsProvider')
    return ctx
}