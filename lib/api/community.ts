import { xanoClient } from "@/lib/xano-client"

export interface Friend {
  id: number
  user_id: number
  friend_id: number
  friend_name: string
  friend_avatar?: string
  friend_sport: string
  friend_level: number
  status: "pending" | "accepted" | "blocked"
  mutual_friends: number
  last_played_together?: string
  created_at: string
}

export interface ChatMessage {
  id: number
  chat_id: number
  sender_id: number
  sender_name: string
  sender_avatar?: string
  message: string
  message_type: "text" | "image" | "video" | "match_invite" | "system"
  attachments?: Array<{
    type: "image" | "video" | "file"
    url: string
    name: string
    size: number
  }>
  is_read: boolean
  created_at: string
  updated_at?: string
}

export interface Chat {
  id: number
  type: "direct" | "group" | "club"
  name?: string
  description?: string
  avatar?: string
  participants: Array<{
    user_id: number
    name: string
    avatar?: string
    role: "member" | "admin" | "owner"
    joined_at: string
    last_seen?: string
  }>
  last_message?: ChatMessage
  unread_count: number
  is_muted: boolean
  created_at: string
  updated_at: string
}

export interface Invitation {
  id: number
  type: "match" | "tournament" | "training" | "event"
  from_user_id: number
  from_user_name: string
  from_user_avatar?: string
  to_user_id: number
  title: string
  description: string
  event_date?: string
  event_time?: string
  location?: string
  club_id?: number
  club_name?: string
  court_id?: number
  court_name?: string
  status: "pending" | "accepted" | "declined" | "expired"
  expires_at?: string
  metadata?: any
  created_at: string
}

export interface LeaderboardEntry {
  rank: number
  user_id: number
  username: string
  avatar?: string
  score: number
  level: number
  sport: string
  matches_played: number
  win_rate: number
  recent_change: number
  badges: string[]
}

export interface Tournament {
  id: number
  name: string
  description: string
  sport: string
  tournament_type: "single_elimination" | "double_elimination" | "round_robin" | "swiss"
  status: "upcoming" | "registration" | "in_progress" | "completed" | "cancelled"
  max_participants: number
  current_participants: number
  entry_fee: number
  prize_pool: number
  start_date: string
  end_date: string
  registration_deadline: string
  club_id?: number
  club_name?: string
  organizer_id: number
  organizer_name: string
  rules: string[]
  requirements: {
    min_level: number
    max_level?: number
    age_group?: string
    gender?: "male" | "female" | "mixed"
  }
  participants: Array<{
    user_id: number
    username: string
    avatar?: string
    level: number
    seed?: number
    status: "registered" | "confirmed" | "eliminated" | "withdrawn"
  }>
  brackets?: any
  created_at: string
}

export const communityAPI = {
  // Friends Management
  getFriends: async (status?: string) => {
    const params = status ? `?status=${status}` : ""
    return xanoClient.get<Friend[]>(`/community/friends${params}`)
  },

  sendFriendRequest: async (userId: number, message?: string) => {
    return xanoClient.post("/community/friends/request", {
      user_id: userId,
      message,
    })
  },

  acceptFriendRequest: async (requestId: number) => {
    return xanoClient.post(`/community/friends/${requestId}/accept`)
  },

  declineFriendRequest: async (requestId: number) => {
    return xanoClient.post(`/community/friends/${requestId}/decline`)
  },

  removeFriend: async (friendId: number) => {
    return xanoClient.delete(`/community/friends/${friendId}`)
  },

  blockUser: async (userId: number) => {
    return xanoClient.post("/community/users/block", { user_id: userId })
  },

  unblockUser: async (userId: number) => {
    return xanoClient.delete(`/community/users/block/${userId}`)
  },

  // Chat System
  getChats: async () => {
    return xanoClient.get<Chat[]>("/community/chats")
  },

  getChat: async (chatId: number) => {
    return xanoClient.get<Chat>(`/community/chats/${chatId}`)
  },

  getChatMessages: async (chatId: number, limit = 50, offset = 0) => {
    return xanoClient.get<ChatMessage[]>(`/community/chats/${chatId}/messages?limit=${limit}&offset=${offset}`)
  },

  sendMessage: async (
    chatId: number,
    messageData: {
      message: string
      message_type?: "text" | "image" | "video" | "match_invite"
      attachments?: File[]
    },
  ) => {
    const formData = new FormData()
    formData.append("message", messageData.message)
    formData.append("message_type", messageData.message_type || "text")

    if (messageData.attachments) {
      messageData.attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file)
      })
    }

    return xanoClient.post<ChatMessage>(`/community/chats/${chatId}/messages`, formData)
  },

  createDirectChat: async (userId: number) => {
    return xanoClient.post<Chat>("/community/chats/direct", { user_id: userId })
  },

  createGroupChat: async (chatData: {
    name: string
    description?: string
    participant_ids: number[]
  }) => {
    return xanoClient.post<Chat>("/community/chats/group", chatData)
  },

  markMessagesRead: async (chatId: number, messageIds: number[]) => {
    return xanoClient.post(`/community/chats/${chatId}/read`, { message_ids: messageIds })
  },

  muteChat: async (chatId: number, duration?: number) => {
    return xanoClient.post(`/community/chats/${chatId}/mute`, { duration })
  },

  unmuteChat: async (chatId: number) => {
    return xanoClient.delete(`/community/chats/${chatId}/mute`)
  },

  // Invitations
  getInvitations: async (type?: string, status?: string) => {
    const params = new URLSearchParams()
    if (type) params.append("type", type)
    if (status) params.append("status", status)

    return xanoClient.get<Invitation[]>(`/community/invitations?${params.toString()}`)
  },

  sendInvitation: async (invitationData: {
    type: "match" | "tournament" | "training" | "event"
    to_user_id: number
    title: string
    description: string
    event_date?: string
    event_time?: string
    location?: string
    club_id?: number
    court_id?: number
    metadata?: any
  }) => {
    return xanoClient.post<Invitation>("/community/invitations", invitationData)
  },

  respondToInvitation: async (invitationId: number, response: "accept" | "decline") => {
    return xanoClient.post(`/community/invitations/${invitationId}/respond`, { response })
  },

  cancelInvitation: async (invitationId: number) => {
    return xanoClient.delete(`/community/invitations/${invitationId}`)
  },

  // Leaderboards
  getLeaderboard: async (sport?: string, timeframe = "monthly", limit = 100) => {
    const params = new URLSearchParams()
    if (sport) params.append("sport", sport)
    params.append("timeframe", timeframe)
    params.append("limit", limit.toString())

    return xanoClient.get<LeaderboardEntry[]>(`/community/leaderboard?${params.toString()}`)
  },

  getMyRanking: async (sport?: string, timeframe = "monthly") => {
    const params = new URLSearchParams()
    if (sport) params.append("sport", sport)
    params.append("timeframe", timeframe)

    return xanoClient.get<LeaderboardEntry>(`/community/leaderboard/me?${params.toString()}`)
  },

  // Tournaments
  getTournaments: async (status?: string, sport?: string) => {
    const params = new URLSearchParams()
    if (status) params.append("status", status)
    if (sport) params.append("sport", sport)

    return xanoClient.get<Tournament[]>(`/community/tournaments?${params.toString()}`)
  },

  getTournament: async (tournamentId: number) => {
    return xanoClient.get<Tournament>(`/community/tournaments/${tournamentId}`)
  },

  registerForTournament: async (tournamentId: number) => {
    return xanoClient.post(`/community/tournaments/${tournamentId}/register`)
  },

  withdrawFromTournament: async (tournamentId: number, reason?: string) => {
    return xanoClient.post(`/community/tournaments/${tournamentId}/withdraw`, { reason })
  },

  createTournament: async (
    tournamentData: Omit<Tournament, "id" | "current_participants" | "participants" | "brackets" | "created_at">,
  ) => {
    return xanoClient.post<Tournament>("/community/tournaments", tournamentData)
  },

  // User Search and Discovery
  searchUsers: async (
    query: string,
    filters?: {
      sport?: string
      level_min?: number
      level_max?: number
      location?: string
      distance_km?: number
    },
  ) => {
    const params = new URLSearchParams({ query })
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })
    }
    return xanoClient.get(`/community/users/search?${params.toString()}`)
  },

  getUserProfile: async (userId: number) => {
    return xanoClient.get(`/community/users/${userId}`)
  },

  followUser: async (userId: number) => {
    return xanoClient.post(`/community/users/${userId}/follow`)
  },

  unfollowUser: async (userId: number) => {
    return xanoClient.delete(`/community/users/${userId}/follow`)
  },

  // Activity Feed
  getActivityFeed: async (limit = 20, offset = 0) => {
    return xanoClient.get(`/community/activity?limit=${limit}&offset=${offset}`)
  },

  // Groups and Clubs
  getGroups: async () => {
    return xanoClient.get("/community/groups")
  },

  joinGroup: async (groupId: number) => {
    return xanoClient.post(`/community/groups/${groupId}/join`)
  },

  leaveGroup: async (groupId: number) => {
    return xanoClient.delete(`/community/groups/${groupId}/leave`)
  },

  // Events
  getEvents: async (type?: string, upcoming = true) => {
    const params = new URLSearchParams()
    if (type) params.append("type", type)
    if (upcoming) params.append("upcoming", "true")

    return xanoClient.get(`/community/events?${params.toString()}`)
  },

  joinEvent: async (eventId: number) => {
    return xanoClient.post(`/community/events/${eventId}/join`)
  },

  leaveEvent: async (eventId: number) => {
    return xanoClient.delete(`/community/events/${eventId}/leave`)
  },
}
