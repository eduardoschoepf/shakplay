import { xanoClient } from "@/lib/xano-client"

export interface UserStats {
  user_id: number
  sport: string
  level: number
  xp: number
  next_level_xp: number
  matches_played: number
  matches_won: number
  matches_lost: number
  matches_drawn: number
  win_rate: number
  current_streak: number
  best_streak: number
  total_playtime: number
  average_match_duration: number
  favorite_club: string
  favorite_court_type: string
  performance_trend: "improving" | "stable" | "declining"
  last_match_date?: string
  achievements: Achievement[]
  skill_breakdown: {
    technique: number
    strategy: number
    fitness: number
    mental: number
    consistency: number
  }
  monthly_stats: Array<{
    month: string
    matches_played: number
    matches_won: number
    win_rate: number
    playtime: number
  }>
  updated_at: string
}

export interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  category: "matches" | "skills" | "social" | "milestones" | "special"
  rarity: "common" | "rare" | "epic" | "legendary"
  points: number
  unlocked_at?: string
  progress?: {
    current: number
    required: number
    percentage: number
  }
  requirements: string[]
}

export interface Leaderboard {
  timeframe: "daily" | "weekly" | "monthly" | "all_time"
  sport: string
  category: "overall" | "wins" | "win_rate" | "playtime" | "level"
  entries: Array<{
    rank: number
    user_id: number
    username: string
    avatar?: string
    value: number
    change: number
    badge?: string
  }>
  user_rank?: {
    rank: number
    value: number
    change: number
  }
  updated_at: string
}

export interface PerformanceMetrics {
  user_id: number
  timeframe: "week" | "month" | "quarter" | "year"
  metrics: {
    matches_played: number
    win_rate: number
    average_score: number
    improvement_rate: number
    consistency_score: number
    peak_performance_date: string
    low_performance_date: string
  }
  skill_progression: Array<{
    skill: string
    current_level: number
    previous_level: number
    improvement: number
    trend: "up" | "down" | "stable"
  }>
  comparison_data: {
    vs_previous_period: {
      matches_played: number
      win_rate: number
      improvement: number
    }
    vs_peers: {
      percentile: number
      average_peer_performance: number
      ranking: number
    }
  }
  goals: Goal[]
}

export interface Goal {
  id: number
  user_id: number
  title: string
  description: string
  category: "matches" | "skills" | "fitness" | "achievements"
  target_value: number
  current_value: number
  unit: string
  deadline?: string
  status: "active" | "completed" | "paused" | "expired"
  priority: "low" | "medium" | "high"
  progress_percentage: number
  milestones: Array<{
    value: number
    description: string
    completed: boolean
    completed_at?: string
  }>
  created_at: string
  updated_at: string
}

export interface ComparisonData {
  user_stats: UserStats
  comparison_user_stats: UserStats
  comparison_type: "friend" | "peer" | "club_member" | "global_average"
  comparison_metrics: {
    win_rate_diff: number
    level_diff: number
    playtime_diff: number
    streak_diff: number
    skill_comparison: Record<string, number>
  }
  strengths: string[]
  areas_for_improvement: string[]
  recommendations: string[]
}

export const statsAPI = {
  // User Statistics
  getUserStats: async (userId?: number, sport?: string) => {
    const params = new URLSearchParams()
    if (userId) params.append("user_id", userId.toString())
    if (sport) params.append("sport", sport)

    return xanoClient.get<UserStats>(`/stats/user?${params.toString()}`)
  },

  updateUserStats: async (statsData: Partial<UserStats>) => {
    return xanoClient.put<UserStats>("/stats/user", statsData)
  },

  getDetailedStats: async (timeframe: "week" | "month" | "quarter" | "year" = "month") => {
    return xanoClient.get<PerformanceMetrics>(`/stats/detailed?timeframe=${timeframe}`)
  },

  // Achievements
  getAchievements: async (category?: string, unlocked_only = false) => {
    const params = new URLSearchParams()
    if (category) params.append("category", category)
    if (unlocked_only) params.append("unlocked_only", "true")

    return xanoClient.get<Achievement[]>(`/stats/achievements?${params.toString()}`)
  },

  getAvailableAchievements: async () => {
    return xanoClient.get<Achievement[]>("/stats/achievements/available")
  },

  claimAchievement: async (achievementId: number) => {
    return xanoClient.post(`/stats/achievements/${achievementId}/claim`)
  },

  getAchievementProgress: async (achievementId: number) => {
    return xanoClient.get<Achievement>(`/stats/achievements/${achievementId}/progress`)
  },

  // Leaderboards
  getLeaderboard: async (
    sport: string,
    category: "overall" | "wins" | "win_rate" | "playtime" | "level" = "overall",
    timeframe: "daily" | "weekly" | "monthly" | "all_time" = "monthly",
    limit = 100,
  ) => {
    return xanoClient.get<Leaderboard>(
      `/stats/leaderboard?sport=${sport}&category=${category}&timeframe=${timeframe}&limit=${limit}`,
    )
  },

  getMyRanking: async (sport: string, category = "overall", timeframe = "monthly") => {
    return xanoClient.get<{
      rank: number
      value: number
      change: number
      total_players: number
      percentile: number
    }>(`/stats/ranking?sport=${sport}&category=${category}&timeframe=${timeframe}`)
  },

  getClubLeaderboard: async (clubId: number, category = "overall", timeframe = "monthly") => {
    return xanoClient.get<Leaderboard>(`/stats/clubs/${clubId}/leaderboard?category=${category}&timeframe=${timeframe}`)
  },

  // Goals
  getGoals: async (status?: "active" | "completed" | "paused" | "expired") => {
    const params = status ? `?status=${status}` : ""
    return xanoClient.get<Goal[]>(`/stats/goals${params}`)
  },

  createGoal: async (goalData: {
    title: string
    description: string
    category: "matches" | "skills" | "fitness" | "achievements"
    target_value: number
    unit: string
    deadline?: string
    priority?: "low" | "medium" | "high"
    milestones?: Array<{
      value: number
      description: string
    }>
  }) => {
    return xanoClient.post<Goal>("/stats/goals", goalData)
  },

  updateGoal: async (goalId: number, goalData: Partial<Goal>) => {
    return xanoClient.put<Goal>(`/stats/goals/${goalId}`, goalData)
  },

  deleteGoal: async (goalId: number) => {
    return xanoClient.delete(`/stats/goals/${goalId}`)
  },

  updateGoalProgress: async (goalId: number, currentValue: number) => {
    return xanoClient.put(`/stats/goals/${goalId}/progress`, { current_value: currentValue })
  },

  completeGoal: async (goalId: number) => {
    return xanoClient.post(`/stats/goals/${goalId}/complete`)
  },

  pauseGoal: async (goalId: number) => {
    return xanoClient.post(`/stats/goals/${goalId}/pause`)
  },

  resumeGoal: async (goalId: number) => {
    return xanoClient.post(`/stats/goals/${goalId}/resume`)
  },

  // Performance Analysis
  getPerformanceAnalysis: async (timeframe: "week" | "month" | "quarter" | "year" = "month") => {
    return xanoClient.get<PerformanceMetrics>(`/stats/performance?timeframe=${timeframe}`)
  },

  getSkillProgression: async (skill: string, timeframe = "month") => {
    return xanoClient.get(`/stats/skills/${skill}/progression?timeframe=${timeframe}`)
  },

  getPerformanceTrends: async (metrics: string[], timeframe = "month") => {
    const params = new URLSearchParams()
    metrics.forEach((metric) => params.append("metrics", metric))
    params.append("timeframe", timeframe)

    return xanoClient.get(`/stats/trends?${params.toString()}`)
  },

  // Comparisons
  compareWithUser: async (userId: number, timeframe = "month") => {
    return xanoClient.get<ComparisonData>(`/stats/compare/user/${userId}?timeframe=${timeframe}`)
  },

  compareWithPeers: async (sport: string, level?: number, timeframe = "month") => {
    const params = new URLSearchParams({ sport, timeframe })
    if (level) params.append("level", level.toString())

    return xanoClient.get<ComparisonData>(`/stats/compare/peers?${params.toString()}`)
  },

  compareWithClub: async (clubId: number, timeframe = "month") => {
    return xanoClient.get<ComparisonData>(`/stats/compare/club/${clubId}?timeframe=${timeframe}`)
  },

  getGlobalAverages: async (sport: string, level?: number) => {
    const params = new URLSearchParams({ sport })
    if (level) params.append("level", level.toString())

    return xanoClient.get(`/stats/global-averages?${params.toString()}`)
  },

  // Reports and Exports
  generateReport: async (reportType: "monthly" | "quarterly" | "yearly", format: "pdf" | "json" = "pdf") => {
    return xanoClient.get(`/stats/reports/${reportType}?format=${format}`)
  },

  exportStats: async (format: "csv" | "json" | "xlsx" = "csv", timeframe = "all") => {
    return xanoClient.get(`/stats/export?format=${format}&timeframe=${timeframe}`)
  },

  // Insights and Recommendations
  getInsights: async (category?: "performance" | "goals" | "achievements" | "social") => {
    const params = category ? `?category=${category}` : ""
    return xanoClient.get(`/stats/insights${params}`)
  },

  getRecommendations: async (type: "training" | "goals" | "opponents" | "clubs" = "training") => {
    return xanoClient.get(`/stats/recommendations?type=${type}`)
  },

  // Activity Tracking
  logActivity: async (activityData: {
    type: "match" | "training" | "practice"
    duration: number
    intensity: "low" | "medium" | "high"
    notes?: string
    metadata?: Record<string, any>
  }) => {
    return xanoClient.post("/stats/activities", activityData)
  },

  getActivityHistory: async (limit = 50, offset = 0) => {
    return xanoClient.get(`/stats/activities?limit=${limit}&offset=${offset}`)
  },

  // Streaks and Milestones
  getCurrentStreaks: async () => {
    return xanoClient.get("/stats/streaks")
  },

  getMilestones: async (category?: string) => {
    const params = category ? `?category=${category}` : ""
    return xanoClient.get(`/stats/milestones${params}`)
  },

  // Social Stats
  getFriendsStats: async (limit = 10) => {
    return xanoClient.get(`/stats/friends?limit=${limit}`)
  },

  getClubStats: async (clubId: number) => {
    return xanoClient.get(`/stats/clubs/${clubId}`)
  },

  // Notifications and Updates
  getStatsNotifications: async (unread_only = false) => {
    return xanoClient.get(`/stats/notifications?unread_only=${unread_only}`)
  },

  markNotificationRead: async (notificationId: number) => {
    return xanoClient.post(`/stats/notifications/${notificationId}/read`)
  },

  // Settings and Preferences
  getStatsPreferences: async () => {
    return xanoClient.get("/stats/preferences")
  },

  updateStatsPreferences: async (preferences: {
    privacy_level: "public" | "friends" | "private"
    show_on_leaderboard: boolean
    achievement_notifications: boolean
    goal_reminders: boolean
    weekly_reports: boolean
  }) => {
    return xanoClient.put("/stats/preferences", preferences)
  },
}
