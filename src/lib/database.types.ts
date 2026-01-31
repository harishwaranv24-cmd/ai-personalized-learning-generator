export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          job_role: string;
          department: string | null;
          experience_level: string;
          career_goals: any;
          learning_preferences: any;
          weekly_learning_hours: number;
          motivation_drivers: any;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['employees']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['employees']['Insert']>;
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string;
          subcategory: string | null;
          description: string | null;
          level_definitions: any;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['skills']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['skills']['Insert']>;
      };
      employee_skills: {
        Row: {
          id: string;
          employee_id: string;
          skill_id: string;
          current_level: number;
          target_level: number | null;
          self_assessed: boolean;
          last_assessed: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['employee_skills']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['employee_skills']['Insert']>;
      };
      skill_requirements: {
        Row: {
          id: string;
          role_name: string;
          skill_id: string;
          required_level: number;
          importance: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['skill_requirements']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['skill_requirements']['Insert']>;
      };
      learning_modules: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          content_type: string;
          skill_id: string | null;
          difficulty_level: number;
          estimated_minutes: number;
          learning_style_fit: any;
          prerequisites: any;
          practical_application: string | null;
          content_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['learning_modules']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['learning_modules']['Insert']>;
      };
      learning_paths: {
        Row: {
          id: string;
          employee_id: string;
          name: string;
          status: string;
          modules_sequence: any;
          start_date: string;
          target_completion_date: string | null;
          reasoning: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['learning_paths']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['learning_paths']['Insert']>;
      };
      learning_progress: {
        Row: {
          id: string;
          employee_id: string;
          module_id: string;
          status: string;
          completion_percentage: number;
          performance_score: number | null;
          time_spent_minutes: number;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['learning_progress']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['learning_progress']['Insert']>;
      };
      feedback_signals: {
        Row: {
          id: string;
          employee_id: string;
          module_id: string;
          signal_type: string;
          signal_value: any;
          satisfaction_score: number | null;
          comments: string | null;
          timestamp: string;
        };
        Insert: Omit<Database['public']['Tables']['feedback_signals']['Row'], 'id' | 'timestamp'>;
        Update: Partial<Database['public']['Tables']['feedback_signals']['Insert']>;
      };
      skill_gap_analysis: {
        Row: {
          id: string;
          employee_id: string;
          skill_id: string;
          current_level: number;
          required_level: number;
          gap_severity: string;
          importance_score: number;
          explanation: string | null;
          recommended_modules: any;
          estimated_weeks: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['skill_gap_analysis']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['skill_gap_analysis']['Insert']>;
      };
      adaptation_logs: {
        Row: {
          id: string;
          employee_id: string;
          adaptation_type: string;
          trigger_signals: any;
          action_taken: string;
          reasoning: string | null;
          timestamp: string;
        };
        Insert: Omit<Database['public']['Tables']['adaptation_logs']['Row'], 'id' | 'timestamp'>;
        Update: Partial<Database['public']['Tables']['adaptation_logs']['Insert']>;
      };
    };
  };
}

export type Employee = Database['public']['Tables']['employees']['Row'];
export type Skill = Database['public']['Tables']['skills']['Row'];
export type EmployeeSkill = Database['public']['Tables']['employee_skills']['Row'];
export type SkillRequirement = Database['public']['Tables']['skill_requirements']['Row'];
export type LearningModule = Database['public']['Tables']['learning_modules']['Row'];
export type LearningPath = Database['public']['Tables']['learning_paths']['Row'];
export type LearningProgress = Database['public']['Tables']['learning_progress']['Row'];
export type FeedbackSignal = Database['public']['Tables']['feedback_signals']['Row'];
export type SkillGapAnalysis = Database['public']['Tables']['skill_gap_analysis']['Row'];
export type AdaptationLog = Database['public']['Tables']['adaptation_logs']['Row'];
