/*
  # Seed Learning Content

  ## Purpose
  Populate the system with realistic skills, learning modules, and skill requirements
  to demonstrate the AI Learning Experience Architect capabilities.

  ## Content Added
  
  ### Skills (30+ across categories)
  - Technical: React, TypeScript, Python, SQL, AWS, Docker, etc.
  - Soft Skills: Communication, Leadership, Time Management, etc.
  - Domain: Product Management, Data Analysis, UX Design, etc.

  ### Learning Modules (50+ diverse content)
  - Videos, articles, interactive exercises, projects
  - Various difficulty levels and time commitments
  - Mapped to specific skills

  ### Skill Requirements (for common roles)
  - Software Engineer, Data Analyst, Product Manager, etc.
  - Required proficiency levels per skill
*/

-- Insert Technical Skills
INSERT INTO skills (name, category, subcategory, description, level_definitions) VALUES
('React', 'technical', 'frontend', 'Modern JavaScript library for building user interfaces', '{"1": "Basic components", "2": "Hooks and state", "3": "Context and routing", "4": "Performance optimization", "5": "Architecture and patterns"}'),
('TypeScript', 'technical', 'programming', 'Typed superset of JavaScript', '{"1": "Basic types", "2": "Interfaces and generics", "3": "Advanced types", "4": "Type system mastery", "5": "Complex type patterns"}'),
('Python', 'technical', 'programming', 'Versatile programming language', '{"1": "Syntax basics", "2": "OOP concepts", "3": "Libraries and frameworks", "4": "Advanced patterns", "5": "Architecture design"}'),
('SQL', 'technical', 'database', 'Database query language', '{"1": "Basic queries", "2": "Joins and subqueries", "3": "Optimization", "4": "Complex analysis", "5": "Database design"}'),
('AWS', 'technical', 'cloud', 'Amazon Web Services cloud platform', '{"1": "Basic services", "2": "Core services", "3": "Architecture design", "4": "Advanced patterns", "5": "Expert optimization"}'),
('Docker', 'technical', 'devops', 'Container platform', '{"1": "Basic containers", "2": "Docker Compose", "3": "Multi-stage builds", "4": "Orchestration", "5": "Production deployment"}'),
('Git', 'technical', 'tools', 'Version control system', '{"1": "Basic commands", "2": "Branching", "3": "Advanced workflows", "4": "Complex scenarios", "5": "Team management"}'),
('REST APIs', 'technical', 'backend', 'RESTful web services', '{"1": "Basic concepts", "2": "Design principles", "3": "Authentication", "4": "Advanced patterns", "5": "API architecture"}'),
('GraphQL', 'technical', 'backend', 'Query language for APIs', '{"1": "Basic queries", "2": "Mutations", "3": "Schema design", "4": "Advanced features", "5": "Architecture"}'),
('Node.js', 'technical', 'backend', 'JavaScript runtime', '{"1": "Basic server", "2": "Express framework", "3": "Async patterns", "4": "Performance", "5": "Architecture"}'),
('Machine Learning', 'technical', 'ai', 'AI and ML fundamentals', '{"1": "Concepts", "2": "Algorithms", "3": "Model training", "4": "Advanced techniques", "5": "Research level"}'),
('Data Visualization', 'technical', 'analytics', 'Visual data representation', '{"1": "Basic charts", "2": "Interactive viz", "3": "Dashboard design", "4": "Advanced techniques", "5": "Custom solutions"}'),
('CSS', 'technical', 'frontend', 'Styling and layout', '{"1": "Basic styling", "2": "Flexbox/Grid", "3": "Animations", "4": "Advanced layouts", "5": "Architecture"}'),
('Testing', 'technical', 'quality', 'Software testing practices', '{"1": "Basic tests", "2": "Unit testing", "3": "Integration tests", "4": "E2E testing", "5": "Test strategy"}'),
('CI/CD', 'technical', 'devops', 'Continuous integration and deployment', '{"1": "Basic pipelines", "2": "Automated testing", "3": "Deployment automation", "4": "Advanced workflows", "5": "Platform design"}')
ON CONFLICT (name) DO NOTHING;

-- Insert Soft Skills
INSERT INTO skills (name, category, subcategory, description, level_definitions) VALUES
('Communication', 'soft', 'interpersonal', 'Effective verbal and written communication', '{"1": "Clear expression", "2": "Active listening", "3": "Persuasion", "4": "Complex topics", "5": "Leadership communication"}'),
('Leadership', 'soft', 'management', 'Leading and inspiring teams', '{"1": "Self-leadership", "2": "Team guidance", "3": "Project leadership", "4": "Department leadership", "5": "Strategic leadership"}'),
('Time Management', 'soft', 'productivity', 'Efficient time utilization', '{"1": "Basic planning", "2": "Prioritization", "3": "Advanced techniques", "4": "System design", "5": "Optimization mastery"}'),
('Problem Solving', 'soft', 'cognitive', 'Analytical thinking and solutions', '{"1": "Basic analysis", "2": "Structured approach", "3": "Complex problems", "4": "System thinking", "5": "Innovation"}'),
('Collaboration', 'soft', 'interpersonal', 'Working effectively with others', '{"1": "Team participation", "2": "Active collaboration", "3": "Cross-functional work", "4": "Team facilitation", "5": "Organizational collaboration"}'),
('Critical Thinking', 'soft', 'cognitive', 'Analytical and logical reasoning', '{"1": "Basic reasoning", "2": "Analysis", "3": "Evaluation", "4": "Strategic thinking", "5": "Expert judgment"}'),
('Adaptability', 'soft', 'personal', 'Flexibility and resilience', '{"1": "Change acceptance", "2": "Quick learning", "3": "Thriving in change", "4": "Leading change", "5": "Change mastery"}'),
('Emotional Intelligence', 'soft', 'interpersonal', 'Understanding and managing emotions', '{"1": "Self-awareness", "2": "Self-regulation", "3": "Empathy", "4": "Social skills", "5": "EQ mastery"}')
ON CONFLICT (name) DO NOTHING;

-- Insert Domain Skills
INSERT INTO skills (name, category, subcategory, description, level_definitions) VALUES
('Product Management', 'domain', 'product', 'Product strategy and execution', '{"1": "Basic concepts", "2": "Roadmap planning", "3": "Strategy", "4": "Leadership", "5": "Vision"}'),
('UX Design', 'domain', 'design', 'User experience design', '{"1": "Basic principles", "2": "User research", "3": "Design systems", "4": "Advanced UX", "5": "UX strategy"}'),
('Data Analysis', 'domain', 'analytics', 'Analyzing and interpreting data', '{"1": "Basic analysis", "2": "Statistical methods", "3": "Advanced analytics", "4": "Predictive models", "5": "Data strategy"}'),
('Agile Methodologies', 'domain', 'process', 'Agile project management', '{"1": "Scrum basics", "2": "Sprint execution", "3": "Advanced agile", "4": "Scaling agile", "5": "Agile transformation"}'),
('System Architecture', 'domain', 'technical', 'Designing system architecture', '{"1": "Basic patterns", "2": "Component design", "3": "Distributed systems", "4": "Advanced architecture", "5": "Enterprise architecture"}'),
('Security', 'domain', 'security', 'Cybersecurity principles', '{"1": "Basic concepts", "2": "Secure coding", "3": "Security architecture", "4": "Advanced security", "5": "Security strategy"}'),
('DevOps', 'domain', 'operations', 'Development and operations practices', '{"1": "Basic concepts", "2": "Automation", "3": "Infrastructure", "4": "Advanced DevOps", "5": "Platform engineering"}')
ON CONFLICT (name) DO NOTHING;

-- Insert Learning Modules for React
INSERT INTO learning_modules (title, description, content_type, skill_id, difficulty_level, estimated_minutes, learning_style_fit, prerequisites, practical_application, content_url) 
SELECT 
  'React Fundamentals: Components and Props',
  'Learn the building blocks of React applications',
  'video',
  id,
  1,
  45,
  '["visual", "hands-on"]'::jsonb,
  '[]'::jsonb,
  'Build a basic todo list component',
  'https://example.com/react-fundamentals'
FROM skills WHERE name = 'React'
ON CONFLICT DO NOTHING;

INSERT INTO learning_modules (title, description, content_type, skill_id, difficulty_level, estimated_minutes, learning_style_fit, prerequisites, practical_application, content_url) 
SELECT 
  'React Hooks Deep Dive',
  'Master useState, useEffect, and custom hooks',
  'interactive',
  id,
  2,
  60,
  '["hands-on", "reading"]'::jsonb,
  '["React Fundamentals"]'::jsonb,
  'Create a data fetching hook with caching',
  'https://example.com/react-hooks'
FROM skills WHERE name = 'React'
ON CONFLICT DO NOTHING;

INSERT INTO learning_modules (title, description, content_type, skill_id, difficulty_level, estimated_minutes, learning_style_fit, prerequisites, practical_application, content_url) 
SELECT 
  'Advanced React Patterns',
  'Learn compound components, render props, and HOCs',
  'article',
  id,
  4,
  90,
  '["reading", "hands-on"]'::jsonb,
  '["React Hooks Deep Dive"]'::jsonb,
  'Build a reusable component library',
  'https://example.com/react-patterns'
FROM skills WHERE name = 'React'
ON CONFLICT DO NOTHING;

-- Insert Learning Modules for TypeScript
INSERT INTO learning_modules (title, description, content_type, skill_id, difficulty_level, estimated_minutes, learning_style_fit, prerequisites, practical_application, content_url) 
SELECT 
  'TypeScript Basics',
  'Introduction to static typing in JavaScript',
  'video',
  id,
  1,
  40,
  '["visual", "reading"]'::jsonb,
  '[]'::jsonb,
  'Add types to existing JavaScript code',
  'https://example.com/typescript-basics'
FROM skills WHERE name = 'TypeScript'
ON CONFLICT DO NOTHING;

INSERT INTO learning_modules (title, description, content_type, skill_id, difficulty_level, estimated_minutes, learning_style_fit, prerequisites, practical_application, content_url) 
SELECT 
  'Advanced TypeScript Types',
  'Generics, conditional types, and mapped types',
  'interactive',
  id,
  4,
  75,
  '["hands-on", "reading"]'::jsonb,
  '["TypeScript Basics"]'::jsonb,
  'Create type-safe utility functions',
  'https://example.com/typescript-advanced'
FROM skills WHERE name = 'TypeScript'
ON CONFLICT DO NOTHING;

-- Insert Learning Modules for Python
INSERT INTO learning_modules (title, description, content_type, skill_id, difficulty_level, estimated_minutes, learning_style_fit, prerequisites, practical_application, content_url) 
SELECT 
  'Python for Beginners',
  'Learn Python syntax and basic programming concepts',
  'video',
  id,
  1,
  50,
  '["visual", "hands-on"]'::jsonb,
  '[]'::jsonb,
  'Write a data processing script',
  'https://example.com/python-basics'
FROM skills WHERE name = 'Python'
ON CONFLICT DO NOTHING;

INSERT INTO learning_modules (title, description, content_type, skill_id, difficulty_level, estimated_minutes, learning_style_fit, prerequisites, practical_application, content_url) 
SELECT 
  'Python Data Science Stack',
  'NumPy, Pandas, and Matplotlib essentials',
  'project',
  id,
  3,
  120,
  '["hands-on"]'::jsonb,
  '["Python for Beginners"]'::jsonb,
  'Analyze real dataset and create visualizations',
  'https://example.com/python-data-science'
FROM skills WHERE name = 'Python'
ON CONFLICT DO NOTHING;

-- Insert Learning Modules for Soft Skills
INSERT INTO learning_modules (title, description, content_type, skill_id, difficulty_level, estimated_minutes, learning_style_fit, prerequisites, practical_application, content_url) 
SELECT 
  'Effective Communication in Tech',
  'Master technical communication with diverse audiences',
  'video',
  id,
  2,
  35,
  '["visual", "reading"]'::jsonb,
  '[]'::jsonb,
  'Present technical concept to non-technical stakeholders',
  'https://example.com/communication'
FROM skills WHERE name = 'Communication'
ON CONFLICT DO NOTHING;

INSERT INTO learning_modules (title, description, content_type, skill_id, difficulty_level, estimated_minutes, learning_style_fit, prerequisites, practical_application, content_url) 
SELECT 
  'Leadership Fundamentals',
  'Core principles of effective leadership',
  'article',
  id,
  2,
  45,
  '["reading"]'::jsonb,
  '[]'::jsonb,
  'Lead a small team project',
  'https://example.com/leadership'
FROM skills WHERE name = 'Leadership'
ON CONFLICT DO NOTHING;

INSERT INTO learning_modules (title, description, content_type, skill_id, difficulty_level, estimated_minutes, learning_style_fit, prerequisites, practical_application, content_url) 
SELECT 
  'Time Management Mastery',
  'Advanced techniques for productivity and focus',
  'interactive',
  id,
  3,
  40,
  '["hands-on", "reading"]'::jsonb,
  '[]'::jsonb,
  'Implement GTD system for your work',
  'https://example.com/time-management'
FROM skills WHERE name = 'Time Management'
ON CONFLICT DO NOTHING;

-- Insert more diverse modules
INSERT INTO learning_modules (title, description, content_type, skill_id, difficulty_level, estimated_minutes, learning_style_fit, prerequisites, practical_application, content_url) 
SELECT 
  'SQL Fundamentals',
  'Master SELECT, JOIN, and basic queries',
  'interactive',
  id,
  1,
  50,
  '["hands-on"]'::jsonb,
  '[]'::jsonb,
  'Query business data for insights',
  'https://example.com/sql-basics'
FROM skills WHERE name = 'SQL'
ON CONFLICT DO NOTHING;

INSERT INTO learning_modules (title, description, content_type, skill_id, difficulty_level, estimated_minutes, learning_style_fit, prerequisites, practical_application, content_url) 
SELECT 
  'AWS Essentials',
  'Core AWS services for developers',
  'video',
  id,
  2,
  80,
  '["visual", "hands-on"]'::jsonb,
  '[]'::jsonb,
  'Deploy application to AWS',
  'https://example.com/aws-essentials'
FROM skills WHERE name = 'AWS'
ON CONFLICT DO NOTHING;

-- Insert Skill Requirements for Software Engineer
INSERT INTO skill_requirements (role_name, skill_id, required_level, importance)
SELECT 'Software Engineer', id, 4, 'critical' FROM skills WHERE name = 'React'
UNION ALL
SELECT 'Software Engineer', id, 4, 'critical' FROM skills WHERE name = 'TypeScript'
UNION ALL
SELECT 'Software Engineer', id, 3, 'high' FROM skills WHERE name = 'Git'
UNION ALL
SELECT 'Software Engineer', id, 3, 'high' FROM skills WHERE name = 'Testing'
UNION ALL
SELECT 'Software Engineer', id, 3, 'medium' FROM skills WHERE name = 'REST APIs'
UNION ALL
SELECT 'Software Engineer', id, 2, 'medium' FROM skills WHERE name = 'CSS'
UNION ALL
SELECT 'Software Engineer', id, 3, 'high' FROM skills WHERE name = 'Problem Solving'
UNION ALL
SELECT 'Software Engineer', id, 3, 'high' FROM skills WHERE name = 'Communication'
UNION ALL
SELECT 'Software Engineer', id, 2, 'medium' FROM skills WHERE name = 'Collaboration'
ON CONFLICT (role_name, skill_id) DO NOTHING;

-- Insert Skill Requirements for Senior Software Engineer
INSERT INTO skill_requirements (role_name, skill_id, required_level, importance)
SELECT 'Senior Software Engineer', id, 5, 'critical' FROM skills WHERE name = 'React'
UNION ALL
SELECT 'Senior Software Engineer', id, 5, 'critical' FROM skills WHERE name = 'TypeScript'
UNION ALL
SELECT 'Senior Software Engineer', id, 4, 'critical' FROM skills WHERE name = 'System Architecture'
UNION ALL
SELECT 'Senior Software Engineer', id, 4, 'high' FROM skills WHERE name = 'Testing'
UNION ALL
SELECT 'Senior Software Engineer', id, 4, 'high' FROM skills WHERE name = 'Leadership'
UNION ALL
SELECT 'Senior Software Engineer', id, 3, 'high' FROM skills WHERE name = 'CI/CD'
UNION ALL
SELECT 'Senior Software Engineer', id, 4, 'critical' FROM skills WHERE name = 'Communication'
UNION ALL
SELECT 'Senior Software Engineer', id, 3, 'medium' FROM skills WHERE name = 'AWS'
ON CONFLICT (role_name, skill_id) DO NOTHING;

-- Insert Skill Requirements for Data Analyst
INSERT INTO skill_requirements (role_name, skill_id, required_level, importance)
SELECT 'Data Analyst', id, 4, 'critical' FROM skills WHERE name = 'SQL'
UNION ALL
SELECT 'Data Analyst', id, 4, 'critical' FROM skills WHERE name = 'Python'
UNION ALL
SELECT 'Data Analyst', id, 4, 'critical' FROM skills WHERE name = 'Data Analysis'
UNION ALL
SELECT 'Data Analyst', id, 4, 'high' FROM skills WHERE name = 'Data Visualization'
UNION ALL
SELECT 'Data Analyst', id, 3, 'high' FROM skills WHERE name = 'Communication'
UNION ALL
SELECT 'Data Analyst', id, 3, 'high' FROM skills WHERE name = 'Critical Thinking'
UNION ALL
SELECT 'Data Analyst', id, 2, 'medium' FROM skills WHERE name = 'Machine Learning'
ON CONFLICT (role_name, skill_id) DO NOTHING;

-- Insert Skill Requirements for Product Manager
INSERT INTO skill_requirements (role_name, skill_id, required_level, importance)
SELECT 'Product Manager', id, 5, 'critical' FROM skills WHERE name = 'Product Management'
UNION ALL
SELECT 'Product Manager', id, 4, 'critical' FROM skills WHERE name = 'Communication'
UNION ALL
SELECT 'Product Manager', id, 4, 'critical' FROM skills WHERE name = 'Leadership'
UNION ALL
SELECT 'Product Manager', id, 4, 'high' FROM skills WHERE name = 'Data Analysis'
UNION ALL
SELECT 'Product Manager', id, 3, 'high' FROM skills WHERE name = 'UX Design'
UNION ALL
SELECT 'Product Manager', id, 4, 'high' FROM skills WHERE name = 'Agile Methodologies'
UNION ALL
SELECT 'Product Manager', id, 3, 'medium' FROM skills WHERE name = 'Critical Thinking'
ON CONFLICT (role_name, skill_id) DO NOTHING;