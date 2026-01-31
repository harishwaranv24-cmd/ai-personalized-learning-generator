import { useState } from 'react';
import { Calendar, Clock, Trophy, Play, CheckCircle, Circle } from 'lucide-react';
import type { LearningJourney, ScheduledModule } from '../agents/PathOrchestrator';

interface LearningTimelineProps {
  journey: LearningJourney;
  onStartModule?: (moduleId: string) => void;
}

export function LearningTimeline({ journey, onStartModule }: LearningTimelineProps) {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  const weeks = Array.from(journey.weeklySchedule.keys()).sort((a, b) => a - b);
  const currentWeekModules = journey.weeklySchedule.get(selectedWeek) || [];

  const priorityColors = {
    urgent: 'bg-red-100 text-red-700 border-red-300',
    high: 'bg-orange-100 text-orange-700 border-orange-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    low: 'bg-green-100 text-green-700 border-green-300',
  };

  const getMilestoneForWeek = (week: number) => {
    return journey.milestones.find(m => m.week === week);
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl p-8 border border-violet-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{journey.path.name}</h2>
            <p className="text-gray-600">{journey.totalWeeks}-week personalized learning journey</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-violet-600">
              {journey.totalWeeks}
            </div>
            <div className="text-sm text-gray-600">weeks</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-violet-600" />
            Why This Path Was Designed For You
          </h3>
          <p className="text-gray-700 leading-relaxed">{journey.reasoning}</p>
        </div>
      </div>

      {journey.milestones.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-200">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-amber-600" />
            <h3 className="text-xl font-bold text-gray-900">Milestones & Celebrations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {journey.milestones.map((milestone, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 border-2 border-amber-200 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
                    {milestone.week}
                  </div>
                  <div className="font-bold text-gray-900 text-sm">Week {milestone.week}</div>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{milestone.title}</h4>
                <p className="text-sm text-gray-600">{milestone.celebrationMessage}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <h3 className="text-xl font-bold text-gray-900">Weekly Schedule</h3>
          <p className="text-sm text-gray-600">Select a week to view modules</p>
        </div>

        <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
          {weeks.map(week => {
            const milestone = getMilestoneForWeek(week);
            const modules = journey.weeklySchedule.get(week) || [];
            const totalMinutes = modules.reduce((sum, m) => sum + m.estimatedMinutes, 0);

            return (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`flex-shrink-0 px-6 py-4 border-r border-gray-200 hover:bg-white transition ${
                  selectedWeek === week ? 'bg-white border-b-4 border-b-violet-500' : ''
                }`}
              >
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-bold text-gray-900">Week {week}</div>
                    {milestone && (
                      <Trophy className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">{modules.length} modules</div>
                  <div className="text-xs text-gray-500">{Math.round(totalMinutes / 60)}h {totalMinutes % 60}m</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {currentWeekModules.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Circle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No modules scheduled for this week</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentWeekModules.map((module, idx) => {
                const milestone = getMilestoneForWeek(selectedWeek);
                const isMilestone = milestone && module.milestone.includes(milestone.title);

                return (
                  <div
                    key={idx}
                    className={`relative rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg ${
                      isMilestone ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    {module.prerequisites.length > 0 && (
                      <div className="absolute top-2 right-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                        Has prerequisites
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white ${
                            module.priority === 'urgent' ? 'bg-red-500' :
                            module.priority === 'high' ? 'bg-orange-500' :
                            module.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}>
                            {idx + 1}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-lg font-bold text-gray-900 mb-1">
                                {module.moduleTitle}
                              </h4>
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <span className="font-medium text-violet-600">{module.skillName}</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {module.estimatedMinutes} min
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mt-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityColors[module.priority as keyof typeof priorityColors]}`}>
                              {module.priority} priority
                            </span>

                            {module.milestone !== 'Progress' && (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300">
                                {module.milestone}
                              </span>
                            )}
                          </div>

                          {onStartModule && (
                            <button
                              onClick={() => onStartModule(module.moduleId)}
                              className="mt-4 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition font-semibold flex items-center gap-2"
                            >
                              <Play className="w-4 h-4" />
                              Start Module
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{weeks.length}</div>
            <div className="text-sm text-gray-600">Total Weeks</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-violet-600">
              {Array.from(journey.weeklySchedule.values()).flat().length}
            </div>
            <div className="text-sm text-gray-600">Total Modules</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-emerald-600">
              {Math.round(
                Array.from(journey.weeklySchedule.values())
                  .flat()
                  .reduce((sum, m) => sum + m.estimatedMinutes, 0) / 60
              )}h
            </div>
            <div className="text-sm text-gray-600">Total Time</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">{journey.milestones.length}</div>
            <div className="text-sm text-gray-600">Milestones</div>
          </div>
        </div>
      </div>
    </div>
  );
}
