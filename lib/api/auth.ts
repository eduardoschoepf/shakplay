import { xanoClient } from "@/lib/xano-client"

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role: "player" | "club-admin" | "platform-admin"
  sport: string
  skill_level: number
  xp: number
  next_level_xp: number
  phone?: string
  date_of_birth?: string
  location?: string
  bio?: string
  achievements: string[]
  preferences: {
    notifications: boolean
    privacy: "public" | "friends" | "private"
    language: string
  }
  subscription: {
    type: "free" | "premium" | "pro"
    expires_at?: string
  }
  stats: {
    matches_played: number
    matches_won: number
    total_playtime: number
    favorite_club?: string
  }
  created_at: string
  updated_at: string
  email_verified: boolean
  last_login?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  sport?: string
  skill_level?: number
  phone?: string
  date_of_birth?: string
}

export interface AuthResponse {
  user: {
    id: number
    name: string
    email: string
    avatar?: string
    skill_level: number
    xp: number
    created_at: string
    updated_at: string
  }
  authToken: string
}

// Mock data for development when Xano is not configured
const mockUser: User = {
  id: 1,
  name: "Demo User",
  email: "demo@shakplay.com",
  avatar: "/placeholder.svg?height=100&width=100",
  role: "player",
  sport: "Tennis",
  skill_level: 5,
  xp: 1250,
  next_level_xp: 1500,
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  bio: "Tennis enthusiast and weekend warrior",
  achievements: ["First Match", "Social Player", "Rising Star"],
  preferences: {
    notifications: true,
    privacy: "public",
    language: "en",
  },
  subscription: {
    type: "premium",
    expires_at: "2024-12-31",
  },
  stats: {
    matches_played: 25,
    matches_won: 18,
    total_playtime: 1800,
    favorite_club: "Elite Tennis Club",
  },
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-15T00:00:00Z",
  email_verified: true,
  last_login: "2024-01-15T10:30:00Z",
}

// Check if we should use mock data (when Xano URL is not properly configured)
const shouldUseMockData = () => {
  const xanoUrl = process.env.NEXT_PUBLIC_XANO_WORKSPACE_URL
  return !xanoUrl || xanoUrl.includes("your-workspace-id") || xanoUrl.includes("x8ki-letl-twmt")
}

// Mock API responses for development
const mockAPI = {
  async login(credentials: LoginCredentials) {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

    if (credentials.email === "demo@shakplay.com" && credentials.password === "demo123") {
      return {
        data: {
          authToken: "mock_jwt_token_" + Date.now(),
          user: {
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            avatar: mockUser.avatar,
            skill_level: mockUser.skill_level,
            xp: mockUser.xp,
            created_at: mockUser.created_at,
            updated_at: mockUser.updated_at,
          },
        },
      }
    } else {
      return {
        error: "Invalid credentials. Try demo@shakplay.com / demo123",
      }
    }
  },

  async register(userData: RegisterData) {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser: User = {
      ...mockUser,
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      sport: userData.sport || "Tennis",
      skill_level: userData.skill_level || 1,
      phone: userData.phone,
      date_of_birth: userData.date_of_birth,
      xp: 0,
      next_level_xp: 100,
      stats: {
        matches_played: 0,
        matches_won: 0,
        total_playtime: 0,
      },
      achievements: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return {
      data: {
        authToken: "mock_jwt_token_" + Date.now(),
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
          skill_level: newUser.skill_level,
          xp: newUser.xp,
          created_at: newUser.created_at,
          updated_at: newUser.updated_at,
        },
      },
    }
  },

  async getProfile() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { data: mockUser }
  },

  async updateProfile(profileData: Partial<User>) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const updatedUser = { ...mockUser, ...profileData, updated_at: new Date().toISOString() }
    return { data: updatedUser }
  },

  async logout() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { data: { success: true } }
  },
}

export const authAPI = {
  async login(credentials: LoginCredentials) {
    if (shouldUseMockData()) {
      console.warn("Using mock authentication - configure NEXT_PUBLIC_XANO_WORKSPACE_URL for real API")
      return mockAPI.login(credentials)
    }

    try {
      return await xanoClient.post<AuthResponse>("/auth/login", credentials)
    } catch (error) {
      console.error("Login API error:", error)
      return { error: "Failed to connect to authentication service" }
    }
  },

  async register(userData: RegisterData) {
    if (shouldUseMockData()) {
      console.warn("Using mock authentication - configure NEXT_PUBLIC_XANO_WORKSPACE_URL for real API")
      return mockAPI.register(userData)
    }

    try {
      return await xanoClient.post<AuthResponse>("/auth/signup", userData)
    } catch (error) {
      console.error("Register API error:", error)
      return { error: "Failed to connect to authentication service" }
    }
  },

  async getProfile() {
    if (shouldUseMockData()) {
      return mockAPI.getProfile()
    }

    try {
      return await xanoClient.get("/auth/me")
    } catch (error) {
      console.error("Get profile API error:", error)
      return { error: "Failed to fetch profile" }
    }
  },

  async updateProfile(userId: number, profileData: any) {
    if (shouldUseMockData()) {
      return mockAPI.updateProfile(profileData)
    }

    try {
      return await xanoClient.patch(`/users/${userId}`, profileData)
    } catch (error) {
      console.error("Update profile API error:", error)
      return { error: "Failed to update profile" }
    }
  },

  async logout() {
    if (shouldUseMockData()) {
      return mockAPI.logout()
    }

    try {
      const response = await xanoClient.post("/auth/logout")
      // Clear local token regardless of response
      xanoClient.clearAuthToken()
      return response
    } catch (error) {
      console.error("Logout API error:", error)
      return { error: "Failed to logout" }
    }
  },
}

export default authAPI
