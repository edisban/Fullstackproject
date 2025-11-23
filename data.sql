

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres


COPY public.projects (start_date, created_at, id, name, description) FROM stdin;
2025-01-01	2025-11-22 13:11:56.301416	3	project3	big
2025-08-02	2025-11-22 14:03:23.993621	4	project4	bigger
2025-08-08	2025-11-22 13:11:39.936427	2	project2	medium
2025-02-02	2025-11-22 13:11:14.84399	1	project1	small
\.



-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres


COPY public.tasks (date_of_birth, created_at, id, project_id, code_number, status, first_name, last_name, title, description) FROM stdin;
1992-03-03	2025-11-23 10:48:55.512929	7	4	171717	ACTIVE	jim	carrey	author	
1995-03-02	2025-11-22 13:13:05.966881	2	1	131313	INACTIVE	jack	sparrow	pirate	
1994-10-24	2025-11-22 13:12:40.293868	1	1	121212	ACTIVE	edis	bantak	coder	
1999-03-02	2025-11-23 16:38:50.491334	9	3	111111	ACTIVE	jack	Smith	frontend	
1992-01-02	2025-11-22 14:03:01.802041	6	2	161616	ACTIVE	emma	stone	backend	
1996-09-01	2025-11-22 13:14:37.707111	4	2	141414	ACTIVE	christopher	nolan	fronend	
\.



-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres


COPY public.users (id, role, username, password) FROM stdin;
1	USER	admin	8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
3	\N	admin2	96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6ca0a1e
\.



-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres


SELECT pg_catalog.setval('public.projects_id_seq', 5, true);



-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres


SELECT pg_catalog.setval('public.tasks_id_seq', 9, true);



-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


