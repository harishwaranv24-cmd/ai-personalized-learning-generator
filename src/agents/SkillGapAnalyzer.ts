import type { SkillGapAnalysis, Employee, Skill, SkillRequirement, EmployeeSkill } from '../lib/database.types';
import { supabase } from '../lib/supabase';

export interface SkillGap {
  skill: Skill;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  importance: string;
  explanation: string;
  visualWeight: number;
  estimatedWeeks: number;
}

export interface SkillDNAMap {
  technical: SkillGap[];
  soft: SkillGap[];
  domain: SkillGap[];
  overallScore: number;
  readinessLevel: string;
  topPriorities: SkillGap[];
}

export class SkillGapAnalyzer {
  static async analyzeGaps(employeeId: string): Promise<SkillDNAMap> {
    const { data: employee } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .single();

    if (!employee) throw new Error('Employee not found');

    const { data: requirements } = await supabase
      .from('skill_requirements')
      .select('*, skills(*)')
      .eq('role_name', employee.job_role);

    const { data: currentSkills } = await supabase
      .from('employee_skills')
      .select('*, skills(*)')
      .eq('employee_id', employeeId);

    const gaps = await this.computeGaps(
      employee,
      requirements || [],
      currentSkills || []
    );

    await this.persistGaps(employeeId, gaps);

    return this.buildDNAMap(gaps);
  }

  private static async computeGaps(
    employee: Employee,
    requirements: any[],
    currentSkills: any[]
  ): Promise<SkillGap[]> {
    const skillMap = new Map(
      currentSkills.map(cs => [cs.skill_id, cs.current_level])
    );

    const gaps: SkillGap[] = [];

    for (const req of requirements) {
      const currentLevel = skillMap.get(req.skill_id) || 0;
      const requiredLevel = req.required_level;
      const gap = requiredLevel - currentLevel;

      if (gap <= 0) continue;

      const severity = this.calculateSeverity(gap, req.importance);
      const explanation = this.generateExplanation(
        req.skills.name,
        currentLevel,
        requiredLevel,
        req.importance,
        employee.job_role
      );

      gaps.push({
        skill: req.skills,
        currentLevel,
        requiredLevel,
        gap,
        severity,
        importance: req.importance,
        explanation,
        visualWeight: this.calculateVisualWeight(gap, req.importance),
        estimatedWeeks: this.estimateTimeToClose(gap, currentLevel),
      });
    }

    return gaps.sort((a, b) => b.visualWeight - a.visualWeight);
  }

  private static calculateSeverity(
    gap: number,
    importance: string
  ): 'critical' | 'high' | 'moderate' | 'low' {
    if (importance === 'critical' && gap >= 2) return 'critical';
    if (importance === 'critical' || (importance === 'high' && gap >= 3)) return 'high';
    if (gap >= 2 || importance === 'high') return 'moderate';
    return 'low';
  }

  private static generateExplanation(
    skillName: string,
    current: number,
    required: number,
    importance: string,
    role: string
  ): string {
    const gap = required - current;
    const levelDesc = this.getLevelDescription(current);
    const targetDesc = this.getLevelDescription(required);

    if (importance === 'critical') {
      return `${skillName} is critical for ${role}. You're at ${levelDesc} but need ${targetDesc}. This ${gap}-level gap requires immediate attention for role success.`;
    }

    if (importance === 'high') {
      return `${skillName} is highly valued for ${role}. Advancing from ${levelDesc} to ${targetDesc} will significantly boost your effectiveness.`;
    }

    return `Improving ${skillName} from ${levelDesc} to ${targetDesc} will enhance your ${role} capabilities and open new opportunities.`;
  }

  private static getLevelDescription(level: number): string {
    const descriptions = [
      'no experience',
      'beginner level',
      'intermediate level',
      'advanced level',
      'expert level',
      'mastery level',
    ];
    return descriptions[level] || 'unknown level';
  }

  private static calculateVisualWeight(gap: number, importance: string): number {
    const importanceWeight = {
      critical: 100,
      high: 75,
      medium: 50,
      low: 25,
    }[importance] || 50;

    return gap * 20 + importanceWeight;
  }

  private static estimateTimeToClose(gap: number, currentLevel: number): number {
    const baseWeeks = gap * 3;
    const experienceMultiplier = currentLevel === 0 ? 1.5 : 1.0;
    return Math.ceil(baseWeeks * experienceMultiplier);
  }

  private static async persistGaps(
    employeeId: string,
    gaps: SkillGap[]
  ): Promise<void> {
    const inserts = gaps.map(gap => ({
      employee_id: employeeId,
      skill_id: gap.skill.id,
      current_level: gap.currentLevel,
      required_level: gap.requiredLevel,
      gap_severity: gap.severity,
      importance_score: gap.visualWeight,
      explanation: gap.explanation,
      recommended_modules: [],
      estimated_weeks: gap.estimatedWeeks,
    }));

    await supabase
      .from('skill_gap_analysis')
      .upsert(inserts, {
        onConflict: 'employee_id,skill_id',
      });
  }

  private static buildDNAMap(gaps: SkillGap[]): SkillDNAMap {
    const technical = gaps.filter(g => g.skill.category === 'technical');
    const soft = gaps.filter(g => g.skill.category === 'soft');
    const domain = gaps.filter(g => g.skill.category === 'domain');

    const totalWeight = gaps.reduce((sum, g) => sum + g.visualWeight, 0);
    const maxPossibleWeight = gaps.length * 120;
    const overallScore = maxPossibleWeight > 0
      ? Math.round(((maxPossibleWeight - totalWeight) / maxPossibleWeight) * 100)
      : 100;

    const readinessLevel =
      overallScore >= 80 ? 'Excellent - Ready for growth' :
      overallScore >= 60 ? 'Good - Some gaps to address' :
      overallScore >= 40 ? 'Developing - Focus needed' :
      'Building - Significant development required';

    const topPriorities = gaps
      .filter(g => g.severity === 'critical' || g.severity === 'high')
      .slice(0, 5);

    return {
      technical,
      soft,
      domain,
      overallScore,
      readinessLevel,
      topPriorities,
    };
  }

  static async getStoredAnalysis(employeeId: string): Promise<SkillDNAMap | null> {
    const { data: gaps } = await supabase
      .from('skill_gap_analysis')
      .select('*, skills(*)')
      .eq('employee_id', employeeId);

    if (!gaps || gaps.length === 0) return null;

    const skillGaps: SkillGap[] = gaps.map(g => ({
      skill: g.skills as Skill,
      currentLevel: g.current_level,
      requiredLevel: g.required_level,
      gap: g.required_level - g.current_level,
      severity: g.gap_severity as any,
      importance: 'high',
      explanation: g.explanation || '',
      visualWeight: g.importance_score,
      estimatedWeeks: g.estimated_weeks || 0,
    }));

    return this.buildDNAMap(skillGaps);
  }
}
