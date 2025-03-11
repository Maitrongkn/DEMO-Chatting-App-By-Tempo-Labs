-- Seed data for testing

-- Insert test users (passwords are 'password')
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'user1@example.com', '{"name":"Sarah Johnson"}'::jsonb),
  ('00000000-0000-0000-0000-000000000002', 'user2@example.com', '{"name":"Michael Chen"}'::jsonb),
  ('00000000-0000-0000-0000-000000000003', 'user3@example.com', '{"name":"Jessica Williams"}'::jsonb),
  ('00000000-0000-0000-0000-000000000004', 'user4@example.com', '{"name":"David Rodriguez"}'::jsonb),
  ('00000000-0000-0000-0000-000000000005', 'user5@example.com', '{"name":"Emily Thompson"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert user profiles
INSERT INTO public.users (id, email, name, avatar_url, status)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'user1@example.com', 'Sarah Johnson', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', 'online'),
  ('00000000-0000-0000-0000-000000000002', 'user2@example.com', 'Michael Chen', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', 'online'),
  ('00000000-0000-0000-0000-000000000003', 'user3@example.com', 'Jessica Williams', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica', 'offline'),
  ('00000000-0000-0000-0000-000000000004', 'user4@example.com', 'David Rodriguez', 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', 'offline'),
  ('00000000-0000-0000-0000-000000000005', 'user5@example.com', 'Emily Thompson', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', 'online')
ON CONFLICT (id) DO NOTHING;

-- Create friend connections
INSERT INTO public.friends (user_id, friend_id, status)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'accepted'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'accepted'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'accepted'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'accepted'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'accepted'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'accepted'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'accepted'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'accepted'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'accepted'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'accepted')
ON CONFLICT (user_id, friend_id) DO NOTHING;

-- Insert some sample messages
INSERT INTO public.messages (sender_id, receiver_id, content, read, created_at)
VALUES
  -- Sarah and Michael conversation
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Hey Sarah, how are you doing?', true, NOW() - INTERVAL '2 HOURS'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Hi Michael! I''m doing well, thanks for asking. How about you?', true, NOW() - INTERVAL '1 HOUR 55 MINUTES'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Pretty good! Just working on this new project.', true, NOW() - INTERVAL '1 HOUR 50 MINUTES'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Did you see the latest update?', true, NOW() - INTERVAL '1 HOUR 45 MINUTES'),
  
  -- Sarah and Jessica conversation
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Let''s meet tomorrow at 2pm', true, NOW() - INTERVAL '1 DAY'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Sounds good! Where should we meet?', true, NOW() - INTERVAL '23 HOURS'),
  
  -- Sarah and David conversation
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Thanks for your help!', true, NOW() - INTERVAL '1 DAY'),
  
  -- Sarah and Emily conversation
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Can you send me the files?', true, NOW() - INTERVAL '3 DAYS');
