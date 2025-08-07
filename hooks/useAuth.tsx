"use client"

import { useState, useEffect, useContext, createContext, type ReactNode } from "react"
import { authAPI, type User, type LoginCredentials, type RegisterData } from "@/lib/api/auth"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (profileData: Partial<User>) => Promise<boolean>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (token) {
        const response = await authAPI.getProfile()
        if (response.data) {
          setUser(response.data)
        } else {
          localStorage.removeItem("auth_token")
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("auth_token")
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await authAPI.login(credentials)

      if (response.data) {
        const { user: userData, authToken } = response.data
        localStorage.setItem("auth_token", authToken)

        // Get full user profile
        const profileResponse = await authAPI.getProfile()
        if (profileResponse.data) {
          setUser(profileResponse.data)
        } else {
          // Fallback to basic user data
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar,
            role: "player",
            sport: "Tennis",
            skill_level: userData.skill_level || 1,
            xp: userData.xp || 0,
            next_level_xp: 100,
            achievements: [],
            preferences: {
              notifications: true,
              privacy: "public",
              language: "en",
            },
            subscription: {
              type: "free",
            },
            stats: {
              matches_played: 0,
              matches_won: 0,
              total_playtime: 0,
            },
            created_at: userData.created_at,
            updated_at: userData.updated_at,
            email_verified: true,
          })
        }
        return true
      } else {
        console.error("Login failed:", response.error)
        return false
      }
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await authAPI.register(userData)

      if (response.data) {
        const { user: newUser, authToken } = response.data
        localStorage.setItem("auth_token", authToken)

        // Get full user profile
        const profileResponse = await authAPI.getProfile()
        if (profileResponse.data) {
          setUser(profileResponse.data)
        } else {
          // Fallback to basic user data
          setUser({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
            role: "player",
            sport: userData.sport || "Tennis",
            skill_level: userData.skill_level || 1,
            xp: 0,
            next_level_xp: 100,
            achievements: [],
            preferences: {
              notifications: true,
              privacy: "public",
              language: "en",
            },
            subscription: {
              type: "free",
            },
            stats: {
              matches_played: 0,
              matches_won: 0,
              total_playtime: 0,
            },
            created_at: newUser.created_at,
            updated_at: newUser.updated_at,
            email_verified: false,
          })
        }
        return true
      } else {
        console.error("Registration failed:")
        return false
      }
    } catch (error) {
      console.error("Registration error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setLoading(true)
    try {
      await authAPI.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("auth_token")
      setUser(null)
      setLoading(false)
    }
  }

  const updateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    if (!user) return false

    try {
      const response = await authAPI.updateProfile(user.id, profileData)

      if (response.data) {
        setUser(response.data)
        return true
      } else {
        console.error("Profile update failed:")
        return false
      }
    } catch (error) {
      console.error("Profile update error:", error)
      return false
    }
  }

  const refreshUser = async (): Promise<void> => {
    if (!user) return

    try {
      const response = await authAPI.getProfile()
      if (response.data) {
        setUser(response.data)
      }
    } catch (error) {
      console.error("Refresh user error:", error)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}