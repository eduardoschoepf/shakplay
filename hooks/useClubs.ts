"use client"

import { useState, useEffect } from "react"
import { clubsAPI, type Club } from "@/lib/api/clubs"
import { toast } from "@/hooks/use-toast"

export function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load clubs on mount
  useEffect(() => {
    loadClubs()
  }, [])

  const loadClubs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await clubsAPI.getClubs()

      if (response.data) {
        setClubs(response.data)
      } else if (response.error) {
        setError(response.error)
        toast({
          title: "Error loading clubs",
          description: response.error,
          variant: "destructive",
        })
      }
    } catch (err) {
      const errorMessage = "Failed to load clubs"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getClubById = async (clubId: number) => {
    try {
      const response = await clubsAPI.getClubById(clubId)
      if (response.data) {
        return response.data
      } else if (response.error) {
        toast({
          title: "Error loading club",
          description: response.error,
          variant: "destructive",
        })
      }
      return null
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load club details",
        variant: "destructive",
      })
      return null
    }
  }

  const getClubCourts = async (clubId: number) => {
    try {
      const response = await clubsAPI.getClubCourts(clubId)
      if (response.data) {
        return response.data
      } else if (response.error) {
        toast({
          title: "Error loading courts",
          description: response.error,
          variant: "destructive",
        })
      }
      return []
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load courts",
        variant: "destructive",
      })
      return []
    }
  }

  const scanQRCode = async (qrData: string) => {
    try {
      const response = await clubsAPI.scanQRCode(qrData)
      if (response.data) {
        toast({
          title: "QR Code Scanned",
          description: `${response.data.club_name} - ${response.data.court_name}`,
        })
        return response.data
      } else if (response.error) {
        toast({
          title: "Invalid QR Code",
          description: response.error,
          variant: "destructive",
        })
      }
      return null
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to scan QR code",
        variant: "destructive",
      })
      return null
    }
  }

  const bookCourt = async (clubId: number, courtId: number, date: string, duration: number) => {
    try {
      const response = await clubsAPI.bookCourt(clubId, courtId, date, duration)
      if (response.data) {
        toast({
          title: "Court Booked",
          description: "Your court has been successfully booked",
        })
        return response.data
      } else if (response.error) {
        toast({
          title: "Booking Failed",
          description: response.error,
          variant: "destructive",
        })
      }
      return null
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to book court",
        variant: "destructive",
      })
      return null
    }
  }

  const rateClub = async (clubId: number, rating: number, review?: string) => {
    try {
      const response = await clubsAPI.rateClub(clubId, rating, review)
      if (response.data) {
        toast({
          title: "Rating Submitted",
          description: "Thank you for your feedback!",
        })
        // Refresh clubs to get updated rating
        await loadClubs()
        return response.data
      } else if (response.error) {
        toast({
          title: "Rating Failed",
          description: response.error,
          variant: "destructive",
        })
      }
      return null
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive",
      })
      return null
    }
  }

  const toggleFavoriteClub = async (clubId: number) => {
    try {
      const response = await clubsAPI.toggleFavorite(clubId)
      if (response.data) {
        const action = response.data.is_favorite ? "added to" : "removed from"
        toast({
          title: "Favorites Updated",
          description: `Club ${action} favorites`,
        })
        // Update local state
        setClubs(clubs.map((club) => (club.id === clubId ? { ...club, is_favorite: response.data?.is_favorite } : club)))
        return response.data
      } else if (response.error) {
        toast({
          title: "Update Failed",
          description: response.error,
          variant: "destructive",
        })
      }
      return null
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      })
      return null
    }
  }

  const searchClubs = async (query: string, filters?: any) => {
    try {
      setLoading(true)
      const response = await clubsAPI.searchClubs(query, filters)
      if (response.data) {
        setClubs(response.data)
        return response.data
      } else if (response.error) {
        toast({
          title: "Search Failed",
          description: response.error,
          variant: "destructive",
        })
      }
      return []
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to search clubs",
        variant: "destructive",
      })
      return []
    } finally {
      setLoading(false)
    }
  }

  return {
    clubs,
    loading,
    error,
    loadClubs,
    getClubById,
    getClubCourts,
    scanQRCode,
    bookCourt,
    rateClub,
    toggleFavoriteClub,
    searchClubs,
  }
}
