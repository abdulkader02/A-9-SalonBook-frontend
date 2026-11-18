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
