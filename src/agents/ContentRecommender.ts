import type { LearningModule, Employee, SkillGapAnalysis } from '../lib/database.types';
import { supabase } from '../lib/supabase';

export interface RecommendedModule extends LearningModule {
  recommendationScore: number;
  whyThis: string;
  fitReason: string;
  priorityLevel: 'urgent' | 'high' | 'medium' | 'low';
  sequenceOrder: number;
}

export interface RecommendationSet {
  forSkill: string;
  skillId: string;
  modules: RecommendedModule[];
  estimatedTotalMinutes: number;
  learningStrategy: string;
}

export class ContentRecommender {
  static async recommendForGaps(
    employeeId: string,
    maxModulesPerSkill: number = 3
  ): Promise<RecommendationSet[]> {
    const { data: employee } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .single();

    if (!employee) throw new Error('Employee not found');

    const { data: gaps } = await supabase
      .from('skill_gap_analysis')
      .select('*, skills(*)')
      .eq('employee_id', employeeId)
      .order('importance_score', { ascending: false });

    if (!gaps || gaps.length === 0) return [];

    const recommendations: RecommendationSet[] = [];

    for (const gap of gaps) {
      const { data: modules } = await supabase
        .from('learning_modules')
        .select('*')
        .eq('skill_id', gap.skill_id);

      if (!modules || modules.length === 0) continue;

      const scored = this.scoreModules(
        modules,
        employee,
        gap,
        maxModulesPerSkill
      );

      const recommendedModules = this.selectOptimalModules(
        scored,
        gap.current_level,
        gap.required_level,
        maxModulesPerSkill
      );

      const strategy = this.determineStrategy(gap, employee);

      recommendations.push({
        forSkill: gap.skills.name,
        skillId: gap.skill_id,
        modules: recommendedModules,
        estimatedTotalMinutes: recommendedModules.reduce(
          (sum, m) => sum + m.estimated_minutes,
          0
        ),
        learningStrategy: strategy,
      });
    }

    await this.updateGapRecommendations(employeeId, recommendations);

    return recommendations;
  }

  private static scoreModules(
    modules: LearningModule[],
    employee: Employee,
    gap: SkillGapAnalysis,
    maxModules: number
  ): RecommendedModule[] {
    const learningPrefs = employee.learning_preferences as any;
    const preferredStyles = learningPrefs?.styles || ['hands-on'];

    return modules.map(module => {
      let score = 0;
      let fitReason = '';
      let whyThis = '';

      const levelFit = this.calculateLevelFit(
        module.difficulty_level,
        gap.current_level,
        gap.required_level
      );
      score += levelFit.score;
      fitReason += levelFit.reason;

      const styleFit = this.calculateStyleFit(
        module,
        preferredStyles
      );
      score += styleFit.score;
      if (styleFit.matches) {
        fitReason += ` Matches your ${styleFit.style} learning preference.`;
      }

      const timeFit = this.calculateTimeFit(
        module.estimated_minutes,
        employee.weekly_learning_hours
      );
      score += timeFit.score;

      if (module.practical_application) {
        score += 15;
        whyThis = `Teaches ${gap.skills.name} through: ${module.practical_application}.`;
      } else {
        whyThis = `Builds ${gap.skills.name} proficiency needed for your role.`;
      }

      if (timeFit.isMicrolearning) {
        whyThis += ' Quick win - completable in one session.';
      }

      const priorityLevel = this.determinePriority(gap.gap_severity, levelFit.isFoundational);

      return {
        ...module,
        recommendationScore: score,
        whyThis: whyThis.trim(),
        fitReason: fitReason.trim(),
        priorityLevel,
        sequenceOrder: 0,
      };
    });
  }

  private static calculateLevelFit(
    moduleDifficulty: number,
    currentLevel: number,
    targetLevel: number
  ): { score: number; reason: string; isFoundational: boolean } {
    const idealDifficulty = currentLevel + 1;
    const diff = Math.abs(moduleDifficulty - idealDifficulty);

    if (diff === 0) {
      return {
        score: 50,
        reason: 'Perfect match for your current skill level.',
        isFoundational: currentLevel === 0,
      };
    }

    if (diff === 1) {
      return {
        score: 35,
        reason: 'Good challenge level.',
        isFoundational: false,
      };
    }

    if (moduleDifficulty < currentLevel) {
      return {
        score: 10,
        reason: 'May be too basic - good for review.',
        isFoundational: false,
      };
    }

    return {
      score: 20,
      reason: 'Stretch goal - requires strong foundation.',
      isFoundational: false,
    };
  }

  private static calculateStyleFit(
    module: LearningModule,
    preferredStyles: string[]
  ): { score: number; matches: boolean; style: string } {
    const moduleFit = module.learning_style_fit as string[] || [];

    for (const style of preferredStyles) {
      if (moduleFit.includes(style)) {
        return {
          score: 30,
          matches: true,
          style,
        };
      }
    }

    return { score: 10, matches: false, style: '' };
  }

  private static calculateTimeFit(
    estimatedMinutes: number,
    weeklyHours: number
  ): { score: number; isMicrolearning: boolean } {
    const sessionMinutes = (weeklyHours / 3) * 60;

    if (estimatedMinutes <= 30) {
      return { score: 20, isMicrolearning: true };
    }

    if (estimatedMinutes <= sessionMinutes) {
      return { score: 15, isMicrolearning: false };
    }

    return { score: 5, isMicrolearning: false };
  }

  private static determinePriority(
    severity: string,
    isFoundational: boolean
  ): 'urgent' | 'high' | 'medium' | 'low' {
    if (severity === 'critical' && isFoundational) return 'urgent';
    if (severity === 'critical' || (severity === 'high' && isFoundational)) return 'high';
    if (severity === 'high' || severity === 'moderate') return 'medium';
    return 'low';
  }

  private static selectOptimalModules(
    scored: RecommendedModule[],
    currentLevel: number,
    targetLevel: number,
    maxModules: number
  ): RecommendedModule[] {
    const sorted = scored.sort((a, b) => b.recommendationScore - a.recommendationScore);

    const progressive = this.ensureProgression(sorted, currentLevel, targetLevel);

    const selected = progressive.slice(0, maxModules);

    return selected.map((module, index) => ({
      ...module,
      sequenceOrder: index + 1,
    }));
  }

  private static ensureProgression(
    modules: RecommendedModule[],
    currentLevel: number,
    targetLevel: number
  ): RecommendedModule[] {
    const result: RecommendedModule[] = [];
    const needed = targetLevel - currentLevel;

    for (let i = 1; i <= needed; i++) {
      const targetDifficulty = currentLevel + i;
      const matching = modules.find(
        m => m.difficulty_level === targetDifficulty && !result.includes(m)
      );

      if (matching) {
        result.push(matching);
      }
    }

    for (const module of modules) {
      if (result.length >= 5) break;
      if (!result.includes(module)) {
        result.push(module);
      }
    }

    return result;
  }

  private static determineStrategy(gap: SkillGapAnalysis, employee: Employee): string {
    const weeklyHours = employee.weekly_learning_hours;
    const gapSize = gap.required_level - gap.current_level;

    if (gap.gap_severity === 'critical') {
      return `Critical priority: Focus intensive effort here. Dedicate at least ${Math.ceil(weeklyHours * 0.6)}h/week.`;
    }

    if (gapSize >= 3) {
      return `Large gap: Break into phases. Start with fundamentals, build progressively.`;
    }

    if (gapSize === 1) {
      return `Small gap: Can close quickly with focused practice. Prioritize hands-on application.`;
    }

    return `Moderate gap: Steady progress over ${gap.estimated_weeks} weeks with consistent effort.`;
  }

  private static async updateGapRecommendations(
    employeeId: string,
    recommendations: RecommendationSet[]
  ): Promise<void> {
    for (const rec of recommendations) {
      const moduleIds = rec.modules.map(m => m.id);

      await supabase
        .from('skill_gap_analysis')
        .update({ recommended_modules: moduleIds })
        .eq('employee_id', employeeId)
        .eq('skill_id', rec.skillId);
    }
  }
}
