import type { FeedbackSignal, LearningProgress, AdaptationLog } from '../lib/database.types';
import { supabase } from '../lib/supabase';

export interface AdaptationDecision {
  type: 'difficulty_adjust' | 'pace_change' | 'content_swap' | 'encouragement' | 'intervention';
  action: string;
  reasoning: string;
  triggerSignals: string[];
  transparency: string;
}

export interface LearnerProfile {
  successRate: number;
  avgCompletionTime: number;
  satisfactionTrend: 'improving' | 'stable' | 'declining';
  strugglingAreas: string[];
  strengths: string[];
}

export class AdaptiveEngine {
  static async processFeedback(
    employeeId: string,
    signal: {
      moduleId: string;
      type: string;
      value: any;
      satisfaction?: number;
      comments?: string;
    }
  ): Promise<AdaptationDecision | null> {
    await this.storeFeedback(employeeId, signal);

    const profile = await this.buildLearnerProfile(employeeId);

    const decision = this.makeAdaptationDecision(
      signal,
      profile,
      employeeId
    );

    if (decision) {
      await this.executeAdaptation(employeeId, decision);
    }

    return decision;
  }

  private static async storeFeedback(
    employeeId: string,
    signal: any
  ): Promise<void> {
    await supabase
      .from('feedback_signals')
      .insert({
        employee_id: employeeId,
        module_id: signal.moduleId,
        signal_type: signal.type,
        signal_value: signal.value,
        satisfaction_score: signal.satisfaction || null,
        comments: signal.comments || null,
      });
  }

  private static async buildLearnerProfile(
    employeeId: string
  ): Promise<LearnerProfile> {
    const { data: progress } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('employee_id', employeeId);

    const { data: feedback } = await supabase
      .from('feedback_signals')
      .select('*')
      .eq('employee_id', employeeId)
      .order('timestamp', { ascending: false })
      .limit(20);

    if (!progress || progress.length === 0) {
      return {
        successRate: 0,
        avgCompletionTime: 0,
        satisfactionTrend: 'stable',
        strugglingAreas: [],
        strengths: [],
      };
    }

    const completed = progress.filter(p => p.status === 'completed');
    const successRate = completed.length / progress.length;

    const avgCompletionTime = completed.length > 0
      ? completed.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0) / completed.length
      : 0;

    const satisfactionTrend = this.analyzeSatisfactionTrend(feedback || []);

    const strugglingAreas = this.identifyStruggles(feedback || [], progress);

    const strengths = this.identifyStrengths(progress);

    return {
      successRate,
      avgCompletionTime,
      satisfactionTrend,
      strugglingAreas,
      strengths,
    };
  }

  private static analyzeSatisfactionTrend(
    signals: FeedbackSignal[]
  ): 'improving' | 'stable' | 'declining' {
    const withSatisfaction = signals.filter(s => s.satisfaction_score !== null);

    if (withSatisfaction.length < 3) return 'stable';

    const recent = withSatisfaction.slice(0, 3);
    const older = withSatisfaction.slice(3, 6);

    if (older.length === 0) return 'stable';

    const recentAvg = recent.reduce((sum, s) => sum + (s.satisfaction_score || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, s) => sum + (s.satisfaction_score || 0), 0) / older.length;

    if (recentAvg > olderAvg + 0.5) return 'improving';
    if (recentAvg < olderAvg - 0.5) return 'declining';
    return 'stable';
  }

  private static identifyStruggles(
    signals: FeedbackSignal[],
    progress: LearningProgress[]
  ): string[] {
    const struggles: string[] = [];

    const lowSatisfaction = signals.filter(s =>
      s.satisfaction_score !== null && s.satisfaction_score <= 2
    );

    if (lowSatisfaction.length >= 2) {
      struggles.push('Low satisfaction with recent content');
    }

    const incomplete = progress.filter(p =>
      p.status === 'in_progress' &&
      p.time_spent_minutes > 0 &&
      p.completion_percentage < 50
    );

    if (incomplete.length >= 2) {
      struggles.push('Difficulty completing modules');
    }

    const strugglingSignals = signals.filter(s =>
      s.signal_type === 'struggle' || s.signal_type === 'skip'
    );

    if (strugglingSignals.length >= 3) {
      struggles.push('Frequent skipping or struggle indicators');
    }

    return struggles;
  }

  private static identifyStrengths(progress: LearningProgress[]): string[] {
    const strengths: string[] = [];

    const highPerformers = progress.filter(p =>
      p.performance_score !== null && p.performance_score >= 85
    );

    if (highPerformers.length >= 3) {
      strengths.push('High performance scores');
    }

    const fastCompletions = progress.filter(p =>
      p.status === 'completed' &&
      p.time_spent_minutes > 0 &&
      p.time_spent_minutes <= p.time_spent_minutes * 0.8
    );

    if (fastCompletions.length >= 2) {
      strengths.push('Efficient learning pace');
    }

    const consistent = progress.filter(p => p.status === 'completed');
    const totalStarted = progress.filter(p => p.status !== 'not_started');

    if (consistent.length / totalStarted.length >= 0.8) {
      strengths.push('Strong completion consistency');
    }

    return strengths;
  }

  private static makeAdaptationDecision(
    signal: any,
    profile: LearnerProfile,
    employeeId: string
  ): AdaptationDecision | null {
    if (signal.type === 'completion' && signal.value.performance >= 90) {
      return {
        type: 'difficulty_adjust',
        action: 'Recommend skipping beginner content for this skill area',
        reasoning: 'Strong performance indicates readiness for advanced material',
        triggerSignals: ['High performance score', 'Quick completion'],
        transparency: "You're excelling! We'll suggest more challenging content to keep you engaged.",
      };
    }

    if (signal.type === 'struggle' || (signal.satisfaction && signal.satisfaction <= 2)) {
      return {
        type: 'content_swap',
        action: 'Offer alternative learning format for this skill',
        reasoning: 'Low satisfaction or struggle indicates content format mismatch',
        triggerSignals: ['Low satisfaction', 'Struggle signal'],
        transparency: "This content doesn't seem to be clicking. Let's try a different approach that might work better for you.",
      };
    }

    if (profile.satisfactionTrend === 'declining' && profile.strugglingAreas.length >= 2) {
      return {
        type: 'intervention',
        action: 'Pause path and recommend lighter, review-focused content',
        reasoning: 'Multiple struggle indicators suggest cognitive overload',
        triggerSignals: profile.strugglingAreas,
        transparency: "We notice you might be feeling overwhelmed. Let's take a step back and reinforce your foundations before continuing.",
      };
    }

    if (profile.successRate >= 0.9 && profile.strengths.length >= 2) {
      return {
        type: 'pace_change',
        action: 'Accelerate learning path timeline',
        reasoning: 'Consistent high performance indicates capacity for faster progression',
        triggerSignals: profile.strengths,
        transparency: "You're doing great! We can accelerate your timeline if you're ready for more.",
      };
    }

    if (signal.type === 'time_spent' && signal.value.minutes > signal.value.estimated * 1.5) {
      return {
        type: 'difficulty_adjust',
        action: 'Provide supplementary easier modules before continuing',
        reasoning: 'Extended time suggests content is above current level',
        triggerSignals: ['Time spent exceeds estimate by 50%'],
        transparency: "This module took longer than expected. We'll add some foundation-building content to make the next steps easier.",
      };
    }

    if (profile.successRate >= 0.7 && Math.random() < 0.3) {
      return {
        type: 'encouragement',
        action: 'Send motivational milestone message',
        reasoning: 'Positive reinforcement for steady progress',
        triggerSignals: ['Steady progress'],
        transparency: "You're making solid progress! Keep up the momentum.",
      };
    }

    return null;
  }

  private static async executeAdaptation(
    employeeId: string,
    decision: AdaptationDecision
  ): Promise<void> {
    await supabase
      .from('adaptation_logs')
      .insert({
        employee_id: employeeId,
        adaptation_type: decision.type,
        trigger_signals: decision.triggerSignals,
        action_taken: decision.action,
        reasoning: decision.reasoning,
      });

    if (decision.type === 'difficulty_adjust' || decision.type === 'content_swap') {
      await this.updateLearningPath(employeeId, decision);
    }
  }

  private static async updateLearningPath(
    employeeId: string,
    decision: AdaptationDecision
  ): Promise<void> {
    const { data: activePath } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('status', 'active')
      .maybeSingle();

    if (!activePath) return;

    const updatedReasoning = `${activePath.reasoning}\n\n[Adapted ${new Date().toLocaleDateString()}]: ${decision.reasoning}`;

    await supabase
      .from('learning_paths')
      .update({ reasoning: updatedReasoning })
      .eq('id', activePath.id);
  }

  static async getAdaptationHistory(employeeId: string): Promise<AdaptationLog[]> {
    const { data: logs } = await supabase
      .from('adaptation_logs')
      .select('*')
      .eq('employee_id', employeeId)
      .order('timestamp', { ascending: false })
      .limit(10);

    return logs || [];
  }

  static async updateProgress(
    employeeId: string,
    moduleId: string,
    update: {
      status?: string;
      completionPercentage?: number;
      performanceScore?: number;
      timeSpentMinutes?: number;
    }
  ): Promise<void> {
    const now = new Date().toISOString();

    const { data: existing } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('module_id', moduleId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('learning_progress')
        .update({
          ...update,
          updated_at: now,
          completed_at: update.status === 'completed' ? now : existing.completed_at,
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('learning_progress')
        .insert({
          employee_id: employeeId,
          module_id: moduleId,
          status: update.status || 'in_progress',
          completion_percentage: update.completionPercentage || 0,
          performance_score: update.performanceScore || null,
          time_spent_minutes: update.timeSpentMinutes || 0,
          started_at: now,
          completed_at: update.status === 'completed' ? now : null,
        });
    }
  }
}
