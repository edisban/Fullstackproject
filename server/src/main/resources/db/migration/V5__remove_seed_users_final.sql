-- Final cleanup: Remove legacy seed users from V2
-- This migration is idempotent - safe to run multiple times
DELETE FROM users WHERE username IN ('admin', 'user');

-- Reset the sequence to start from 1 for new users
SELECT setval(
    'users_id_seq',
    GREATEST(COALESCE((SELECT MAX(id) FROM users), 0) + 1, 1),
    false
);
