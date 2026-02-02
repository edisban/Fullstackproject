--
-- PostgreSQL database dump
--

\restrict M8AOwUWIovXFkZNDjxg7MVCug8JvNWfeomwMLgElfHnhTJaaJx5E9vvekEURQ6Z

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2026-02-02 14:29:06

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

-- TOC entry 5077 (class 0 OID 16854)
-- Dependencies: 221
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (created_at, id, name, description) FROM stdin;
2025-11-22 13:11:14.84399	1	project1	small
2025-11-22 13:11:39.936427	2	project2	medium
2025-11-22 13:11:56.301416	3	project3	bigg
2025-11-22 14:03:23.993621	4	project4	bigger
2026-01-27 15:59:43.721709	5	project5	normal
\.


--
-- TOC entry 5079 (class 0 OID 16866)
-- Dependencies: 223
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (date_of_birth, created_at, id, project_id, code_number, first_name, last_name, title, description) FROM stdin;
1995-08-02	2025-11-22 13:13:05.966881	1	1	131313	Jack	Sparrow	Pirate	\N
1996-09-01	2025-11-22 13:14:37.707111	2	2	141414	Christopher	Nolan	Frontend Engineer	frontendd
1990-01-02	2025-11-22 14:03:01.802041	3	2	161616	Emma	Stone	Backend Engineer	\N
1992-03-03	2025-11-23 10:48:55.512929	4	4	171717	Jim	Carrey	Author	\N
1997-07-02	2025-11-23 16:38:50.491334	5	3	111111	Will	Smith	Frontend	\N
1994-03-02	2025-11-24 09:35:26.226345	6	4	212121	Jim	Morrison	Singer	\N
1981-03-03	2025-11-24 19:28:18.681368	7	2	515151	Daniel	Craig	Actor	\N
1988-02-12	2025-11-25 19:11:36.718419	8	3	616161	Morgan	Freeman	Actor	\N
1981-12-22	2025-11-28 17:43:50.469486	9	1	181818	John	Travolta	Author	\N
\N	2025-12-06 10:08:18.645215	10	2	333333	Mel	Gibson	Actor	\N
\.


--
-- TOC entry 5081 (class 0 OID 16880)
-- Dependencies: 225
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, role, username, password) FROM stdin;
1	ADMIN	admin	$2a$10$PI8WHFtAh3zv2BwKp4d0b.ZsYanXDvQMTDKMZrWXWDxwq/8Fu6Hnu
2	USER	user	$2b$12$8ijy27DHKBOrcVz8nI1p1uLpNWGZfPbfysVnHpAAEHEntlskxR8Dy
\.


--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 220
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 5, true);


--
--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 224
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


-- Completed on 2026-02-02 14:29:06

--
-- PostgreSQL database dump complete
--

\unrestrict M8AOwUWIovXFkZNDjxg7MVCug8JvNWfeomwMLgElfHnhTJaaJx5E9vvekEURQ6Z

