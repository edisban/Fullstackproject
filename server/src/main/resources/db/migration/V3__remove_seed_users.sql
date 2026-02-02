-- Remove legacy seed users that were inserted before self-service registration existed
DELETE FROM users WHERE username IN ('admin', 'user');

SELECT setval(
	'users_id_seq',
	COALESCE((SELECT MAX(id) FROM users), 0) + 1,
	false
);
