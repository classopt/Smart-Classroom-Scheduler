// Token management utilities

export interface TokenData {
  token: string
  refreshToken: string
  expiresAt: number
}

export class TokenManager {
  private static readonly TOKEN_KEY = "authToken"
  private static readonly REFRESH_TOKEN_KEY = "refreshToken"
  private static readonly EXPIRES_AT_KEY = "tokenExpiresAt"

  // Store tokens with expiration
  static setTokens(token: string, refreshToken: string, expiresIn: number): void {
    const expiresAt = Date.now() + (expiresIn * 1000)
    
    localStorage.setItem(this.TOKEN_KEY, token)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
    localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString())
  }

  // Get access token
  static getAccessToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY)
    const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY)
    
    if (!token || !expiresAt) {
      return null
    }
    
    // Check if token is expired
    if (Date.now() > parseInt(expiresAt)) {
      this.clearTokens()
      return null
    }
    
    return token
  }

  // Get refresh token
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  // Clear all tokens
  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.EXPIRES_AT_KEY)
    localStorage.removeItem("isAuthenticated")
  }

  // Check if token is expired
  static isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY)
    if (!expiresAt) return true
    
    return Date.now() > parseInt(expiresAt)
  }

  // Refresh access token using refresh token
  static async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      return null
    }

    try {
      // TODO: Implement actual token refresh API call
      // For now, return null to force re-login
      this.clearTokens()
      return null
    } catch (error) {
      console.error("Token refresh failed:", error)
      this.clearTokens()
      return null
    }
  }

  // Get time until token expires
  static getTimeUntilExpiration(): number {
    const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY)
    if (!expiresAt) return 0
    
    return Math.max(0, parseInt(expiresAt) - Date.now())
  }
}

export default TokenManager
