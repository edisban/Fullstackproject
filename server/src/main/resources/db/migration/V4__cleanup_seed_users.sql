-- Idempotently remove legacy seed accounts so self-service registration owns the data
DELETE FROM users WHERE username IN ('admin', 'user');

-- Reset the sequence to the next available id so newly registered users get unique ids
SELECT setval(
    'users_id_seq',
    GREATEST(COALESCE((SELECT MAX(id) FROM users), 0) + 1, 1),
    false
);
