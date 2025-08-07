import { xanoClient } from "@/lib/xano-client"

export interface AIAnalysis {
  id: number
  match_id: number
  user_id: number
  analysis_type: "performance" | "technique" | "strategy" | "full"
  status: "processing" | "completed" | "failed"
  progress: number
  results?: {
    overall_score: number
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
    technique_analysis: {
      forehand: number
      backhand: number
      serve: number
      volley: number
      movement: number
    }
    performance_metrics: {
      accuracy: number
      power: number
      consistency: number
      court_coverage: number
      reaction_time: number
    }
    match_insights: {
      key_moments: Array<{
        timestamp: number
        description: string
        impact: "positive" | "negative" | "neutral"
      }>
      turning_points: Array<{
        timestamp: number
        description: string
        score_before: string
        score_after: string
      }>
      patterns: string[]
    }
    improvement_plan: {
      short_term: string[]
      long_term: string[]
      drills: Array<{
        name: string
        description: string
        duration: string
        difficulty: number
      }>
    }
  }
  price: number
  is_purchased: boolean
  created_at: string
  updated_at: string
  expires_at?: string
}

export interface AIInsight {
  id: number
  user_id: number
  type: "tip" | "warning" | "achievement" | "recommendation"
  title: string
  description: string
  category: "technique" | "strategy" | "fitness" | "mental" | "equipment"
  priority: "low" | "medium" | "high"
  is_read: boolean
  action_required: boolean
  related_match_id?: number
  related_analysis_id?: number
  created_at: string
}

export interface PerformanceComparison {
  user_stats: {
    current_level: number
    improvement_rate: number
    consistency_score: number
    recent_performance: number[]
  }
  peer_comparison: {
    percentile: number
    similar_players: number
    average_score: number
    top_performers: Array<{
      user_id: number
      username: string
      score: number
      level: number
    }>
  }
  historical_data: Array<{
    date: string
    score: number
    matches_played: number
  }>
}

export interface TrainingPlan {
  id: number
  user_id: number
  title: string
  description: string
  duration_weeks: number
  difficulty_level: number
  focus_areas: string[]
  weekly_schedule: Array<{
    week: number
    sessions: Array<{
      day: string
      type: "technique" | "fitness" | "match_play" | "rest"
      duration: number
      exercises: Array<{
        name: string
        description: string
        sets?: number
        reps?: number
        duration?: number
      }>
    }>
  }>
  progress: {
    completed_weeks: number
    completion_percentage: number
    last_session_date?: string
  }
  created_at: string
  updated_at: string
}

export const aiAnalysisAPI = {
  // Request AI analysis for a match
  requestAnalysis: async (matchId: number, analysisType: AIAnalysis["analysis_type"]) => {
    return xanoClient.post<AIAnalysis>("/ai/analysis", {
      match_id: matchId,
      analysis_type: analysisType,
    })
  },

  // Get analysis results
  getAnalysis: async (analysisId: number) => {
    return xanoClient.get<AIAnalysis>(`/ai/analysis/${analysisId}`)
  },

  // Get all user analyses
  getMyAnalyses: async (status?: string, limit = 20, offset = 0) => {
    const params = new URLSearchParams()
    if (status) params.append("status", status)
    params.append("limit", limit.toString())
    params.append("offset", offset.toString())

    return xanoClient.get<AIAnalysis[]>(`/ai/analysis?${params.toString()}`)
  },

  // Purchase analysis
  purchaseAnalysis: async (analysisId: number) => {
    return xanoClient.post(`/ai/analysis/${analysisId}/purchase`)
  },

  // Get AI insights
  getInsights: async (category?: string, unreadOnly = false) => {
    const params = new URLSearchParams()
    if (category) params.append("category", category)
    if (unreadOnly) params.append("unread_only", "true")

    return xanoClient.get<AIInsight[]>(`/ai/insights?${params.toString()}`)
  },

  // Mark insight as read
  markInsightRead: async (insightId: number) => {
    return xanoClient.post(`/ai/insights/${insightId}/read`)
  },

  // Dismiss insight
  dismissInsight: async (insightId: number) => {
    return xanoClient.delete(`/ai/insights/${insightId}`)
  },

  // Get performance comparison
  getPerformanceComparison: async (timeframe = "3months") => {
    return xanoClient.get<PerformanceComparison>(`/ai/performance-comparison?timeframe=${timeframe}`)
  },

  // Generate training plan
  generateTrainingPlan: async (planData: {
    focus_areas: string[]
    duration_weeks: number
    sessions_per_week: number
    difficulty_level: number
    goals: string[]
  }) => {
    return xanoClient.post<TrainingPlan>("/ai/training-plan", planData)
  },

  // Get training plans
  getTrainingPlans: async () => {
    return xanoClient.get<TrainingPlan[]>("/ai/training-plans")
  },

  // Update training plan progress
  updateTrainingProgress: async (
    planId: number,
    progressData: {
      completed_session: {
        week: number
        day: string
        completed_exercises: string[]
        notes?: string
        rating?: number
      }
    },
  ) => {
    return xanoClient.post(`/ai/training-plans/${planId}/progress`, progressData)
  },

  // Get technique analysis
  getTechniqueAnalysis: async (matchId: number, technique: string) => {
    return xanoClient.get(`/ai/technique-analysis/${matchId}?technique=${technique}`)
  },

  // Request real-time coaching
  requestRealTimeCoaching: async (matchId: number) => {
    return xanoClient.post(`/ai/real-time-coaching`, { match_id: matchId })
  },

  // Get coaching suggestions
  getCoachingSuggestions: async (matchId: number, timestamp: number) => {
    return xanoClient.get(`/ai/coaching-suggestions/${matchId}?timestamp=${timestamp}`)
  },

  // Rate analysis quality
  rateAnalysis: async (analysisId: number, rating: number, feedback?: string) => {
    return xanoClient.post(`/ai/analysis/${analysisId}/rate`, { rating, feedback })
  },

  // Share analysis
  shareAnalysis: async (analysisId: number, shareWith: "public" | "friends" | "coach") => {
    return xanoClient.post(`/ai/analysis/${analysisId}/share`, { share_with: shareWith })
  },

  // Get analysis pricing
  getAnalysisPricing: async () => {
    return xanoClient.get("/ai/pricing")
  },

  // Get AI model information
  getModelInfo: async () => {
    return xanoClient.get("/ai/model-info")
  },

  // Export analysis data
  exportAnalysis: async (analysisId: number, format: "pdf" | "json" | "csv") => {
    return xanoClient.get(`/ai/analysis/${analysisId}/export?format=${format}`)
  },
}
