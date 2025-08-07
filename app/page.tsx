"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { XanoConnectionTest } from "@/components/xano-connection-test"
import {
  Play,
  QrCode,
  MapPin,
  Star,
  Trophy,
  Users,
  LogOut,
  Plus,
  Search,
  Filter,
  Heart,
  Clock,
  Target,
  Settings,
} from "lucide-react"

export default function HomePage() {
  const { user, isAuthenticated, loading, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading ShakPlay...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthScreen />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">ShakPlay</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <QrCode className="w-4 h-4 mr-2" />
                Scan QR
              </Button>

              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>

              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="clubs">Clubs</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardContent user={user} />
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <MatchesContent />
          </TabsContent>

          <TabsContent value="clubs" className="space-y-6">
            <ClubsContent />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <StatsContent user={user} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileContent user={user} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsContent />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function AuthScreen() {
  const { login, register, loading } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showConnectionTest, setShowConnectionTest] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLogin) {
      await login({ email: formData.email, password: formData.password })
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match")
        return
      }
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
            <Play className="w-8 h-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? "Sign in to ShakPlay" : "Create your account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">Record, analyze, and share your sports matches</p>
        </div>

        {/* Connection Test Toggle */}
        <div className="text-center">
          <Button variant="outline" size="sm" onClick={() => setShowConnectionTest(!showConnectionTest)}>
            <Settings className="w-4 h-4 mr-2" />
            {showConnectionTest ? "Hide" : "Test"} Xano Connection
          </Button>
        </div>

        {/* Connection Test Component */}
        {showConnectionTest && (
          <div className="mb-6">
            <XanoConnectionTest />
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? "Welcome back" : "Get started"}</CardTitle>
            <CardDescription>{isLogin ? "Sign in to your account" : "Create your ShakPlay account"}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required={!isLogin}
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder={isLogin ? "demo@shakplay.com" : "Enter your email"}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder={isLogin ? "demo123" : "Create a password"}
                />
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required={!isLogin}
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            {isLogin && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Demo credentials:</strong>
                  <br />
                  Email: demo@shakplay.com
                  <br />
                  Password: demo123
                </p>
              </div>
            )}

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardContent({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-blue-100 mb-4">Ready to play some tennis?</p>
        <div className="flex space-x-4">
          <Button variant="secondary">
            <Plus className="w-4 h-4 mr-2" />
            New Match
          </Button>
          <Button
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Scan Court
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Matches Won</p>
                <p className="text-2xl font-bold">{user?.stats?.matches_won || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Skill Level</p>
                <p className="text-2xl font-bold">{user?.skill_level || 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Play Time</p>
                <p className="text-2xl font-bold">{Math.floor((user?.stats?.total_playtime || 0) / 60)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">XP Points</p>
                <p className="text-2xl font-bold">{user?.xp || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Matches</CardTitle>
            <CardDescription>Your latest tennis matches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">vs. John Doe</p>
                  <p className="text-sm text-gray-600">Elite Tennis Club</p>
                </div>
                <Badge variant="secondary">Won 6-4</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">vs. Jane Smith</p>
                  <p className="text-sm text-gray-600">City Sports Center</p>
                </div>
                <Badge variant="destructive">Lost 4-6</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your scheduled court times</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Court 1 - Elite Tennis Club</p>
                  <p className="text-sm text-gray-600">Tomorrow at 2:00 PM</p>
                </div>
                <Badge>Confirmed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Court A - City Sports Center</p>
                  <p className="text-sm text-gray-600">Friday at 10:00 AM</p>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MatchesContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Matches</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Match
        </Button>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <Input placeholder="Search matches..." />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">Singles Match</h3>
                <p className="text-sm text-gray-600">Elite Tennis Club - Court 1</p>
              </div>
              <Badge>Completed</Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">6-4, 6-2</div>
              <div className="text-sm text-gray-600">Jan 15, 2024</div>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button size="sm" variant="outline">
                View Replays
              </Button>
              <Button size="sm" variant="outline">
                AI Analysis
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">Singles Match</h3>
                <p className="text-sm text-gray-600">City Sports Center - Court A</p>
              </div>
              <Badge variant="secondary">Scheduled</Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-lg">vs. John Doe</div>
              <div className="text-sm text-gray-600">Feb 1, 2024</div>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button size="sm">Start Match</Button>
              <Button size="sm" variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ClubsContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tennis Clubs</h2>
        <Button variant="outline">
          <MapPin className="w-4 h-4 mr-2" />
          Near Me
        </Button>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <Input placeholder="Search clubs..." />
        </div>
        <Button variant="outline">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">Elite Tennis Club</h3>
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-1 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">4.8 (156 reviews)</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">123 Tennis Ave, New York</p>
            <div className="flex space-x-2">
              <Button size="sm" className="flex-1">
                Book Court
              </Button>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">City Sports Center</h3>
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-1 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">4.6 (89 reviews)</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">456 Sports Blvd, Los Angeles</p>
            <div className="flex space-x-2">
              <Button size="sm" className="flex-1">
                Book Court
              </Button>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">Riverside Tennis Academy</h3>
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              </Button>
            </div>
            <div className="flex items-center space-x-1 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">4.9 (234 reviews)</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">789 River Rd, Miami</p>
            <div className="flex space-x-2">
              <Button size="sm" className="flex-1">
                Book Court
              </Button>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatsContent({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Performance Stats</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{user?.stats?.matches_won || 0}</p>
            <p className="text-sm text-gray-600">Matches Won</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{user?.stats?.matches_played || 0}</p>
            <p className="text-sm text-gray-600">Total Matches</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{Math.floor((user?.stats?.total_playtime || 0) / 60)}h</p>
            <p className="text-sm text-gray-600">Play Time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {user?.stats?.matches_played > 0
                ? Math.round((user?.stats?.matches_won / user?.stats?.matches_played) * 100)
                : 0}
              %
            </p>
            <p className="text-sm text-gray-600">Win Rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skill Progression</CardTitle>
          <CardDescription>Your tennis skills over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Technique</span>
                <span className="text-sm text-gray-600">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Strategy</span>
                <span className="text-sm text-gray-600">72%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "72%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Fitness</span>
                <span className="text-sm text-gray-600">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "78%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Mental Game</span>
                <span className="text-sm text-gray-600">68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: "68%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProfileContent({ user }: { user: any }) {
  const { updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    location: user?.location || "",
  })

  const handleSave = async () => {
    const success = await updateProfile(profileData)
    if (success) {
      setEditing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Profile</h2>
        <Button variant={editing ? "default" : "outline"} onClick={editing ? handleSave : () => setEditing(true)}>
          {editing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={user?.avatar || "/placeholder.svg?height=96&width=96"} />
              <AvatarFallback className="text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold mb-2">{user?.name}</h3>
            <Badge className="mb-4">Level {user?.skill_level}</Badge>
            <div className="space-y-2 text-sm text-gray-600">
              <p>{user?.email}</p>
              {user?.phone && <p>{user?.phone}</p>}
              {user?.location && <p>{user?.location}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!editing}
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                disabled={!editing}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!editing}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                disabled={!editing}
                placeholder="City, State"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Your tennis milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="font-medium">First Match</p>
              <p className="text-xs text-gray-600">Completed your first match</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="font-medium">Social Player</p>
              <p className="text-xs text-gray-600">Added 5 friends</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="font-medium">Rising Star</p>
              <p className="text-xs text-gray-600">Reached level 5</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg opacity-50">
              <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="font-medium">Perfectionist</p>
              <p className="text-xs text-gray-600">Win without losing a game</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Xano Connection</CardTitle>
            <CardDescription>Test and verify your Xano backend connection</CardDescription>
          </CardHeader>
          <CardContent>
            <XanoConnectionTest />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Match Reminders</p>
                <p className="text-sm text-gray-600">Get notified about upcoming matches</p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Achievement Alerts</p>
                <p className="text-sm text-gray-600">Celebrate your tennis milestones</p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>Control your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Profile Visibility</p>
                <p className="text-sm text-gray-600">Who can see your profile</p>
              </div>
              <Badge variant="outline">Public</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Match History</p>
                <p className="text-sm text-gray-600">Who can see your match results</p>
              </div>
              <Badge variant="outline">Friends</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
