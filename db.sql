-- Script para criação do banco de dados MonitorIA

CREATE TABLE public.app_user (
    id serial PRIMARY KEY,
    username text UNIQUE NOT NULL,
    email text UNIQUE NOT NULL,
    password text NOT NULL,
    role text NOT NULL DEFAULT 'aluno', -- Valores: 'aluno', 'monitor', 'professor', 'admin'
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.topic (
    id serial PRIMARY KEY,
    name text NOT NULL,
    parent_id integer REFERENCES public.topic(id), -- Hierarquia de tópicos
    description text
);

CREATE TABLE public.question (
    id serial PRIMARY KEY,
    user_id integer REFERENCES public.app_user(id) NOT NULL,
    topic_id integer REFERENCES public.topic(id) NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    is_resolved boolean DEFAULT false NOT NULL
);

CREATE INDEX idx_question_topic_id ON public.question (topic_id);
CREATE INDEX idx_question_title ON public.question USING gin (to_tsvector('portuguese', title));

CREATE TABLE public.answer (
    id serial PRIMARY KEY,
    question_id integer REFERENCES public.question(id) NOT NULL,
    user_id integer REFERENCES public.app_user(id), -- Pode ser NULL para a sugestão da IA
    body text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    is_best_answer boolean DEFAULT false NOT NULL,
    is_ai_suggestion boolean DEFAULT false NOT NULL
);

CREATE TABLE public.vote (
    id serial PRIMARY KEY,
    user_id integer REFERENCES public.app_user(id) NOT NULL,
    target_type text NOT NULL, -- 'question' ou 'answer'
    target_id integer NOT NULL,
    vote_type smallint NOT NULL, -- 1 (Upvote) ou -1 (Downvote)
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    
    UNIQUE (user_id, target_type, target_id),
    CHECK (target_type IN ('question', 'answer'))
);