// Xano API Client Configuration
interface XanoResponse<T = any> {
  data?: T
  error?: string
  message?: string
  status?: number
}

class XanoClient {
  private baseURL: string
  private authToken: string | null = null

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_XANO_WORKSPACE_URL || ""

    // Get auth token from localStorage if available (only on client side)
    if (typeof window !== "undefined") {
      this.authToken = localStorage.getItem("auth_token")
    }
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.authToken = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  // Clear authentication token
  clearAuthToken() {
    this.authToken = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  // Check if Xano is properly configured
  private isConfigured(): boolean {
    return !!(this.baseURL && !this.baseURL.includes("your-workspace-id") && !this.baseURL.includes("x8ki-letl-twmt"))
  }

  // Generic API request method with better error handling
  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<XanoResponse<T>> {
    // Check if Xano is configured
    if (!this.isConfigured()) {
      console.warn("Xano not configured - using mock data")
      return {
        error: "Xano workspace URL not configured",
        data: null,
      }
    }

    const url = `${this.baseURL}${endpoint}`

    // Prepare headers
    const headers: HeadersInit = {
      ...options.headers,
    }

    // Only add Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json"
    }

    // Add auth token if available
    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`
    }

    try {
      console.log(`Making request to: ${url}`)

      const response = await fetch(url, {
        ...options,
        headers,
        mode: "cors",
        credentials: "omit",
      })

      console.log(`Response status: ${response.status}`)

      // Handle different response types
      let responseData: any
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json()
      } else {
        const textData = await response.text()
        // Try to parse as JSON, fallback to text
        try {
          responseData = JSON.parse(textData)
        } catch {
          responseData = { message: textData }
        }
      }

      if (!response.ok) {
        const errorMessage =
          responseData?.message || responseData?.error || `HTTP ${response.status}: ${response.statusText}`

        console.error("API Error:", errorMessage)
        return {
          error: errorMessage,
          status: response.status,
          data: null,
        }
      }

      return {
        data: responseData,
        status: response.status,
      }
    } catch (error) {
      console.error("Network Error:", error)

      // Provide more specific error messages
      let errorMessage = "Network error occurred"

      if (error instanceof TypeError) {
        if (error.message.includes("fetch")) {
          errorMessage = "Unable to connect to server. Please check your internet connection."
        } else if (error.message.includes("CORS")) {
          errorMessage = "CORS error - please check server configuration"
        }
        errorMessage = "CORS error - please check server configuration"
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      return {
        error: errorMessage,
        data: null,
      }
    }
  }

  // GET request
  async get<T = any>(endpoint: string): Promise<XanoResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  // POST request
  async post<T = any>(endpoint: string, data?: any): Promise<XanoResponse<T>> {
    const options: RequestInit = {
      method: "POST",
    }

    if (data instanceof FormData) {
      options.body = data
    } else if (data) {
      options.body = JSON.stringify(data)
    }

    return this.request<T>(endpoint, options)
  }

  // PUT request
  async put<T = any>(endpoint: string, data?: any): Promise<XanoResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PATCH request
  async patch<T = any>(endpoint: string, data?: any): Promise<XanoResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE request
  async delete<T = any>(endpoint: string, data?: any): Promise<XanoResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    if (!this.isConfigured()) {
      return false
    }

    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        credentials: "omit",
      })
      return response.ok
    } catch {
      return false
    }
  }

  // Get current auth status
  isAuthenticated(): boolean {
    return !!this.authToken
  }

  // Get base URL
  getBaseURL(): string {
    return this.baseURL
  }

  // Check if client is configured
  isReady(): boolean {
    return this.isConfigured()
  }
}

// Export singleton instance
export const xanoClient = new XanoClient()
export default xanoClient
