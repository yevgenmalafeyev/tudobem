-- =====================================================
-- PART 1: Database Structure and Admin Configuration (FIXED)
-- =====================================================
-- Execute this FIRST to set up the database structure
-- All ALTER TABLE statements properly formatted
-- =====================================================

-- Clean start (only run once)
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

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



--
-- Data for Name: exercise_sessions; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: exercises; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: generation_queue; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: irregular_verbs; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: user_exercise_attempts; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Name: admin_config admin_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_config
    ADD CONSTRAINT admin_config_pkey PRIMARY KEY (id);


--
-- Name: exercise_sessions exercise_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercise_sessions
    ADD CONSTRAINT exercise_sessions_pkey PRIMARY KEY (id);


--
-- Name: exercises exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_pkey PRIMARY KEY (id);


--
-- Name: exercises exercises_sentence_correct_answer_topic_level_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_sentence_correct_answer_topic_level_key UNIQUE (sentence, correct_answer, topic, level);


--
-- Name: exercises exercises_sentence_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_sentence_unique UNIQUE (sentence);


--
-- Name: generation_queue generation_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generation_queue
    ADD CONSTRAINT generation_queue_pkey PRIMARY KEY (id);


--
-- Name: irregular_verbs irregular_verbs_infinitive_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.irregular_verbs
    ADD CONSTRAINT irregular_verbs_infinitive_key UNIQUE (infinitive);


--
-- Name: irregular_verbs irregular_verbs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.irregular_verbs
    ADD CONSTRAINT irregular_verbs_pkey PRIMARY KEY (id);


--
-- Name: user_exercise_attempts user_exercise_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_exercise_attempts
    ADD CONSTRAINT user_exercise_attempts_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_session_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_session_token_key UNIQUE (session_token);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_exercises_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exercises_created_at ON public.exercises USING btree (created_at DESC);


--
-- Name: idx_exercises_level_topic; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exercises_level_topic ON public.exercises USING btree (level, topic);


--
-- Name: idx_exercises_usage_count; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exercises_usage_count ON public.exercises USING btree (usage_count);


--
-- Name: idx_irregular_verbs_infinitive; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_irregular_verbs_infinitive ON public.irregular_verbs USING btree (infinitive);


--
-- Name: idx_sessions_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_token ON public.user_sessions USING btree (session_token);


--
-- Name: idx_sessions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_user_id ON public.user_sessions USING btree (user_id);


--
-- Name: idx_user_attempts_correct; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_attempts_correct ON public.user_exercise_attempts USING btree (user_id, is_correct);


--
-- Name: idx_user_attempts_exercise_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_attempts_exercise_id ON public.user_exercise_attempts USING btree (exercise_id);


--
-- Name: idx_user_attempts_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_attempts_user_id ON public.user_exercise_attempts USING btree (user_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


--
-- Name: user_exercise_attempts user_exercise_attempts_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_exercise_attempts
    ADD CONSTRAINT user_exercise_attempts_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id) ON DELETE CASCADE;


--
-- Name: user_exercise_attempts user_exercise_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_exercise_attempts
    ADD CONSTRAINT user_exercise_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_sessions user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--




-- Insert admin configuration
INSERT INTO public.admin_config (id, claude_api_key, updated_at) 
VALUES ('4c7b7041-4de5-46d7-91d5-b4d8b71de900'::uuid, 'YOUR_ANTHROPIC_API_KEY_HERE', '2025-07-26 15:29:47.867598+01');


-- Verify structure creation
SELECT 
  COUNT(*) as tables_created
FROM information_schema.tables 
WHERE table_schema = 'public';

SELECT 'Part 1 complete: Database structure created successfully' as status;
