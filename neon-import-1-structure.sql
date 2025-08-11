-- =====================================================
-- PART 1: Database Structure and Admin Configuration
-- =====================================================
-- Execute this FIRST to set up the database structure
-- =====================================================

-- Clean start (only run once)
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- =====================================================
-- Tudobem Database - Neon SQL Editor Version (INSERT statements)
-- Generated: 2025-08-11T22:53:51.265Z
-- =====================================================
-- This dump uses INSERT statements instead of COPY commands
-- Compatible with Neon SQL Editor and other web-based SQL tools
-- All UUIDs are properly formatted
-- 
-- INSTRUCTIONS:
-- 1. Open Neon Dashboard → SQL Editor
-- 2. (Optional) Clear existing data first with:
--    DROP SCHEMA public CASCADE; CREATE SCHEMA public;
-- 3. Copy and paste this entire file
-- 4. Click "Run" to execute
-- =====================================================
-- Clear existing data (uncomment if needed)
-- DROP TABLE IF EXISTS exercise_sessions CASCADE;
-- DROP TABLE IF EXISTS exercises CASCADE;
-- DROP TABLE IF EXISTS admin_config CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
--
-- PostgreSQL database dump
--
-- Dumped from database version 15.13 (Homebrew)
-- Dumped by pg_dump version 15.13 (Homebrew)
--
-- Name: admin_config; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.admin_config (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    claude_api_key text,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--
-- Name: exercise_sessions; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.exercise_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_session_id character varying(100) NOT NULL,
    exercise_id uuid NOT NULL,
    answered_correctly boolean NOT NULL,
    response_time_ms integer,
    created_at timestamp with time zone DEFAULT now()
);
--
-- Name: exercises; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.exercises (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sentence text NOT NULL,
    correct_answer text NOT NULL,
    topic character varying(50) NOT NULL,
    level character varying(5) NOT NULL,
    multiple_choice_options jsonb DEFAULT '[]'::jsonb NOT NULL,
    explanation_pt text,
    explanation_en text,
    explanation_uk text,
    hint text,
    difficulty_score double precision DEFAULT 0.5,
    usage_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT exercises_level_check CHECK (((level)::text = ANY ((ARRAY['A1'::character varying, 'A2'::character varying, 'B1'::character varying, 'B2'::character varying, 'C1'::character varying, 'C2'::character varying])::text[])))
);
--
-- Name: generation_queue; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.generation_queue (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_session_id character varying(100) NOT NULL,
    levels jsonb NOT NULL,
    topics jsonb NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    priority integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    processed_at timestamp with time zone,
    CONSTRAINT generation_queue_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'processing'::character varying, 'completed'::character varying, 'failed'::character varying])::text[])))
);
--
-- Name: irregular_verbs; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.irregular_verbs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    infinitive character varying(50) NOT NULL,
    presente_ind_eu character varying(50),
    presente_ind_tu character varying(50),
    presente_ind_ele_ela character varying(50),
    presente_ind_nos character varying(50),
    presente_ind_vos character varying(50),
    presente_ind_eles_elas character varying(50),
    presente_ind_eu_alt character varying(50),
    presente_ind_tu_alt character varying(50),
    presente_ind_ele_ela_alt character varying(50),
    presente_ind_nos_alt character varying(50),
    presente_ind_vos_alt character varying(50),
    presente_ind_eles_elas_alt character varying(50),
    pps_eu character varying(50),
    pps_tu character varying(50),
    pps_ele_ela character varying(50),
    pps_nos character varying(50),
    pps_vos character varying(50),
    pps_eles_elas character varying(50),
    pps_eu_alt character varying(50),
    pps_tu_alt character varying(50),
    pps_ele_ela_alt character varying(50),
    pps_nos_alt character varying(50),
    pps_vos_alt character varying(50),
    pps_eles_elas_alt character varying(50),
    pret_imp_eu character varying(50),
    pret_imp_tu character varying(50),
    pret_imp_ele_ela character varying(50),
    pret_imp_nos character varying(50),
    pret_imp_vos character varying(50),
    pret_imp_eles_elas character varying(50),
    pret_imp_eu_alt character varying(50),
    pret_imp_tu_alt character varying(50),
    pret_imp_ele_ela_alt character varying(50),
    pret_imp_nos_alt character varying(50),
    pret_imp_vos_alt character varying(50),
    pret_imp_eles_elas_alt character varying(50),
    imp_pos_tu character varying(50),
    imp_pos_ele_ela character varying(50),
    imp_pos_nos character varying(50),
    imp_pos_vos character varying(50),
    imp_pos_eles_elas character varying(50),
    imp_pos_tu_alt character varying(50),
    imp_pos_ele_ela_alt character varying(50),
    imp_pos_nos_alt character varying(50),
    imp_pos_vos_alt character varying(50),
    imp_pos_eles_elas_alt character varying(50),
    imp_neg_tu character varying(50),
    imp_neg_ele_ela character varying(50),
    imp_neg_nos character varying(50),
    imp_neg_vos character varying(50),
    imp_neg_eles_elas character varying(50),
    imp_neg_tu_alt character varying(50),
    imp_neg_ele_ela_alt character varying(50),
    imp_neg_nos_alt character varying(50),
    imp_neg_vos_alt character varying(50),
    imp_neg_eles_elas_alt character varying(50),
    inf_pes_eu character varying(50),
    inf_pes_tu character varying(50),
    inf_pes_ele_ela character varying(50),
    inf_pes_nos character varying(50),
    inf_pes_vos character varying(50),
    inf_pes_eles_elas character varying(50),
    inf_pes_eu_alt character varying(50),
    inf_pes_tu_alt character varying(50),
    inf_pes_ele_ela_alt character varying(50),
    inf_pes_nos_alt character varying(50),
    inf_pes_vos_alt character varying(50),
    inf_pes_eles_elas_alt character varying(50),
    fut_imp_eu character varying(50),
    fut_imp_tu character varying(50),
    fut_imp_ele_ela character varying(50),
    fut_imp_nos character varying(50),
    fut_imp_vos character varying(50),
    fut_imp_eles_elas character varying(50),
    fut_imp_eu_alt character varying(50),
    fut_imp_tu_alt character varying(50),
    fut_imp_ele_ela_alt character varying(50),
    fut_imp_nos_alt character varying(50),
    fut_imp_vos_alt character varying(50),
    fut_imp_eles_elas_alt character varying(50),
    cond_pres_eu character varying(50),
    cond_pres_tu character varying(50),
    cond_pres_ele_ela character varying(50),
    cond_pres_nos character varying(50),
    cond_pres_vos character varying(50),
    cond_pres_eles_elas character varying(50),
    cond_pres_eu_alt character varying(50),
    cond_pres_tu_alt character varying(50),
    cond_pres_ele_ela_alt character varying(50),
    cond_pres_nos_alt character varying(50),
    cond_pres_vos_alt character varying(50),
    cond_pres_eles_elas_alt character varying(50),
    conj_pres_eu character varying(50),
    conj_pres_tu character varying(50),
    conj_pres_ele_ela character varying(50),
    conj_pres_nos character varying(50),
    conj_pres_vos character varying(50),
    conj_pres_eles_elas character varying(50),
    conj_pres_eu_alt character varying(50),
    conj_pres_tu_alt character varying(50),
    conj_pres_ele_ela_alt character varying(50),
    conj_pres_nos_alt character varying(50),
    conj_pres_vos_alt character varying(50),
    conj_pres_eles_elas_alt character varying(50),
    conj_pass_eu character varying(50),
    conj_pass_tu character varying(50),
    conj_pass_ele_ela character varying(50),
    conj_pass_nos character varying(50),
    conj_pass_vos character varying(50),
    conj_pass_eles_elas character varying(50),
    conj_pass_eu_alt character varying(50),
    conj_pass_tu_alt character varying(50),
    conj_pass_ele_ela_alt character varying(50),
    conj_pass_nos_alt character varying(50),
    conj_pass_vos_alt character varying(50),
    conj_pass_eles_elas_alt character varying(50),
    conj_fut_eu character varying(50),
    conj_fut_tu character varying(50),
    conj_fut_ele_ela character varying(50),
    conj_fut_nos character varying(50),
    conj_fut_vos character varying(50),
    conj_fut_eles_elas character varying(50),
    conj_fut_eu_alt character varying(50),
    conj_fut_tu_alt character varying(50),
    conj_fut_ele_ela_alt character varying(50),
    conj_fut_nos_alt character varying(50),
    conj_fut_vos_alt character varying(50),
    conj_fut_eles_elas_alt character varying(50),
    participio_passado character varying(50),
    participio_passado_alt character varying(50),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--
-- Name: user_exercise_attempts; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.user_exercise_attempts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    exercise_id uuid,
    is_correct boolean NOT NULL,
    user_answer text NOT NULL,
    attempted_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.user_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    session_token character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(255),
    password_hash character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_login timestamp with time zone,
    is_active boolean DEFAULT true
);
--
-- Data for Name: admin_config; Type: TABLE DATA; Schema: public; Owner: -
--
-- Data for table: admin_config
-- Inserting 1 rows into admin_config
--
-- Data for Name: exercise_sessions; Type: TABLE DATA; Schema: public; Owner: -
--
-- Data for table: exercise_sessions
-- Inserting 10010 rows into exercise_sessions
--
-- Data for Name: exercises; Type: TABLE DATA; Schema: public; Owner: -
--
-- Data for table: exercises
-- Inserting 1194 rows into exercises
ALTER TABLE ONLY public.admin_config
ALTER TABLE ONLY public.exercise_sessions
ALTER TABLE ONLY public.exercises
ALTER TABLE ONLY public.exercises
ALTER TABLE ONLY public.exercises
ALTER TABLE ONLY public.generation_queue
ALTER TABLE ONLY public.irregular_verbs
ALTER TABLE ONLY public.irregular_verbs
ALTER TABLE ONLY public.user_exercise_attempts
ALTER TABLE ONLY public.user_sessions
ALTER TABLE ONLY public.user_sessions
ALTER TABLE ONLY public.users
ALTER TABLE ONLY public.users
ALTER TABLE ONLY public.users
CREATE INDEX idx_exercises_created_at ON public.exercises USING btree (created_at DESC);
CREATE INDEX idx_exercises_level_topic ON public.exercises USING btree (level, topic);
CREATE INDEX idx_exercises_usage_count ON public.exercises USING btree (usage_count);
CREATE INDEX idx_irregular_verbs_infinitive ON public.irregular_verbs USING btree (infinitive);
CREATE INDEX idx_sessions_token ON public.user_sessions USING btree (session_token);
CREATE INDEX idx_sessions_user_id ON public.user_sessions USING btree (user_id);
CREATE INDEX idx_user_attempts_correct ON public.user_exercise_attempts USING btree (user_id, is_correct);
CREATE INDEX idx_user_attempts_exercise_id ON public.user_exercise_attempts USING btree (exercise_id);
CREATE INDEX idx_user_attempts_user_id ON public.user_exercise_attempts USING btree (user_id);
CREATE INDEX idx_users_email ON public.users USING btree (email);
CREATE INDEX idx_users_username ON public.users USING btree (username);
ALTER TABLE ONLY public.user_exercise_attempts
ALTER TABLE ONLY public.user_exercise_attempts
ALTER TABLE ONLY public.user_sessions

-- Insert admin configuration
INSERT INTO public.admin_config (id, claude_api_key, updated_at) VALUES ('4c7b7041-4de5-46d7-91d5-b4d8b71de900'::uuid, 'YOUR_ANTHROPIC_API_KEY_HERE', '2025-07-26 15:29:47.867598+01');

SELECT 'Part 1 complete: Structure and admin config created' as status;
