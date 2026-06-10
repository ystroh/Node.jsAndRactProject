export type RequestItem = {
    id: string
    requesterId: string | { name?: string; email?: string; _id?: string; id?: string }
    status: 'pending' | 'approved' | 'rejected'
}

export type Product = {
    id: string
    title: string
    description?: string
    image?: string
    ownerId: string
    category: string; 
    status?: 'available' | 'borrowed' | 'archived'
    requests?: RequestItem[]
}
