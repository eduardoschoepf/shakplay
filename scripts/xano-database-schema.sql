-- ShakPlay Database Schema for Xano
-- This script creates all the necessary tables and relationships

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar TEXT,
    role VARCHAR(50) DEFAULT 'player' CHECK (role IN ('player', 'club-admin', 'platform-admin')),
    sport VARCHAR(100) DEFAULT 'tennis',
    skill_level INTEGER DEFAULT 1 CHECK (skill_level >= 1 AND skill_level <= 10),
    xp INTEGER DEFAULT 0,
    next_level_xp INTEGER DEFAULT 100,
    phone VARCHAR(20),
    date_of_birth DATE,
    location TEXT,
    bio TEXT,
    achievements TEXT[], -- JSON array of achievement IDs
    preferences JSONB DEFAULT '{"notifications": true, "privacy": "public", "language": "en"}',
    subscription JSONB DEFAULT '{"type": "free"}',
    stats JSONB DEFAULT '{"matches_played": 0, "matches_won": 0, "total_playtime": 0}',
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clubs table
CREATE TABLE clubs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    zip_code VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    website TEXT,
    description TEXT,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    amenities TEXT[], -- JSON array of amenities
    operating_hours JSONB DEFAULT '{}', -- JSON object with day: {open, close}
    pricing JSONB DEFAULT '{"peak_hour_rate": 50, "off_peak_rate": 30}',
    images TEXT[], -- Array of image URLs
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courts table
CREATE TABLE courts (
    id SERIAL PRIMARY KEY,
    club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- indoor, outdoor, clay, hard, grass
    surface VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    has_lights BOOLEAN DEFAULT FALSE,
    max_players INTEGER DEFAULT 4,
    hourly_rate DECIMAL(10,2) DEFAULT 0.0,
    qr_code TEXT UNIQUE,
    booking_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches table
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    club_id INTEGER REFERENCES clubs(id) ON DELETE SET NULL,
    court_id INTEGER REFERENCES courts(id) ON DELETE SET NULL,
    club_name VARCHAR(255),
    court_name VARCHAR(255),
    match_type VARCHAR(50) DEFAULT 'singles' CHECK (match_type IN ('singles', 'doubles')),
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration VARCHAR(50),
    player_score INTEGER DEFAULT 0,
    opponent_score INTEGER DEFAULT 0,
    final_score TEXT,
    recording_url TEXT,
    share_type VARCHAR(20) DEFAULT 'private' CHECK (share_type IN ('public', 'friends', 'private')),
    replays_count INTEGER DEFAULT 0,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Match participants table (for multiplayer matches)
CREATE TABLE match_participants (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'player' CHECK (role IN ('host', 'player', 'spectator')),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(match_id, user_id)
);

-- Replays table
CREATE TABLE replays (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
    timestamp VARCHAR(20) NOT NULL, -- Time in match when replay was marked
    description TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    duration INTEGER DEFAULT 0, -- Duration in seconds
    is_highlight BOOLEAN DEFAULT FALSE,
    tags TEXT[], -- Array of tags
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Match invitations table
CREATE TABLE match_invites (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days')
);

-- Court bookings table
CREATE TABLE court_bookings (
    id SERIAL PRIMARY KEY,
    club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
    court_id INTEGER REFERENCES courts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration INTEGER NOT NULL, -- Duration in minutes
    total_cost DECIMAL(10,2) DEFAULT 0.0,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Club ratings table
CREATE TABLE club_ratings (
    id SERIAL PRIMARY KEY,
    club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(club_id, user_id)
);

-- User favorites table
CREATE TABLE user_favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, club_id)
);

-- Auth tokens table (for session management)
CREATE TABLE auth_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Password reset tokens table
CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email verification tokens table
CREATE TABLE email_verification_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_clubs_city ON clubs(city);
CREATE INDEX idx_clubs_rating ON clubs(rating);
CREATE INDEX idx_courts_club_id ON courts(club_id);
CREATE INDEX idx_matches_user_id ON matches(user_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_date ON matches(date);
CREATE INDEX idx_replays_match_id ON replays(match_id);
CREATE INDEX idx_bookings_user_id ON court_bookings(user_id);
CREATE INDEX idx_bookings_date ON court_bookings(date);
CREATE INDEX idx_ratings_club_id ON club_ratings(club_id);
CREATE INDEX idx_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_auth_tokens_user_id ON auth_tokens(user_id);
CREATE INDEX idx_auth_tokens_expires ON auth_tokens(expires_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON clubs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courts_updated_at BEFORE UPDATE ON courts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
