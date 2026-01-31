/*
  # AI Learning Experience Architect - Complete Schema

  ## Overview
  This migration creates the complete database schema for an adaptive, multi-agent learning system
  that personalizes employee training through skill gap analysis, intelligent content recommendation,
  and continuous feedback-driven adaptation.

  ## New Tables

  ### 1. employees
  Stores comprehensive employee profiles with career context
  - `id` (uuid, primary key)
  - `email` (text, unique) - Employee email address
  - `full_name` (text) - Full name
  - `job_role` (text) - Current job title
  - `department` (text) - Department/team
  - `experience_level` (text) - junior, mid, senior, expert
  - `career_goals` (jsonb) - Array of career objectives
  - `learning_preferences` (jsonb) - Style preferences (visual, hands-on, reading, etc.)
  - `weekly_learning_hours` (integer) - Available hours per week
  - `motivation_drivers` (jsonb) - What motivates this learner
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. skills
  Master catalog of skills with categorization
  - `id` (uuid, primary key)
  - `name` (text, unique) - Skill name
  - `category` (text) - technical, soft, leadership, domain
  - `subcategory` (text) - More specific grouping
  - `description` (text) - What this skill entails
  - `level_definitions` (jsonb) - Definitions for levels 1-5
  - `created_at` (timestamptz)

  ### 3. employee_skills
  Current skill proficiency levels for each employee
  - `id` (uuid, primary key)
  - `employee_id` (uuid, foreign key)
  - `skill_id` (uuid, foreign key)
  - `current_level` (integer) - 0-5 scale
  - `target_level` (integer) - Desired proficiency
  - `self_assessed` (boolean) - Whether self-reported
  - `last_assessed` (timestamptz)
  - `created_at` (timestamptz)

  ### 4. skill_requirements
  Required skills for roles and career paths
  - `id` (uuid, primary key)
  - `role_name` (text) - Job role this applies to
  - `skill_id` (uuid, foreign key)
  - `required_level` (integer) - Minimum level needed
  - `importance` (text) - critical, high, medium, low
  - `created_at` (timestamptz)

  ### 5. learning_modules
  Content library with rich metadata
  - `id` (uuid, primary key)
  - `title` (text) - Module title
  - `description` (text) - What learners will gain
  - `content_type` (text) - video, article, interactive, exercise, project
  - `skill_id` (uuid, foreign key) - Primary skill taught
  - `difficulty_level` (integer) - 1-5 scale
  - `estimated_minutes` (integer) - Time to complete
  - `learning_style_fit` (jsonb) - Which styles this suits
  - `prerequisites` (jsonb) - Required prior modules/skills
  - `practical_application` (text) - Real-world use case
  - `content_url` (text) - Link to actual content
  - `created_at` (timestamptz)

  ### 6. learning_paths
  Personalized learning journeys for employees
  - `id` (uuid, primary key)
  - `employee_id` (uuid, foreign key)
  - `name` (text) - Path name/goal
  - `status` (text) - active, paused, completed
  - `modules_sequence` (jsonb) - Ordered array of module IDs with scheduling
  - `start_date` (date)
  - `target_completion_date` (date)
  - `reasoning` (text) - Why this path was designed this way
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 7. learning_progress
  Track completion and performance for each module
  - `id` (uuid, primary key)
  - `employee_id` (uuid, foreign key)
  - `module_id` (uuid, foreign key)
  - `status` (text) - not_started, in_progress, completed
  - `completion_percentage` (integer) - 0-100
  - `performance_score` (integer) - 0-100 if applicable
  - `time_spent_minutes` (integer) - Actual time invested
  - `started_at` (timestamptz)
  - `completed_at` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 8. feedback_signals
  Capture user interactions for adaptive learning
  - `id` (uuid, primary key)
  - `employee_id` (uuid, foreign key)
  - `module_id` (uuid, foreign key)
  - `signal_type` (text) - completion, rating, time_spent, struggle, skip
  - `signal_value` (jsonb) - Structured feedback data
  - `satisfaction_score` (integer) - 1-5 if rated
  - `comments` (text) - Optional user feedback
  - `timestamp` (timestamptz)

  ### 9. skill_gap_analysis
  Computed skill gaps with reasoning
  - `id` (uuid, primary key)
  - `employee_id` (uuid, foreign key)
  - `skill_id` (uuid, foreign key)
  - `current_level` (integer)
  - `required_level` (integer)
  - `gap_severity` (text) - critical, high, moderate, low
  - `importance_score` (integer) - 0-100
  - `explanation` (text) - Human-readable gap description
  - `recommended_modules` (jsonb) - Array of module IDs
  - `estimated_weeks` (integer) - Time to close gap
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 10. adaptation_logs
  Track how the system adapts based on feedback
  - `id` (uuid, primary key)
  - `employee_id` (uuid, foreign key)
  - `adaptation_type` (text) - difficulty_adjust, pace_change, content_swap
  - `trigger_signals` (jsonb) - What caused this adaptation
  - `action_taken` (text) - What changed
  - `reasoning` (text) - Why this change was made
  - `timestamp` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Employees can view their own data
  - Managers can view their team's data (future enhancement)
  - Admins have full access

  ## Indexes
  - Created for common query patterns to optimize performance
*/

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  job_role text NOT NULL,
  department text,
  experience_level text NOT NULL DEFAULT 'mid',
  career_goals jsonb DEFAULT '[]'::jsonb,
  learning_preferences jsonb DEFAULT '{}'::jsonb,
  weekly_learning_hours integer DEFAULT 5,
  motivation_drivers jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text NOT NULL,
  subcategory text,
  description text,
  level_definitions jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create employee_skills table
CREATE TABLE IF NOT EXISTS employee_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  current_level integer NOT NULL DEFAULT 0 CHECK (current_level >= 0 AND current_level <= 5),
  target_level integer CHECK (target_level >= 0 AND target_level <= 5),
  self_assessed boolean DEFAULT true,
  last_assessed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, skill_id)
);

-- Create skill_requirements table
CREATE TABLE IF NOT EXISTS skill_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name text NOT NULL,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  required_level integer NOT NULL CHECK (required_level >= 0 AND required_level <= 5),
  importance text NOT NULL DEFAULT 'medium',
  created_at timestamptz DEFAULT now(),
  UNIQUE(role_name, skill_id)
);

-- Create learning_modules table
CREATE TABLE IF NOT EXISTS learning_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  content_type text NOT NULL,
  skill_id uuid REFERENCES skills(id) ON DELETE SET NULL,
  difficulty_level integer NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  estimated_minutes integer NOT NULL,
  learning_style_fit jsonb DEFAULT '[]'::jsonb,
  prerequisites jsonb DEFAULT '[]'::jsonb,
  practical_application text,
  content_url text,
  created_at timestamptz DEFAULT now()
);

-- Create learning_paths table
CREATE TABLE IF NOT EXISTS learning_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  modules_sequence jsonb DEFAULT '[]'::jsonb,
  start_date date DEFAULT CURRENT_DATE,
  target_completion_date date,
  reasoning text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create learning_progress table
CREATE TABLE IF NOT EXISTS learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  module_id uuid REFERENCES learning_modules(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_started',
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  performance_score integer CHECK (performance_score >= 0 AND performance_score <= 100),
  time_spent_minutes integer DEFAULT 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, module_id)
);

-- Create feedback_signals table
CREATE TABLE IF NOT EXISTS feedback_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  module_id uuid REFERENCES learning_modules(id) ON DELETE CASCADE,
  signal_type text NOT NULL,
  signal_value jsonb DEFAULT '{}'::jsonb,
  satisfaction_score integer CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5),
  comments text,
  timestamp timestamptz DEFAULT now()
);

-- Create skill_gap_analysis table
CREATE TABLE IF NOT EXISTS skill_gap_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  current_level integer NOT NULL,
  required_level integer NOT NULL,
  gap_severity text NOT NULL,
  importance_score integer NOT NULL CHECK (importance_score >= 0 AND importance_score <= 100),
  explanation text,
  recommended_modules jsonb DEFAULT '[]'::jsonb,
  estimated_weeks integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, skill_id)
);

-- Create adaptation_logs table
CREATE TABLE IF NOT EXISTS adaptation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  adaptation_type text NOT NULL,
  trigger_signals jsonb DEFAULT '[]'::jsonb,
  action_taken text NOT NULL,
  reasoning text,
  timestamp timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_employee_skills_employee ON employee_skills(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_skills_skill ON employee_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_requirements_role ON skill_requirements(role_name);
CREATE INDEX IF NOT EXISTS idx_learning_modules_skill ON learning_modules(skill_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_employee ON learning_paths(employee_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_employee ON learning_progress(employee_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_module ON learning_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_feedback_signals_employee ON feedback_signals(employee_id);
CREATE INDEX IF NOT EXISTS idx_skill_gap_analysis_employee ON skill_gap_analysis(employee_id);
CREATE INDEX IF NOT EXISTS idx_adaptation_logs_employee ON adaptation_logs(employee_id);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_gap_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptation_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for reference tables
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employees
CREATE POLICY "Employees can view own profile"
  ON employees FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Employees can update own profile"
  ON employees FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- RLS Policies for employee_skills
CREATE POLICY "Employees can view own skills"
  ON employee_skills FOR SELECT
  TO authenticated
  USING (auth.uid()::text = employee_id::text);

CREATE POLICY "Employees can manage own skills"
  ON employee_skills FOR ALL
  TO authenticated
  USING (auth.uid()::text = employee_id::text)
  WITH CHECK (auth.uid()::text = employee_id::text);

-- RLS Policies for learning_paths
CREATE POLICY "Employees can view own learning paths"
  ON learning_paths FOR SELECT
  TO authenticated
  USING (auth.uid()::text = employee_id::text);

CREATE POLICY "Employees can manage own learning paths"
  ON learning_paths FOR ALL
  TO authenticated
  USING (auth.uid()::text = employee_id::text)
  WITH CHECK (auth.uid()::text = employee_id::text);

-- RLS Policies for learning_progress
CREATE POLICY "Employees can view own progress"
  ON learning_progress FOR SELECT
  TO authenticated
  USING (auth.uid()::text = employee_id::text);

CREATE POLICY "Employees can update own progress"
  ON learning_progress FOR ALL
  TO authenticated
  USING (auth.uid()::text = employee_id::text)
  WITH CHECK (auth.uid()::text = employee_id::text);

-- RLS Policies for feedback_signals
CREATE POLICY "Employees can view own feedback"
  ON feedback_signals FOR SELECT
  TO authenticated
  USING (auth.uid()::text = employee_id::text);

CREATE POLICY "Employees can submit feedback"
  ON feedback_signals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = employee_id::text);

-- RLS Policies for skill_gap_analysis
CREATE POLICY "Employees can view own skill gaps"
  ON skill_gap_analysis FOR SELECT
  TO authenticated
  USING (auth.uid()::text = employee_id::text);

CREATE POLICY "Employees can manage own skill gaps"
  ON skill_gap_analysis FOR ALL
  TO authenticated
  USING (auth.uid()::text = employee_id::text)
  WITH CHECK (auth.uid()::text = employee_id::text);

-- RLS Policies for adaptation_logs
CREATE POLICY "Employees can view own adaptation logs"
  ON adaptation_logs FOR SELECT
  TO authenticated
  USING (auth.uid()::text = employee_id::text);

-- Public read for reference data
CREATE POLICY "Anyone can view skills"
  ON skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view skill requirements"
  ON skill_requirements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view learning modules"
  ON learning_modules FOR SELECT
  TO authenticated
  USING (true);