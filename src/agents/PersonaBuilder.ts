import type { Employee, Skill, EmployeeSkill } from '../lib/database.types';
import { supabase } from '../lib/supabase';

export interface PersonaInput {
  email: string;
  full_name: string;
  job_role: string;
  department?: string;
  experience_level: 'junior' | 'mid' | 'senior' | 'expert';
  career_goals?: string[];
  learning_preferences?: {
    styles: ('visual' | 'hands-on' | 'reading' | 'auditory')[];
    pace: 'fast' | 'moderate' | 'slow';
  };
  weekly_learning_hours?: number;
  current_skills?: { skill_name: string; level: number }[];
}

export interface EnrichedPersona extends Employee {
  inferredMotivations: string[];
  skillProfile: EmployeeSkill[];
  personaInsights: {
    learningCapacity: string;
    preferredContentTypes: string[];
    careerTrajectory: string;
    engagementPrediction: 'high' | 'medium' | 'low';
  };
}

export class PersonaBuilder {
  static async buildPersona(input: PersonaInput): Promise<EnrichedPersona> {
    const normalizedGoals = this.normalizeCareerGoals(input.career_goals || []);
    const motivations = this.inferMotivations(input);
    const learningPrefs = this.normalizeLearningPreferences(input);

    const { data: employee, error: empError } = await supabase
      .from('employees')
      .insert({
        email: input.email,
        full_name: input.full_name,
        job_role: input.job_role,
        department: input.department || null,
        experience_level: input.experience_level,
        career_goals: normalizedGoals,
        learning_preferences: learningPrefs,
        weekly_learning_hours: input.weekly_learning_hours || 5,
        motivation_drivers: motivations,
      })
      .select()
      .single();

    if (empError) throw empError;

    const skillProfile = await this.createSkillProfile(
      employee.id,
      input.current_skills || []
    );

    const insights = this.generateInsights(employee, skillProfile);

    return {
      ...employee,
      inferredMotivations: motivations,
      skillProfile,
      personaInsights: insights,
    };
  }

  private static normalizeCareerGoals(goals: string[]): any {
    const normalized = goals.map(goal => ({
      goal: goal.trim(),
      priority: 'high',
      timeframe: this.inferTimeframe(goal),
    }));
    return normalized;
  }

  private static inferTimeframe(goal: string): string {
    const lowerGoal = goal.toLowerCase();
    if (lowerGoal.includes('senior') || lowerGoal.includes('lead')) {
      return '2-3 years';
    }
    if (lowerGoal.includes('expert') || lowerGoal.includes('architect')) {
      return '3-5 years';
    }
    return '1-2 years';
  }

  private static inferMotivations(input: PersonaInput): string[] {
    const motivations: string[] = [];

    if (input.career_goals && input.career_goals.length > 0) {
      motivations.push('Career advancement');
    }

    if (input.experience_level === 'junior') {
      motivations.push('Skill building', 'Confidence growth');
    } else if (input.experience_level === 'senior' || input.experience_level === 'expert') {
      motivations.push('Mastery', 'Thought leadership');
    }

    if (input.weekly_learning_hours && input.weekly_learning_hours > 7) {
      motivations.push('High achiever', 'Self-improvement');
    }

    return motivations;
  }

  private static normalizeLearningPreferences(input: PersonaInput): any {
    const prefs = input.learning_preferences || { styles: ['hands-on'], pace: 'moderate' };
    return {
      styles: prefs.styles,
      pace: prefs.pace,
      sessionLength: this.recommendSessionLength(input.weekly_learning_hours || 5),
      bestTimeOfDay: 'flexible',
    };
  }

  private static recommendSessionLength(weeklyHours: number): string {
    if (weeklyHours <= 3) return '20-30 minutes';
    if (weeklyHours <= 6) return '30-45 minutes';
    return '45-60 minutes';
  }

  private static async createSkillProfile(
    employeeId: string,
    currentSkills: { skill_name: string; level: number }[]
  ): Promise<EmployeeSkill[]> {
    if (currentSkills.length === 0) return [];

    const { data: allSkills } = await supabase
      .from('skills')
      .select('id, name');

    if (!allSkills) return [];

    const skillMap = new Map(allSkills.map(s => [s.name.toLowerCase(), s.id]));

    const skillInserts = currentSkills
      .map(cs => ({
        employee_id: employeeId,
        skill_id: skillMap.get(cs.skill_name.toLowerCase()),
        current_level: cs.level,
        target_level: null,
        self_assessed: true,
        last_assessed: new Date().toISOString(),
      }))
      .filter(s => s.skill_id);

    if (skillInserts.length === 0) return [];

    const { data: employeeSkills } = await supabase
      .from('employee_skills')
      .insert(skillInserts)
      .select();

    return employeeSkills || [];
  }

  private static generateInsights(
    employee: Employee,
    skillProfile: EmployeeSkill[]
  ): EnrichedPersona['personaInsights'] {
    const weeklyHours = employee.weekly_learning_hours;
    const learningCapacity =
      weeklyHours <= 3 ? 'Limited availability - microlearning focus' :
      weeklyHours <= 6 ? 'Moderate capacity - balanced approach' :
      'High capacity - immersive learning possible';

    const prefs = employee.learning_preferences as any;
    const styles = prefs?.styles || ['hands-on'];
    const contentTypes = styles.map((s: string) => {
      switch(s) {
        case 'visual': return 'Videos and diagrams';
        case 'hands-on': return 'Interactive exercises and projects';
        case 'reading': return 'Articles and documentation';
        case 'auditory': return 'Podcasts and talks';
        default: return 'Mixed content';
      }
    });

    const careerGoals = employee.career_goals as any;
    const hasGoals = Array.isArray(careerGoals) && careerGoals.length > 0;
    const careerTrajectory = hasGoals
      ? `Targeting: ${careerGoals[0].goal}`
      : 'Focus on current role excellence';

    const engagementPrediction: 'high' | 'medium' | 'low' =
      (weeklyHours >= 5 && hasGoals) ? 'high' :
      (weeklyHours >= 3) ? 'medium' : 'low';

    return {
      learningCapacity,
      preferredContentTypes: contentTypes,
      careerTrajectory,
      engagementPrediction,
    };
  }

  static async getPersona(employeeId: string): Promise<EnrichedPersona | null> {
    const { data: employee } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .maybeSingle();

    if (!employee) return null;

    const { data: skillProfile } = await supabase
      .from('employee_skills')
      .select('*')
      .eq('employee_id', employeeId);

    const insights = this.generateInsights(employee, skillProfile || []);

    return {
      ...employee,
      inferredMotivations: employee.motivation_drivers as string[],
      skillProfile: skillProfile || [],
      personaInsights: insights,
    };
  }
}
