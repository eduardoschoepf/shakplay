-- ShakPlay Seed Data for Xano
-- This script populates the database with sample data for testing

-- Insert sample users
INSERT INTO users (name, email, password_hash, role, sport, skill_level, xp, phone, bio, email_verified) VALUES
('John Doe', 'john@example.com', '$2b$10$example_hash_1', 'player', 'tennis', 5, 1250, '+1234567890', 'Tennis enthusiast with 10 years of experience', true),
('Jane Smith', 'jane@example.com', '$2b$10$example_hash_2', 'player', 'tennis', 7, 2100, '+1234567891', 'Competitive player and coach', true),
('Mike Johnson', 'mike@example.com', '$2b$10$example_hash_3', 'club-admin', 'tennis', 8, 3500, '+1234567892', 'Club manager with passion for the sport', true),
('Sarah Wilson', 'sarah@example.com', '$2b$10$example_hash_4', 'player', 'tennis', 4, 800, '+1234567893', 'Weekend warrior looking to improve', true),
('Admin User', 'admin@shakplay.com', '$2b$10$example_hash_5', 'platform-admin', 'tennis', 10, 10000, '+1234567894', 'Platform administrator', true);

-- Insert sample clubs
INSERT INTO clubs (name, logo, address, city, state, zip_code, phone, email, website, description, rating, total_reviews, amenities, operating_hours, pricing, images, latitude, longitude) VALUES
('Elite Tennis Club', '/placeholder.svg?height=60&width=60', '123 Tennis Ave', 'New York', 'NY', '10001', '+1-555-0101', 'info@elitetennis.com', 'https://elitetennis.com', 'Premier tennis facility with world-class courts', 4.8, 156, ARRAY['Pro Shop', 'Locker Rooms', 'Parking', 'Restaurant', 'Fitness Center'], '{"monday": {"open": "06:00", "close": "22:00"}, "tuesday": {"open": "06:00", "close": "22:00"}, "wednesday": {"open": "06:00", "close": "22:00"}, "thursday": {"open": "06:00", "close": "22:00"}, "friday": {"open": "06:00", "close": "22:00"}, "saturday": {"open": "07:00", "close": "21:00"}, "sunday": {"open": "07:00", "close": "21:00"}}', '{"peak_hour_rate": 75, "off_peak_rate": 50, "member_rate": 35}', ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'], 40.7128, -74.0060),
('City Sports Center', '/placeholder.svg?height=60&width=60', '456 Sports Blvd', 'Los Angeles', 'CA', '90210', '+1-555-0102', 'contact@citysports.com', 'https://citysports.com', 'Modern sports complex with multiple courts', 4.6, 89, ARRAY['Pro Shop', 'Locker Rooms', 'Parking', 'Cafe'], '{"monday": {"open": "05:30", "close": "23:00"}, "tuesday": {"open": "05:30", "close": "23:00"}, "wednesday": {"open": "05:30", "close": "23:00"}, "thursday": {"open": "05:30", "close": "23:00"}, "friday": {"open": "05:30", "close": "23:00"}, "saturday": {"open": "06:00", "close": "22:00"}, "sunday": {"open": "06:00", "close": "22:00"}}', '{"peak_hour_rate": 60, "off_peak_rate": 40, "member_rate": 30}', ARRAY['/placeholder.svg?height=300&width=400'], 34.0522, -118.2437),
('Riverside Tennis Academy', '/placeholder.svg?height=60&width=60', '789 River Rd', 'Miami', 'FL', '33101', '+1-555-0103', 'hello@riverside.com', 'https://riverside.com', 'Professional tennis academy with coaching programs', 4.9, 234, ARRAY['Pro Shop', 'Locker Rooms', 'Parking', 'Pool', 'Spa'], '{"monday": {"open": "06:00", "close": "21:00"}, "tuesday": {"open": "06:00", "close": "21:00"}, "wednesday": {"open": "06:00", "close": "21:00"}, "thursday": {"open": "06:00", "close": "21:00"}, "friday": {"open": "06:00", "close": "21:00"}, "saturday": {"open": "07:00", "close": "20:00"}, "sunday": {"open": "07:00", "close": "20:00"}}', '{"peak_hour_rate": 80, "off_peak_rate": 55, "member_rate": 40}', ARRAY['/placeholder.svg?height=300&width=400'], 25.7617, -80.1918);

-- Insert sample courts
INSERT INTO courts (club_id, name, type, surface, is_active, has_lights, max_players, hourly_rate, qr_code) VALUES
(1, 'Court 1', 'outdoor', 'hard', true, true, 4, 75.00, 'QR_ELITE_COURT_1'),
(1, 'Court 2', 'outdoor', 'hard', true, true, 4, 75.00, 'QR_ELITE_COURT_2'),
(1, 'Court 3', 'indoor', 'hard', true, false, 4, 85.00, 'QR_ELITE_COURT_3'),
(2, 'Court A', 'outdoor', 'hard', true, true, 4, 60.00, 'QR_CITY_COURT_A'),
(2, 'Court B', 'outdoor', 'hard', true, true, 4, 60.00, 'QR_CITY_COURT_B'),
(2, 'Court C', 'indoor', 'hard', true, false, 4, 70.00, 'QR_CITY_COURT_C'),
(3, 'Center Court', 'outdoor', 'clay', true, true, 4, 80.00, 'QR_RIVERSIDE_CENTER'),
(3, 'Practice Court 1', 'outdoor', 'clay', true, true, 4, 70.00, 'QR_RIVERSIDE_PRACTICE_1'),
(3, 'Practice Court 2', 'outdoor', 'clay', true, true, 4, 70.00, 'QR_RIVERSIDE_PRACTICE_2');

-- Insert sample matches
INSERT INTO matches (user_id, club_id, court_id, club_name, court_name, match_type, status, duration, player_score, opponent_score, date, final_score, replays_count) VALUES
(1, 1, 1, 'Elite Tennis Club', 'Court 1', 'singles', 'completed', '90 minutes', 6, 4, '2024-01-15', '6-4, 6-2', 3),
(1, 2, 4, 'City Sports Center', 'Court A', 'singles', 'completed', '75 minutes', 7, 5, '2024-01-10', '7-5, 6-3', 2),
(2, 1, 2, 'Elite Tennis Club', 'Court 2', 'singles', 'completed', '105 minutes', 4, 6, '2024-01-12', '4-6, 6-4, 6-7', 5),
(1, 3, 7, 'Riverside Tennis Academy', 'Center Court', 'singles', 'scheduled', '90 minutes', 0, 0, '2024-02-01', null, 0);

-- Insert match participants
INSERT INTO match_participants (match_id, user_id, role) VALUES
(1, 1, 'host'),
(1, 2, 'player'),
(2, 1, 'host'),
(2, 4, 'player'),
(3, 2, 'host'),
(3, 1, 'player'),
(4, 1, 'host');

-- Insert sample replays
INSERT INTO replays (match_id, timestamp, description, duration, is_highlight, tags) VALUES
(1, '15:30', 'Amazing backhand winner down the line', 8, true, ARRAY['winner', 'backhand', 'highlight']),
(1, '32:45', 'Great defensive play and recovery', 12, false, ARRAY['defense', 'rally']),
(1, '58:20', 'Match point ace serve', 5, true, ARRAY['ace', 'serve', 'match-point']),
(2, '22:15', 'Incredible passing shot', 6, true, ARRAY['passing-shot', 'winner']),
(2, '41:30', 'Long rally with great shots', 18, false, ARRAY['rally', 'endurance']),
(3, '08:45', 'Perfect drop shot', 4, true, ARRAY['drop-shot', 'finesse']),
(3, '25:10', 'Powerful forehand cross-court', 7, false, ARRAY['forehand', 'power']),
(3, '39:55', 'Net play and volley winner', 9, true, ARRAY['volley', 'net-play']),
(3, '67:20', 'Comeback point in third set', 15, true, ARRAY['comeback', 'clutch']),
(3, '89:40', 'Championship point rally', 22, true, ARRAY['championship', 'rally', 'epic']);

-- Insert sample court bookings
INSERT INTO court_bookings (club_id, court_id, user_id, date, start_time, end_time, duration, total_cost, status, payment_status) VALUES
(1, 1, 1, '2024-02-05', '14:00', '15:30', 90, 112.50, 'confirmed', 'paid'),
(2, 4, 2, '2024-02-06', '10:00', '11:00', 60, 60.00, 'confirmed', 'paid'),
(3, 7, 1, '2024-02-08', '16:00', '17:30', 90, 120.00, 'pending', 'pending'),
(1, 2, 4, '2024-02-10', '09:00', '10:30', 90, 112.50, 'confirmed', 'paid');

-- Insert sample club ratings
INSERT INTO club_ratings (club_id, user_id, rating, review) VALUES
(1, 1, 5, 'Excellent facilities and well-maintained courts. Staff is very professional.'),
(1, 2, 5, 'Love playing here! The courts are always in perfect condition.'),
(1, 4, 4, 'Great club, though it can get busy during peak hours.'),
(2, 1, 4, 'Good value for money. Courts are decent and location is convenient.'),
(2, 2, 5, 'Modern facilities with great amenities. Highly recommend!'),
(3, 1, 5, 'Best tennis academy in the area. Professional coaching and pristine clay courts.'),
(3, 2, 5, 'Amazing experience every time. The clay courts are world-class.');

-- Insert sample user favorites
INSERT INTO user_favorites (user_id, club_id) VALUES
(1, 1),
(1, 3),
(2, 1),
(2, 2),
(4, 2);

-- Insert sample match invitations
INSERT INTO match_invites (match_id, sender_id, recipient_email, recipient_id, status, message) VALUES
(4, 1, 'jane@example.com', 2, 'pending', 'Hey Jane, want to play a match this weekend?'),
(4, 1, 'sarah@example.com', 4, 'accepted', 'Looking forward to our game!');

-- Update club ratings based on inserted reviews
UPDATE clubs SET 
    rating = (SELECT AVG(rating::numeric) FROM club_ratings WHERE club_id = clubs.id),
    total_reviews = (SELECT COUNT(*) FROM club_ratings WHERE club_id = clubs.id)
WHERE id IN (1, 2, 3);

-- Update user stats based on matches
UPDATE users SET 
    stats = jsonb_set(
        jsonb_set(
            jsonb_set(
                stats, 
                '{matches_played}', 
                (SELECT COUNT(*)::text::jsonb FROM matches WHERE user_id = users.id)
            ),
            '{matches_won}',
            (SELECT COUNT(*)::text::jsonb FROM matches WHERE user_id = users.id AND player_score > opponent_score)
        ),
        '{total_playtime}',
        (SELECT COALESCE(SUM(CASE 
            WHEN duration LIKE '%minutes' THEN CAST(REPLACE(duration, ' minutes', '') AS INTEGER)
            ELSE 0 
        END), 0)::text::jsonb FROM matches WHERE user_id = users.id AND status = 'completed')
    )
WHERE id IN (1, 2, 3, 4, 5);
