--
-- PostgreSQL database dump
--

-- Dumped from database version 13.12
-- Dumped by pg_dump version 13.12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: model_node; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.model_node (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) DEFAULT 'test'::character varying NOT NULL,
    param_key text DEFAULT '[]'::text,
    program character varying(255) DEFAULT 'test'::character varying,
    exe_prefix character varying(255) DEFAULT 'test'::character varying,
    conda_env character varying(255) DEFAULT 'test'::character varying
);


ALTER TABLE public.model_node OWNER TO postgres;

--
-- Name: task_node; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_node (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    model_node_id uuid NOT NULL,
    status character varying(255) DEFAULT 'test'::character varying NOT NULL,
    params text DEFAULT '{}'::text
);


ALTER TABLE public.task_node OWNER TO postgres;

--
-- Data for Name: model_node; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.model_node (id, name, param_key, program, exe_prefix, conda_env) FROM stdin;
3843a602-e950-4bcf-b1f3-1b003ce5d041	test	name	D:/data/autowater/py/test.py	python	test
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: task_node; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_node (id, model_node_id, status, params) FROM stdin;
3df30861-b953-453f-81b8-1598f4cdeedd	3843a602-e950-4bcf-b1f3-1b003ce5d041	success	{"name":"NNU"}
\.


--
-- Name: model_node PK_f717bb379162749bece2483a4b1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model_node
    ADD CONSTRAINT "PK_f717bb379162749bece2483a4b1" PRIMARY KEY (id);


--
-- Name: task_node taskManager_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_node
    ADD CONSTRAINT "taskManager_pkey" PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

