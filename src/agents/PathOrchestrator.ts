import type { LearningPath, Employee } from '../lib/database.types';
import { supabase } from '../lib/supabase';
import type { RecommendationSet } from './ContentRecommender';

export interface ScheduledModule {
  moduleId: string;
  moduleTitle: string;
  skillName: string;
  weekNumber: number;
  estimatedMinutes: number;
  priority: string;
  milestone: string;
  prerequisites: string[];
}

export interface LearningJourney {
  path: LearningPath;
  weeklySchedule: Map<number, ScheduledModule[]>;
  milestones: Milestone[];
  totalWeeks: number;
  reasoning: string;
}

export interface Milestone {
  week: number;
  title: string;
  skills: string[];
  celebrationMessage: string;
}

export class PathOrchestrator {
  static async createOptimalPath(
    employeeId: string,
    recommendations: RecommendationSet[],
    pathName?: string
  ): Promise<LearningJourney> {
    const { data: employee } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .single();

    if (!employee) throw new Error('Employee not found');

    const scheduledModules = this.scheduleModules(
      recommendations,
      employee
    );

    const milestones = this.createMilestones(scheduledModules, recommendations);

    const totalWeeks = Math.max(...scheduledModules.map(m => m.weekNumber));

    const reasoning = this.generatePathReasoning(
      employee,
      recommendations,
      totalWeeks
    );

    const modulesSequence = this.buildSequenceJSON(scheduledModules);

    const { data: path } = await supabase
      .from('learning_paths')
      .insert({
        employee_id: employeeId,
        name: pathName || `${employee.job_role} Mastery Path`,
        status: 'active',
        modules_sequence: modulesSequence,
        start_date: new Date().toISOString().split('T')[0],
        target_completion_date: this.calculateEndDate(totalWeeks),
        reasoning,
      })
      .select()
      .single();

    if (!path) throw new Error('Failed to create learning path');

    const weeklySchedule = this.groupByWeek(scheduledModules);

    return {
      path,
      weeklySchedule,
      milestones,
      totalWeeks,
      reasoning,
    };
  }

  private static scheduleModules(
    recommendations: RecommendationSet[],
    employee: Employee
  ): ScheduledModule[] {
    const weeklyMinutes = employee.weekly_learning_hours * 60;
    const scheduled: ScheduledModule[] = [];
    let currentWeek = 1;
    let weekMinutes = 0;

    const prioritized = this.prioritizeRecommendations(recommendations);

    for (const rec of prioritized) {
      for (const module of rec.modules) {
        const moduleMinutes = module.estimated_minutes;

        if (weekMinutes + moduleMinutes > weeklyMinutes * 1.2) {
          currentWeek++;
          weekMinutes = 0;
        }

        const milestone = this.determineMilestone(
          module,
          rec.forSkill,
          scheduled.length + 1,
          rec.modules.length
        );

        scheduled.push({
          moduleId: module.id,
          moduleTitle: module.title,
          skillName: rec.forSkill,
          weekNumber: currentWeek,
          estimatedMinutes: moduleMinutes,
          priority: module.priorityLevel,
          milestone,
          prerequisites: this.extractPrerequisites(module, scheduled),
        });

        weekMinutes += moduleMinutes;
      }
    }

    return scheduled;
  }

  private static prioritizeRecommendations(
    recommendations: RecommendationSet[]
  ): RecommendationSet[] {
    const priorityMap = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    return recommendations.sort((a, b) => {
      const aPriority = Math.max(...a.modules.map(m =>
        priorityMap[m.priorityLevel] || 0
      ));
      const bPriority = Math.max(...b.modules.map(m =>
        priorityMap[m.priorityLevel] || 0
      ));
      return bPriority - aPriority;
    });
  }

  private static determineMilestone(
    module: any,
    skillName: string,
    moduleIndex: number,
    totalModulesForSkill: number
  ): string {
    if (moduleIndex === 1) {
      return 'First Step';
    }

    if (module.sequenceOrder === totalModulesForSkill) {
      return `${skillName} Complete`;
    }

    if (module.difficulty_level >= 4) {
      return 'Advanced Mastery';
    }

    return 'Progress';
  }

  private static extractPrerequisites(
    module: any,
    scheduled: ScheduledModule[]
  ): string[] {
    const modulePrereqs = module.prerequisites as string[] || [];

    return scheduled
      .filter(s => modulePrereqs.includes(s.moduleTitle))
      .map(s => s.moduleId);
  }

  private static createMilestones(
    scheduledModules: ScheduledModule[],
    recommendations: RecommendationSet[]
  ): Milestone[] {
    const milestones: Milestone[] = [];
    const skillCompletion = new Map<string, number>();

    for (const rec of recommendations) {
      const skillModules = scheduledModules.filter(m => m.skillName === rec.forSkill);
      if (skillModules.length === 0) continue;

      const lastModule = skillModules[skillModules.length - 1];
      skillCompletion.set(rec.forSkill, lastModule.weekNumber);
    }

    const sortedSkills = Array.from(skillCompletion.entries())
      .sort((a, b) => a[1] - b[1]);

    const earlyWin = sortedSkills[0];
    if (earlyWin) {
      milestones.push({
        week: earlyWin[1],
        title: 'First Skill Mastered',
        skills: [earlyWin[0]],
        celebrationMessage: `You've mastered ${earlyWin[0]}! This is a foundation for more.`,
      });
    }

    const midpoint = Math.ceil(sortedSkills.length / 2);
    if (sortedSkills[midpoint]) {
      const midSkill = sortedSkills[midpoint];
      milestones.push({
        week: midSkill[1],
        title: 'Halfway There',
        skills: sortedSkills.slice(0, midpoint + 1).map(s => s[0]),
        celebrationMessage: `You're halfway through your journey! ${midpoint + 1} skills gained.`,
      });
    }

    const final = sortedSkills[sortedSkills.length - 1];
    if (final) {
      milestones.push({
        week: final[1],
        title: 'Journey Complete',
        skills: sortedSkills.map(s => s[0]),
        celebrationMessage: `You've completed your entire learning path! ${sortedSkills.length} skills mastered.`,
      });
    }

    return milestones;
  }

  private static generatePathReasoning(
    employee: Employee,
    recommendations: RecommendationSet[],
    totalWeeks: number
  ): string {
    const skillCount = recommendations.length;
    const moduleCount = recommendations.reduce((sum, r) => sum + r.modules.length, 0);
    const criticalSkills = recommendations
      .filter(r => r.modules.some(m => m.priorityLevel === 'urgent' || m.priorityLevel === 'high'))
      .map(r => r.forSkill);

    let reasoning = `This ${totalWeeks}-week learning journey is personalized for ${employee.full_name}'s growth as a ${employee.job_role}. `;

    reasoning += `It addresses ${skillCount} key skill gaps through ${moduleCount} carefully sequenced modules. `;

    if (criticalSkills.length > 0) {
      reasoning += `Critical focus areas (${criticalSkills.join(', ')}) are prioritized for immediate impact. `;
    }

    reasoning += `The path respects your ${employee.weekly_learning_hours}h/week availability and emphasizes `;

    const prefs = employee.learning_preferences as any;
    const styles = prefs?.styles || ['hands-on'];
    reasoning += `${styles.join(' and ')} learning. `;

    reasoning += `Early wins are built in to maintain motivation, with progressive difficulty to build mastery.`;

    return reasoning;
  }

  private static buildSequenceJSON(scheduled: ScheduledModule[]): any {
    return scheduled.map(s => ({
      moduleId: s.moduleId,
      moduleTitle: s.moduleTitle,
      skillName: s.skillName,
      weekNumber: s.weekNumber,
      estimatedMinutes: s.estimatedMinutes,
      priority: s.priority,
      milestone: s.milestone,
      prerequisites: s.prerequisites,
    }));
  }

  private static calculateEndDate(weeks: number): string {
    const start = new Date();
    const end = new Date(start.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
    return end.toISOString().split('T')[0];
  }

  private static groupByWeek(
    scheduled: ScheduledModule[]
  ): Map<number, ScheduledModule[]> {
    const byWeek = new Map<number, ScheduledModule[]>();

    for (const module of scheduled) {
      const existing = byWeek.get(module.weekNumber) || [];
      existing.push(module);
      byWeek.set(module.weekNumber, existing);
    }

    return byWeek;
  }

  static async getLearningJourney(pathId: string): Promise<LearningJourney | null> {
    const { data: path } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('id', pathId)
      .maybeSingle();

    if (!path) return null;

    const sequence = path.modules_sequence as any[];
    const weeklySchedule = new Map<number, ScheduledModule[]>();

    for (const item of sequence) {
      const existing = weeklySchedule.get(item.weekNumber) || [];
      existing.push(item as ScheduledModule);
      weeklySchedule.set(item.weekNumber, existing);
    }

    const milestones = this.extractMilestonesFromSequence(sequence);

    const totalWeeks = Math.max(...sequence.map((s: any) => s.weekNumber));

    return {
      path,
      weeklySchedule,
      milestones,
      totalWeeks,
      reasoning: path.reasoning || '',
    };
  }

  private static extractMilestonesFromSequence(sequence: any[]): Milestone[] {
    const uniqueWeeks = [...new Set(sequence.map((s: any) => s.weekNumber))];
    const milestones: Milestone[] = [];

    for (const week of uniqueWeeks) {
      const weekModules = sequence.filter((s: any) => s.weekNumber === week);
      const completedSkills = weekModules
        .filter((m: any) => m.milestone && m.milestone.includes('Complete'))
        .map((m: any) => m.skillName);

      if (completedSkills.length > 0) {
        milestones.push({
          week,
          title: `Week ${week} Milestone`,
          skills: completedSkills,
          celebrationMessage: `Skills completed: ${completedSkills.join(', ')}`,
        });
      }
    }

    return milestones;
  }
}
