export interface User {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  isBlocked: boolean
  phone: string | null
  createdAt?: string
}

// Shape returned by the admin endpoint GET /admin/users (customers only,
// admins are excluded by the server). Kept separate from `User`, which is the
// profile-page shape.
export interface AdminCustomer {
  _id: string
  name: string
  email: string
  image?: string | null
  phone?: string | null
  isBlocked: boolean
  createdAt: string
}
