import { xanoClient } from "@/lib/xano-client"

export interface Match {
  id: number
  user_id: number
  club_id: number
  court_id: number
  club_name: string
  court_name: string
  match_type: "singles" | "doubles"
  status: "scheduled" | "active" | "completed" | "cancelled"
  start_time?: string
  end_time?: string
  duration: string
  player_score: number
  opponent_score: number
  final_score?: string
  recording_url?: string
  share_type: "public" | "friends" | "private"
  replays_count: number
  date: string
  created_at: string
  updated_at: string
  opponent?: {
    id: number
    name: string
    avatar?: string
    skill_level: string
  }
  participants: {
    id: number
    name: string
    avatar?: string
    role: "host" | "player" | "spectator"
  }[]
}

export interface Replay {
  id: number
  match_id: number
  timestamp: string
  description?: string
  video_url?: string
  thumbnail_url?: string
  duration: number
  is_highlight: boolean
  tags: string[]
  created_at: string
}

export interface MatchInvite {
  id: number
  match_id: number
  sender_id: number
  recipient_email: string
  recipient_id?: number
  status: "pending" | "accepted" | "declined" | "expired"
  message?: string
  created_at: string
  expires_at: string
  match: {
    id: number
    club_name: string
    court_name: string
    date: string
    duration: string
  }
  sender: {
    name: string
    avatar?: string
  }
}

export interface MatchStats {
  total_matches: number
  wins: number
  losses: number
  win_rate: number
  average_score: number
  total_playtime: number
  favorite_club: string
  longest_match: number
  best_streak: number
  replays_created: number
}

class MatchesAPI {
  // Get user's matches
  async getMyMatches(status?: string, limit = 50) {
    const params = new URLSearchParams()
    if (status) params.append("status", status)
    params.append("limit", limit.toString())

    const endpoint = `/matches/my${params.toString() ? `?${params.toString()}` : ""}`
    return xanoClient.get<Match[]>(endpoint)
  }

  // Get match by ID
  async getMatchById(matchId: number) {
    return xanoClient.get<Match>(`/matches/${matchId}`)
  }

  // Create new match
  async createMatch(matchData: {
    club_id: number
    court_id: number
    match_type: "singles" | "doubles"
    duration: string
    scheduled_time?: string
    opponent_email?: string
  }) {
    return xanoClient.post<Match>("/matches", matchData)
  }

  // Start match recording
  async startMatch(matchId: number) {
    return xanoClient.patch<Match>(`/matches/${matchId}/start`)
  }

  // End match
  async endMatch(matchId: number, finalScore?: string) {
    return xanoClient.patch<Match>(`/matches/${matchId}/end`, {
      final_score: finalScore,
    })
  }

  // Update match score
  async updateScore(matchId: number, playerScore: number, opponentScore: number) {
    return xanoClient.patch<Match>(`/matches/${matchId}/score`, {
      player_score: playerScore,
      opponent_score: opponentScore,
    })
  }

  // Mark replay during match
  async markReplay(matchId: number, timestamp: string, description?: string) {
    return xanoClient.post<Replay>("/replays", {
      match_id: matchId,
      timestamp,
      description,
    })
  }

  // Get match replays
  async getMatchReplays(matchId: number) {
    return xanoClient.get<Replay[]>(`/matches/${matchId}/replays`)
  }

  // Get all user replays
  async getMyReplays(page = 1, limit = 20) {
    return xanoClient.get<{
      replays: Replay[]
      total: number
      page: number
      limit: number
    }>(`/replays/my?page=${page}&limit=${limit}`)
  }

  // Update replay
  async updateReplay(
    replayId: number,
    updates: {
      description?: string
      is_highlight?: boolean
      tags?: string[]
    },
  ) {
    return xanoClient.patch<Replay>(`/replays/${replayId}`, updates)
  }

  // Delete replay
  async deleteReplay(replayId: number) {
    return xanoClient.delete(`/replays/${replayId}`)
  }

  // Share match
  async shareMatch(matchId: number, shareType: "public" | "friends" | "private") {
    return xanoClient.patch<Match>(`/matches/${matchId}/share`, {
      share_type: shareType,
    })
  }

  // Invite player to match
  async invitePlayer(matchId: number, playerEmail: string, message?: string) {
    return xanoClient.post<MatchInvite>("/matches/invite", {
      match_id: matchId,
      recipient_email: playerEmail,
      message,
    })
  }

  // Get match invitations
  async getMyInvites(status?: string) {
    const params = status ? `?status=${status}` : ""
    return xanoClient.get<MatchInvite[]>(`/matches/invites/my${params}`)
  }

  // Respond to match invitation
  async respondToInvite(inviteId: number, accept: boolean) {
    return xanoClient.patch<MatchInvite>(`/matches/invites/${inviteId}`, {
      status: accept ? "accepted" : "declined",
    })
  }

  // Cancel match
  async cancelMatch(matchId: number, reason?: string) {
    return xanoClient.patch<Match>(`/matches/${matchId}/cancel`, {
      reason,
    })
  }

  // Delete match
  async deleteMatch(matchId: number) {
    return xanoClient.delete(`/matches/${matchId}`)
  }

  // Get match statistics
  async getMatchStats(timeframe?: "week" | "month" | "year" | "all") {
    const params = timeframe ? `?timeframe=${timeframe}` : ""
    return xanoClient.get<MatchStats>(`/matches/stats${params}`)
  }

  // Search matches
  async searchMatches(
    query: string,
    filters?: {
      club_id?: number
      status?: string
      date_from?: string
      date_to?: string
      match_type?: string
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

    return xanoClient.get<Match[]>(`/matches/search?${params.toString()}`)
  }

  // Get public matches (for discovery)
  async getPublicMatches(page = 1, limit = 20) {
    return xanoClient.get<{
      matches: Match[]
      total: number
      page: number
      limit: number
    }>(`/matches/public?page=${page}&limit=${limit}`)
  }

  // Like/unlike a match
  async toggleMatchLike(matchId: number) {
    return xanoClient.post<{ is_liked: boolean; likes_count: number }>(`/matches/${matchId}/like`)
  }

  // Comment on a match
  async commentOnMatch(matchId: number, comment: string) {
    return xanoClient.post(`/matches/${matchId}/comments`, {
      comment,
    })
  }

  // Get match comments
  async getMatchComments(matchId: number, page = 1, limit = 20) {
    return xanoClient.get<{
      comments: {
        id: number
        user_id: number
        user_name: string
        user_avatar?: string
        comment: string
        created_at: string
      }[]
      total: number
      page: number
      limit: number
    }>(`/matches/${matchId}/comments?page=${page}&limit=${limit}`)
  }

  // Report match
  async reportMatch(matchId: number, reason: string, description?: string) {
    return xanoClient.post("/matches/report", {
      match_id: matchId,
      reason,
      description,
    })
  }

  // Get match analytics
  async getMatchAnalytics(matchId: number) {
    return xanoClient.get<{
      duration_breakdown: { phase: string; duration: number }[]
      score_progression: { timestamp: string; player_score: number; opponent_score: number }[]
      replay_heatmap: { timestamp: string; intensity: number }[]
      performance_metrics: {
        avg_rally_length: number
        winners: number
        unforced_errors: number
        break_points: number
      }
    }>(`/matches/${matchId}/analytics`)
  }
}

export const matchesAPI = new MatchesAPI()
