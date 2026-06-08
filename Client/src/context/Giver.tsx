// import React, { createContext, useContext, useEffect, useState } from 'react'
// import { Product } from '../types'
// import * as api from '../api/products'

// type GiverContextValue = {
//     products: Product[]
//     loading: boolean
//     error?: string
//     reload: () => Promise<void>
//     createProduct: (p: Partial<Product>) => Promise<void>
//     updateProduct: (id: string, p: Partial<Product>) => Promise<void>
//     deleteProduct: (id: string) => Promise<void>
//     approveRequest: (productId: string, requestId: string) => Promise<void>
// }

// const GiverContext = createContext<GiverContextValue | undefined>(undefined)

// function readOwnerIdFromLocalStorage(): string | null {
//     const possibleKeys = ['userId', 'id', 'ownerId', 'user']
//     for (const k of possibleKeys) {
//         const v = localStorage.getItem(k)
//         if (v) return v
//     }
//     return null
// }

// export const GiverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [products, setProducts] = useState<Product[]>([])
//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState<string | undefined>()

//     async function load() {
//         const ownerId = readOwnerIdFromLocalStorage()
//         if (!ownerId) {
//             setError('Owner id not found in localStorage (tried keys: userId,id,ownerId,user)')
//             return
//         }
//         setLoading(true)
//         try {
//             const res = await api.getProductsByOwner(ownerId)
//             setProducts(res)
//             setError(undefined)
//         } catch (err: any) {
//             setError(err?.message || String(err))
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         load()
//     }, [])

//     async function createProduct(payload: Partial<Product>) {
//         setLoading(true)
//         try {
//             const created = await api.createProduct(payload)
//             setProducts((p) => [created, ...p])
//         } catch (err: any) {
//             setError(err?.message || String(err))
//             throw err
//         } finally {
//             setLoading(false)
//         }
//     }

//     async function updateProduct(id: string, payload: Partial<Product>) {
//         setLoading(true)
//         try {
//             const updated = await api.updateProduct(id, payload)
//             setProducts((p) => p.map((x) => (x.id === id ? updated : x)))
//         } catch (err: any) {
//             setError(err?.message || String(err))
//             throw err
//         } finally {
//             setLoading(false)
//         }
//     }

//     async function deleteProduct(id: string) {
//         setLoading(true)
//         try {
//             await api.deleteProduct(id)
//             setProducts((p) => p.filter((x) => x.id !== id))
//         } catch (err: any) {
//             setError(err?.message || String(err))
//             throw err
//         } finally {
//             setLoading(false)
//         }
//     }

//     async function approveRequest(productId: string, requestId: string) {
//         setLoading(true)
//         try {
//             const updated = await api.approveRequest(productId, requestId)
//             setProducts((p) => p.map((x) => (x.id === updated.id ? updated : x)))
//         } catch (err: any) {
//             setError(err?.message || String(err))
//             throw err
//         } finally {
//             setLoading(false)
//         }
//     }

//     return (
//         <GiverContext.Provider
//             value={{ products, loading, error, reload: load, createProduct, updateProduct, deleteProduct, approveRequest }}
//         >
//             {children}
//         </GiverContext.Provider>
//     )
// }

// export function useGiver() {
//     const ctx = useContext(GiverContext)
//     if (!ctx) throw new Error('useGiver must be used within GiverProvider')
//     return ctx
// }