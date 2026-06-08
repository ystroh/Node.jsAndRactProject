export type RequestItem = {
    id: string
    requesterId: string
    status: 'pending' | 'approved' | 'rejected'
}

export type Product = {
    id: string
    title: string
    description?: string
    image?: string
    ownerId: string
    category: string; // תוסיפי את השורה הזו
    requests?: RequestItem[]
}
