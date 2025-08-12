-- =====================================================
-- Problem Report System Migration
-- =====================================================
-- Adds tables for problem reporting and AI prompt templates

-- AI Prompt Templates Table (for optimized token usage)
CREATE TABLE public.ai_prompt_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    system_prompt text NOT NULL,
    user_template text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Problem Reports Table
CREATE TABLE public.problem_reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    exercise_id uuid NOT NULL,
    problem_type character varying(100) NOT NULL,
    user_comment text NOT NULL,
    status character varying(20) DEFAULT 'pending' NOT NULL,
    admin_comment text,
    ai_response jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    processed_at timestamp with time zone,
    processed_by uuid,
    CONSTRAINT problem_reports_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying, 'declined'::character varying])::text[]))),
    CONSTRAINT problem_reports_problem_type_check CHECK (((problem_type)::text = ANY ((ARRAY['irrelevant_hint'::character varying, 'incorrect_answer'::character varying, 'missing_option'::character varying, 'other'::character varying])::text[])))
);

-- Email Notifications Log Table (to track sent emails)
CREATE TABLE public.email_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    email_address character varying(255) NOT NULL,
    notification_type character varying(50) NOT NULL,
    problem_report_id uuid,
    sent_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'sent' NOT NULL,
    CONSTRAINT email_notifications_status_check CHECK (((status)::text = ANY ((ARRAY['sent'::character varying, 'failed'::character varying, 'pending'::character varying])::text[])))
);

-- Primary Key Constraints
ALTER TABLE ONLY public.ai_prompt_templates
    ADD CONSTRAINT ai_prompt_templates_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.problem_reports
    ADD CONSTRAINT problem_reports_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.email_notifications
    ADD CONSTRAINT email_notifications_pkey PRIMARY KEY (id);

-- Unique Constraints
ALTER TABLE ONLY public.ai_prompt_templates
    ADD CONSTRAINT ai_prompt_templates_name_version_key UNIQUE (name, version);

-- Foreign Key Constraints
ALTER TABLE ONLY public.problem_reports
    ADD CONSTRAINT problem_reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.problem_reports
    ADD CONSTRAINT problem_reports_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.problem_reports
    ADD CONSTRAINT problem_reports_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.email_notifications
    ADD CONSTRAINT email_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.email_notifications
    ADD CONSTRAINT email_notifications_problem_report_id_fkey FOREIGN KEY (problem_report_id) REFERENCES public.problem_reports(id) ON DELETE CASCADE;

-- Indexes for better performance
CREATE INDEX idx_problem_reports_status ON public.problem_reports USING btree (status);
CREATE INDEX idx_problem_reports_created_at ON public.problem_reports USING btree (created_at DESC);
CREATE INDEX idx_problem_reports_user_id ON public.problem_reports USING btree (user_id);
CREATE INDEX idx_problem_reports_exercise_id ON public.problem_reports USING btree (exercise_id);
CREATE INDEX idx_ai_prompt_templates_name_active ON public.ai_prompt_templates USING btree (name, is_active);
CREATE INDEX idx_email_notifications_sent_at ON public.email_notifications USING btree (sent_at DESC);

-- Insert the optimized AI prompt template
INSERT INTO public.ai_prompt_templates (name, version, system_prompt, user_template, is_active) VALUES (
    'exercise_validator',
    1,
    'You are an expert teacher of European Portuguese language education. Please review the following exercise problem report and provide your professional assessment.

VALIDATION CRITERIA - Use these requirements to assess if the reported issue is valid:

### 1. Correct Answers:
- Must be grammatically correct for the given level
- Should focus on the specific topic''s grammar point
- Use appropriate verb forms, pronouns, prepositions, etc.

### 2. Hints:
- Keep hints in Portuguese
- Each hint should contain minimum necessary information to solve the exercise. For example, if the gap should contain a verb and it is not clear from the rest of the sentence which verb that is - the hint should contain the infinitive form of the appropriate verb. If it''s unambiguously clear which verb is expected the hint shall not contain the verb infinitive
- If the sentence contains clear subject indicators (like "todos", "alguém", "a equipa", "os alunos", "as pessoas", specific names, or definite subject nouns), don''t include person information in the hint even if there''s no explicit pronoun.
- Only add person information when the subject is truly ambiguous or missing entirely from the sentence.
- If the sentence indirectly tells about in which person the verb is to be used, make sure the hint doesn''t contain the person. Only if it''s impossible to understand the person to be used from the sentence context - add the person info to the hint.
- The format of the hint for verbs: "infinitive" or "infinitive (person)" or "infinitive (tense/person)" e.g., "fazer", "fazer (2a pessoa singular)" etc. Avoid mentioning the tense, only add it to the hint if it''s absolutely necessary to make solving the task feasible and the sentence doesn''t give any indirect data to make the conclusion on what tense shall be used.
- The format of the hint for comparisons: "option1 / option2" e.g., "poder / conseguir"  
- The format of the hint for other topics: brief contextual hint e.g., "preposição contraída"
- If the hint makes it too easy to solve the task, don''t add it. For example, the exercise is "Vou _____ cinema com os meus amigos.". For such exercise don''t put any hint because it is clear that it should have a preposition for the verb vou - ''a'' and the article for the word "cinema" - ''o''. The correct answer is obviously ''a''+''o'' = ''ao''. In such case leave the hint empty.

### 3. Multiple Choice Options:
- Always include exactly 4 options except for cases when it is impossible to offer enough somehow plausible distractors
- One of the options should be the correct answer. The correct option must not be always coming first. Shuffle the correct option''s position so that it''s sometimes 1st, sometimes 2nd, sometimes 3rd and sometimes 4th.
- Create 3 plausible distractors that test common mistakes:
  - Wrong verb form/tense
  - Confusion with similar words
  - Common grammatical errors
- All options should be the same part of speech and fit grammatically

### 4. Explanations:
- Clear grammar explanation for the student learning Portuguese  
- Each explanation should be 2-4 sentences long
- Focus on the specific grammar point of that topic

TASK:
Please analyze this problem report against the above validation criteria and determine:
1. Is the reported issue valid and requires correction?
2. If YES, provide the exact SQL statement(s) to fix the issue
3. If NO, provide a brief explanation why the report is not valid

Please format your response as JSON:
{
  "is_valid": boolean,
  "explanation": "Your professional assessment",
  "sql_correction": "SQL statement(s) if correction needed, null otherwise"
}',
    'CONTEXT:
- Exercise Level: {level}
- Topic: {topic}
- Exercise Type: sentence with a gap, the user needs to fill the gap with the correct word

EXERCISE DETAILS:
- Sentence: {sentence}
- Hint (if provided): {hint}
- Multiple Choice Options (if applicable): {options}
- Correct Answer: {correct_answer}
- Answer Explanation: {explanation}

PROBLEM REPORT:
- Reported Issue Type: {problem_type}
- User''s Comment: {user_comment}

DATABASE STRUCTURE:
The exercise is stored in the following table structure:
{database_schema}',
    true
);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_ai_prompt_templates_updated_at 
    BEFORE UPDATE ON public.ai_prompt_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

SELECT 'Problem Report System Migration complete: Tables created successfully' as status;