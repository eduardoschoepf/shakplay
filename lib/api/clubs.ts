import { xanoClient } from "@/lib/xano-client"

export interface Club {
  id: number
  name: string
  logo?: string
  address: string
  city: string
  state: string
  zip_code: string
  phone?: string
  email?: string
  website?: string
  description?: string
  rating: number
  total_reviews: number
  is_favorite?: boolean
  amenities: string[]
  courts: Court[]
  operating_hours: {
    [key: string]: { open: string; close: string }
  }
  pricing: {
    peak_hour_rate: number
    off_peak_rate: number
    member_rate?: number
  }
  images: string[]
  created_at: string
  updated_at: string
}

export interface Court {
  id: number
  club_id: number
  name: string
  type: string // "indoor" | "outdoor" | "clay" | "hard" | "grass"
  surface: string
  is_active: boolean
  has_lights: boolean
  max_players: number
  hourly_rate: number
  qr_code?: string
  booking_url?: string
  created_at: string
  updated_at: string
}

export interface QRScanResult {
  club_id: number
  court_id: number
  club_name: string
  court_name: string
  valid: boolean
}

export interface CourtBooking {
  id: number
  club_id: number
  court_id: number
  user_id: number
  date: string
  start_time: string
  end_time: string
  duration: number
  total_cost: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  payment_status: "pending" | "paid" | "refunded"
  created_at: string
}

export interface ClubRating {
  id: number
  club_id: number
  user_id: number
  rating: number
  review?: string
  created_at: string
}

class ClubsAPI {
  // Get all clubs
  async getClubs(filters?: {
    city?: string
    sport?: string
    rating_min?: number
    has_courts?: boolean
  }) {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })
    }

    const endpoint = `/clubs${params.toString() ? `?${params.toString()}` : ""}`
    return xanoClient.get<Club[]>(endpoint)
  }

  // Get club by ID
  async getClubById(clubId: number) {
    return xanoClient.get<Club>(`/clubs/${clubId}`)
  }

  // Get club courts
  async getClubCourts(clubId: number) {
    return xanoClient.get<Court[]>(`/clubs/${clubId}/courts`)
  }

  // Search clubs
  async searchClubs(
    query: string,
    filters?: {
      city?: string
      sport?: string
      rating_min?: number
      max_distance?: number
      lat?: number
      lng?: number
    },
  ) {
    const params = new URLSearchParams({ q: query })
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })
    }

    return xanoClient.get<Club[]>(`/clubs/search?${params.toString()}`)
  }

  // Scan QR code
  async scanQRCode(qrData: string) {
    return xanoClient.post<QRScanResult>("/clubs/scan-qr", { qr_data: qrData })
  }

  // Book a court
  async bookCourt(clubId: number, courtId: number, date: string, duration: number, startTime?: string) {
    return xanoClient.post<CourtBooking>("/bookings", {
      club_id: clubId,
      court_id: courtId,
      date,
      duration,
      start_time: startTime,
    })
  }

  // Get user's bookings
  async getUserBookings(status?: string) {
    const params = status ? `?status=${status}` : ""
    return xanoClient.get<CourtBooking[]>(`/bookings/my${params}`)
  }

  // Cancel booking
  async cancelBooking(bookingId: number) {
    return xanoClient.patch<CourtBooking>(`/bookings/${bookingId}/cancel`)
  }

  // Rate a club
  async rateClub(clubId: number, rating: number, review?: string) {
    return xanoClient.post<ClubRating>("/clubs/rate", {
      club_id: clubId,
      rating,
      review,
    })
  }

  // Get club ratings
  async getClubRatings(clubId: number, page = 1, limit = 10) {
    return xanoClient.get<{
      ratings: ClubRating[]
      total: number
      page: number
      limit: number
    }>(`/clubs/${clubId}/ratings?page=${page}&limit=${limit}`)
  }

  // Toggle favorite club
  async toggleFavorite(clubId: number) {
    return xanoClient.post<{ is_favorite: boolean }>(`/clubs/${clubId}/favorite`)
  }

  // Get favorite clubs
  async getFavoriteClubs() {
    return xanoClient.get<Club[]>("/clubs/favorites")
  }

  // Get club availability
  async getClubAvailability(clubId: number, date: string) {
    return xanoClient.get<
      {
        court_id: number
        court_name: string
        available_slots: { start_time: string; end_time: string; price: number }[]
      }[]
    >(`/clubs/${clubId}/availability?date=${date}`)
  }

  // Get nearby clubs
  async getNearbyClubs(lat: number, lng: number, radius = 10) {
    return xanoClient.get<Club[]>(`/clubs/nearby?lat=${lat}&lng=${lng}&radius=${radius}`)
  }

  // Report club issue
  async reportClubIssue(clubId: number, issue: string, description: string) {
    return xanoClient.post("/clubs/report", {
      club_id: clubId,
      issue_type: issue,
      description,
    })
  }

  // Get club events
  async getClubEvents(clubId: number) {
    return xanoClient.get<
      {
        id: number
        title: string
        description: string
        date: string
        start_time: string
        end_time: string
        max_participants: number
        current_participants: number
        price: number
        status: string
      }[]
    >(`/clubs/${clubId}/events`)
  }

  // Join club event
  async joinClubEvent(eventId: number) {
    return xanoClient.post(`/events/${eventId}/join`)
  }
}

export const clubsAPI = new ClubsAPI()
