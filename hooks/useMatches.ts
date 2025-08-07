"use client"

import { useState, useEffect } from "react"
import { matchesAPI, type Match } from "@/lib/api/matches"
import { toast } from "@/hooks/use-toast"

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [activeMatch, setActiveMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load matches on mount
  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await matchesAPI.getMyMatches()

      if (response.data) {
        setMatches(response.data)
        // Find active match if any
        const active = response.data.find((match) => match.status === "active")
        if (active) {
          setActiveMatch(active)
        }
      } else if (response.error) {
        setError(response.error)
        toast({
          title: "Error loading matches",
          description: response.error,
          variant: "destructive",
        })
      }
    } catch (err) {
      const errorMessage = "Failed to load matches"
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

  const createMatch = async (clubId: number, courtId: number, duration: string) => {
    try {
      const response = await matchesAPI.createMatch({
        club_id: clubId,
        court_id: courtId,
        duration,
        match_type: "singles", // default
      })

      if (response.data) {
        toast({
          title: "Match Created",
          description: "Your match has been set up successfully",
        })
        await loadMatches()
        return response.data
      } else if (response.error) {
        toast({
          title: "Failed to create match",
          description: response.error,
          variant: "destructive",
        })
      }
      return null
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create match",
        variant: "destructive",
      })
      return null
    }
  }

  const startMatch = async (matchId: number) => {
    try {
      const response = await matchesAPI.startMatch(matchId)

      if (response.data) {
        setActiveMatch(response.data)
        toast({
          title: "Match Started",
          description: "Recording has begun!",
        })
        await loadMatches()
        return response.data
      } else if (response.error) {
        toast({
          title: "Failed to start match",
          description: response.error,
          variant: "destructive",
        })
      }
      return null
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to start match",
        variant: "destructive",
      })
      return null
    }
  }

  const endMatch = async (matchId: number, finalScore?: string) => {
    try {
      const response = await matchesAPI.endMatch(matchId, finalScore)

      if (response.data) {
        setActiveMatch(null)
        toast({
          title: "Match Completed",
          description: "Match ended successfully!",
        })
        await loadMatches()
        return response.data
      } else if (response.error) {
        toast({
          title: "Failed to end match",
          description: response.error,
          variant: "destructive",
        })
      }
      return null
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to end match",
        variant: "destructive",
      })
      return null
    }
  }

  const markReplay = async (matchId: number, timestamp: string, description?: string) => {
    try {
      const response = await matchesAPI.markReplay(matchId, timestamp, description)

      if (response.data) {
        toast({
          title: "Replay Marked",
          description: `Marked at ${timestamp}`,
        })
        return response.data
      } else if (response.error) {
        toast({
          title: "Failed to mark replay",
          description: response.error,
          variant: "destructive",
        })
      }
      return null
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to mark replay",
        variant: "destructive",
      })
      return null
    }
  }

  const getMatchReplays = async (matchId: number) => {
    try {
      const response = await matchesAPI.getMatchReplays(matchId)

      if (response.data) {
        return response.data
      } else if (response.error) {
        toast({
          title: "Failed to load replays",
          description: response.error,
          variant: "destructive",
        })
      }
      return []
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load replays",
        variant: "destructive",
      })
      return []
    }
  }

  const updateScore = async (matchId: number, playerScore: number, opponentScore: number) => {
    try {
      const response = await matchesAPI.updateScore(matchId, playerScore, opponentScore)

      if (response.data) {
        // Update active match if it's the current one
        if (activeMatch?.id === matchId) {
          setActiveMatch(response.data)
        }
        await loadMatches()
        return response.data
      } else if (response.error) {
        toast({
          title: "Failed to update score",
          description: response.error,
          variant: "destructive",
        })
      }
      return null
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update score",
        variant: "destructive",
      })
      return null
    }
  }

  const invitePlayer = async (matchId: number, playerEmail: string) => {
    try {
      const response = await matchesAPI.invitePlayer(matchId, playerEmail)

      if (response.data) {
        toast({
          title: "Invitation Sent",
          description: `Invited ${playerEmail} to join the match`,
        })
        return response.data
      } else if (response.error) {
        toast({
          title: "Failed to send invitation",
          description: response.error,
          variant: "destructive",
        })
      }
      return null
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      })
      return null
    }
  }

  const respondToInvite = async (inviteId: number, accept: boolean) => {
    try {
      const response = await matchesAPI.respondToInvite(inviteId, accept)

      if (response.data) {
        const action = accept ? "accepted" : "declined"
        toast({
          title: "Invitation Response",
          description: `You have ${action} the match invitation`,
        })
        await loadMatches()
        return response.data
      } else if (response.error) {
        toast({
          title: "Failed to respond to invitation",
          description: response.error,
          variant: "destructive",
        })
      }
      return null
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to respond to invitation",
        variant: "destructive",
      })
      return null
    }
  }

  const deleteMatch = async (matchId: number) => {
    try {
      const response = await matchesAPI.deleteMatch(matchId)

      if (response.data) {
        toast({
          title: "Match Deleted",
          description: "Match has been permanently deleted",
        })
        await loadMatches()
        return true
      } else if (response.error) {
        toast({
          title: "Failed to delete match",
          description: response.error,
          variant: "destructive",
        })
      }
      return false
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete match",
        variant: "destructive",
      })
      return false
    }
  }

  const shareMatch = async (matchId: number, shareType: "public" | "friends" | "private") => {
    try {
      const response = await matchesAPI.shareMatch(matchId, shareType)

      if (response.data) {
        toast({
          title: "Match Shared",
          description: "Match sharing settings updated",
        })
        await loadMatches()
        return response.data
      } else if (response.error) {
        toast({
          title: "Failed to share match",
          description: response.error,
          variant: "destructive",
        })
      }
      return null
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to share match",
        variant: "destructive",
      })
      return null
    }
  }

  return {
    matches,
    activeMatch,
    loading,
    error,
    loadMatches,
    createMatch,
    startMatch,
    endMatch,
    markReplay,
    getMatchReplays,
    updateScore,
    invitePlayer,
    respondToInvite,
    deleteMatch,
    shareMatch,
  }
}
