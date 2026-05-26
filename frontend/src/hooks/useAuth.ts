export type AuthUser = {
  _id: string
  name: string
  email: string
  isAdmin?: boolean
  token: string
}

export const getUser = (): AuthUser | null => {
  const stored = localStorage.getItem('travellerUser')
  return stored ? (JSON.parse(stored) as AuthUser) : null
}

export const setUser = (user: AuthUser) => {
  localStorage.setItem('travellerUser', JSON.stringify(user))
  localStorage.setItem('travellerToken', user.token)
}

export const clearUser = () => {
  localStorage.removeItem('travellerUser')
  localStorage.removeItem('travellerToken')
}

export const isAuthenticated = () => Boolean(getUser())
