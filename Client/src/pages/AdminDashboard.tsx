import React, { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useProducts, ProductProvider } from '../context/ProductContext'
import ProductList from '../components/productComponents/ProductList'
import { useRequests, RequestsProvider } from '../context/ReceiverContext'
import { RequestItem } from '../components/requestComponents/RequestItem'
import * as usersApi from '../api/users'

const TAB_USERS = 'users'
const TAB_ITEMS = 'items'
const TAB_REQUESTS = 'requests'

export function AdminInner() {
	const { products, loading: productsLoading, updateProduct, deleteProduct, approveRequest } = useProducts()
	const { myRequests, fetchAllRequests, loading: requestsLoading, deleteRequest } = useRequests()

	const [activeTab, setActiveTab] = useState<string>(TAB_USERS)

	// Users state
	const [users, setUsers] = useState<any[]>([])
	const [usersLoading, setUsersLoading] = useState(false)
	const [usersError, setUsersError] = useState<string | null>(null)
	const [usersQuery, setUsersQuery] = useState('')

	const [showAddForm, setShowAddForm] = useState(false)
	const [editingUser, setEditingUser] = useState<any | null>(null)

	// Items search/filter
	const [itemsQuery, setItemsQuery] = useState('')

	// Requests search
	const [requestsQuery, setRequestsQuery] = useState('')
	const [requestsError, setRequestsError] = useState<string | null>(null)

	useEffect(() => {
		if (activeTab === TAB_USERS) loadUsers()
		if (activeTab === TAB_REQUESTS) {
			setRequestsError(null)
			fetchAllRequests().catch((err: any) => {
				console.error('fetchMyRequests failed', err)
				setRequestsError(String(err?.message || err))
			})
		}
	}, [activeTab])

	async function loadUsers() {
		setUsersLoading(true)
		setUsersError(null)
		try {
			const res = await usersApi.getUsers()
			setUsers(res || [])
		} catch (err: any) {
			console.error('Failed load users', err)
			setUsersError(String(err?.message || err))
		} finally { setUsersLoading(false) }
	}

	const filteredUsers = useMemo(() => {
		const q = usersQuery.trim().toLowerCase()
		if (!q) return users
		return users.filter(u => (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q))
	}, [users, usersQuery])

	const filteredItems = useMemo(() => {
		const q = itemsQuery.trim().toLowerCase()
		if (!q) return products
		return products.filter(p => (p.title || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q))
	}, [products, itemsQuery])

	const filteredRequests = useMemo(() => {
		const q = requestsQuery.trim().toLowerCase()
		if (!q) return myRequests
		return myRequests.filter((r: any) => {
			const title = r.itemId?.title || ''
			return title.toLowerCase().includes(q) || (r.status || '').toLowerCase().includes(q) || (r.message || '').toLowerCase().includes(q)
		})
	}, [myRequests, requestsQuery])

	async function handleDeleteUser(id: string) {
		if (!confirm('למחוק את המשתמש הזה?')) return
		try {
			await usersApi.deleteUser(id)
			setUsers(prev => prev.filter(u => u._id !== id && u.id !== id))
		} catch (err) { console.error(err) }
	}

	async function handleCreateUser(payload: any) {
		try {
			const created = await usersApi.createUser(payload)
			setUsers(prev => [created.user || created, ...prev])
			setShowAddForm(false)
		} catch (err) { console.error(err); alert(String(err)) }
	}

	async function handleUpdateUser(id: string, payload: any) {
		try {
			const res = await usersApi.updateUser(id, payload)
			const updated = res.user || res
			setUsers(prev => prev.map(u => (u._id === (updated.id || updated._id) || u.id === (updated.id || updated._id)) ? updated : u))
			setEditingUser(null)
		} catch (err) { console.error(err); alert(String(err)) }
	}

	async function handleEditProduct(p: any) {
		const newTitle = prompt('New title', p.title)
		if (newTitle == null) return
		try { await updateProduct(p.id, { ...p, title: newTitle }) } catch (err) { console.error(err) }
	}

	return (
		<div style={{ padding: 20 }}>
			<h1>Admin Dashboard</h1>

			<div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
				<button onClick={() => setActiveTab(TAB_USERS)} style={{ padding: 8, background: activeTab===TAB_USERS? '#184e77':'#eee', color: activeTab===TAB_USERS? 'white':'black' }}>ניהול משתמשים</button>
				<button onClick={() => setActiveTab(TAB_ITEMS)} style={{ padding: 8, background: activeTab===TAB_ITEMS? '#184e77':'#eee', color: activeTab===TAB_ITEMS? 'white':'black' }}>כל הפריטים</button>
				<button onClick={() => setActiveTab(TAB_REQUESTS)} style={{ padding: 8, background: activeTab===TAB_REQUESTS? '#184e77':'#eee', color: activeTab===TAB_REQUESTS? 'white':'black' }}>בקשות</button>
			</div>

			{activeTab === TAB_USERS && (
				<div>
					<h2>Users</h2>
					<div style={{ marginBottom: 10 }}>
						<input placeholder="חיפוש משתמשים" value={usersQuery} onChange={(e) => setUsersQuery(e.target.value)} />
						<button onClick={loadUsers} style={{ marginLeft: 8 }}>רענן</button>
					</div>
					{usersLoading ? <div>Loading...</div> : usersError ? <div style={{ color: 'red' }}>{usersError}</div> : (
						<div style={{ display: 'grid', gap: 8 }}>
							<div style={{ marginBottom: 10 }}>
								<button onClick={() => setShowAddForm((s) => !s)}>{showAddForm ? 'Close' : 'Add user'}</button>
							</div>
							{showAddForm && (
								<AddUserForm onCancel={() => setShowAddForm(false)} onCreate={handleCreateUser} />
							)}
							{filteredUsers.map(u => (
								<div key={u._id || u.id} style={{ border: '1px solid #ddd', padding: 10, borderRadius: 6, display: 'flex', justifyContent: 'space-between' }}>
									<div>
										<div><strong>{u.name}</strong> ({u.email})</div>
										<div>Roles: {Array.isArray(u.roles)? u.roles.join(', '): u.roles}</div>
									</div>
									<div style={{ display: 'flex', gap: 8 }}>
										<button onClick={() => setEditingUser(u)} style={{ padding: '6px 10px' }}>ערוך</button>
										<button onClick={() => { if(confirm('למחוק משתמש?')) handleDeleteUser(u._id || u.id) }} style={{ background:'#ff4d4f', color:'white', border:'none', padding:'6px 10px' }}>מחק</button>
									</div>
								</div>
							))}
							{editingUser && (
								<EditUserForm user={editingUser} onCancel={() => setEditingUser(null)} onSave={(p:any) => handleUpdateUser(editingUser._id || editingUser.id, p)} />
							)}
						</div>
					)}
				</div>
			)}

			{activeTab === TAB_ITEMS && (
				<div>
					<h2>Items</h2>
					<div style={{ marginBottom: 10 }}>
						<input placeholder="חיפוש פריטים" value={itemsQuery} onChange={(e) => setItemsQuery(e.target.value)} />
					</div>
					{productsLoading ? <div>Loading...</div> : (
						<ProductList products={filteredItems} onEdit={handleEditProduct} onDelete={deleteProduct} onApproveRequest={approveRequest} />
					)}
				</div>
			)}

			{activeTab === TAB_REQUESTS && (
				<div>
					<h2>Requests</h2>
					<div style={{ marginBottom: 10 }}>
						<input placeholder="חפש בקשות" value={requestsQuery} onChange={(e) => setRequestsQuery(e.target.value)} />
						<button onClick={() => fetchAllRequests()} style={{ marginLeft: 8 }}>רענן</button>
					</div>
					{requestsLoading ? <div>Loading...</div> : requestsError ? <div style={{ color: 'red' }}>{requestsError}</div> : (
						<div style={{ display: 'grid', gap: 8 }}>
							{filteredRequests.map((r: any) => (
								<RequestItem key={r._id || r.id} request={r} onDelete={deleteRequest} />
							))}
						</div>
					)}
				</div>
			)}
		</div>
	)
}

function AddUserForm({ onCancel, onCreate }: { onCancel: () => void, onCreate: (p:any) => void }) {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const availableRoles = ['admin', 'giver', 'receiver']
	const [roles, setRoles] = useState<string[]>(['receiver'])

	function toggleRole(r: string) {
		setRoles(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])
	}

	return (
		<div style={{ border: '1px solid #ccc', padding: 12, marginBottom: 12 }}>
			<div>
				<input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
				<input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ marginLeft: 8 }} />
			</div>
			<div style={{ marginTop: 8 }}>
				<input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
			</div>
			<div style={{ marginTop: 8 }}>
				<div>Roles:</div>
				<div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
					{availableRoles.map(r => (
						<label key={r} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
							<input type="checkbox" checked={roles.includes(r)} onChange={() => toggleRole(r)} />
							{r}
						</label>
					))}
				</div>
			</div>
			<div style={{ marginTop: 8 }}>
				<button onClick={() => onCreate({ name, email, password, roles })}>Create</button>
				<button onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
			</div>
		</div>
	)
}

function EditUserForm({ user, onCancel, onSave }: { user: any, onCancel: () => void, onSave: (p:any)=>void }) {
	const [name, setName] = useState(user.name || '')
	const [email, setEmail] = useState(user.email || '')
	const availableRoles = ['admin', 'giver', 'receiver']
	const [roles, setRoles] = useState<string[]>(Array.isArray(user.roles) ? user.roles : ['receiver'])

	function toggleRole(r: string) {
		setRoles(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])
	}

	return (
		<div style={{ border: '1px solid #ccc', padding: 12, marginTop: 12 }}>
			<div>
				<input value={name} onChange={e => setName(e.target.value)} />
				<input value={email} onChange={e => setEmail(e.target.value)} style={{ marginLeft: 8 }} />
			</div>
			<div style={{ marginTop: 8 }}>
				<div>Roles:</div>
				<div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
					{availableRoles.map(r => (
						<label key={r} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
							<input type="checkbox" checked={roles.includes(r)} onChange={() => toggleRole(r)} />
							{r}
						</label>
					))}
				</div>
			</div>
			<div style={{ marginTop: 8 }}>
				<button onClick={() => onSave({ name, email, roles })}>Save</button>
				<button onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
			</div>
		</div>
	)
}

export default function AdminDashboard() {
	const roles = JSON.parse(localStorage.getItem('userRoles') || '[]') as string[]
	const token = localStorage.getItem('token')

	if (!token || !roles.includes('admin')) return <Navigate to="/home" replace />

	return (
		<ProductProvider>
			<RequestsProvider>
				<AdminInner />
			</RequestsProvider>
		</ProductProvider>
	)
}

