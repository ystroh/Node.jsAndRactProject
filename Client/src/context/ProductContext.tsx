import React, { createContext, useContext, useEffect, useState } from 'react'
import { Product } from '../types'
import * as api from '../api/products'


type ProductContextValue = {
  products: Product[]
  loading: boolean
  error?: string
  reload: () => Promise<void>
  createProduct: (p: Partial<Product>) => Promise<void>
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  approveRequest: (productId: string, requestId: string, isApproved:boolean) => Promise<void>
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined)


export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()




  async function load() {
    setLoading(true)
    try {
      // מביאים את כל המוצרים ללא סינון צד-שרת לפי בעלים
      const res = await api.getAllProducts()
      setProducts(res)
      setError(undefined)
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])



  async function createProduct(payload: Partial<Product>) {
    setLoading(true)
    try {
      const created = await api.createProduct(payload)
      setProducts((p) => [created, ...p])
    } catch (err: any) {
      setError(err?.message || String(err))
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function updateProduct(id: string, payload: Partial<Product>) {
    setLoading(true)
    try {
      const updated = await api.updateProduct(id, payload)
      setProducts((p) => p.map((x) => (x.id === id ? updated : x)))
    } catch (err: any) {
      setError(err?.message || String(err))
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function deleteProduct(id: string) {
    setLoading(true)
    try {
      await api.deleteProduct(id)
      setProducts((p) => p.filter((x) => x.id !== id))
    } catch (err: any) {
      setError(err?.message || String(err))
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function approveRequest(productId: string, requestId: string,  isApproved:boolean) {
    setLoading(true)
    try {
      const updated = await api.approveRequest(productId, requestId,isApproved)
      setProducts((p) => p.map((x) => (x.id === updated.id ? updated : x)))
    } catch (err: any) {
      setError(err?.message || String(err))
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProductContext.Provider value={{ products, loading, error, reload: load, createProduct, updateProduct, deleteProduct, approveRequest }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProducts must be used within ProductProvider')
  return ctx
}