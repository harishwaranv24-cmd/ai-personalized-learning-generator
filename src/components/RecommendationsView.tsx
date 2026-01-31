import { Lightbulb, BookOpen, Video, FileText, Code, Zap } from 'lucide-react';
import type { RecommendationSet } from '../agents/ContentRecommender';

interface RecommendationsViewProps {
  recommendations: RecommendationSet[];
}

export function RecommendationsView({ recommendations }: RecommendationsViewProps) {
  const contentTypeIcons = {
    video: Video,
    article: FileText,
    interactive: Code,
    exercise: Zap,
    project: BookOpen,
  };

  const contentTypeColors = {
    video: 'bg-red-100 text-red-600',
    article: 'bg-blue-100 text-blue-600',
    interactive: 'bg-purple-100 text-purple-600',
    exercise: 'bg-green-100 text-green-600',
    project: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-500 rounded-xl">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Personalized Recommendations</h2>
            <p className="text-gray-600">Curated content optimized for your learning style</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {recommendations.length}
              </div>
              <div className="text-sm text-gray-600">Skills Targeted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">
                {recommendations.reduce((sum, r) => sum + r.modules.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Modules</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600">
                {Math.round(
                  recommendations.reduce((sum, r) => sum + r.estimatedTotalMinutes, 0) / 60
                )}h
              </div>
              <div className="text-sm text-gray-600">Total Learning Time</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {recommendations.map((rec, recIdx) => (
          <div
            key={recIdx}
            className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{rec.forSkill}</h3>
                  <p className="text-gray-600">{rec.modules.length} recommended modules</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-600">
                    {Math.round(rec.estimatedTotalMinutes / 60)}h {rec.estimatedTotalMinutes % 60}m
                  </div>
                  <div className="text-sm text-gray-600">Estimated time</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-50 border-b border-blue-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Learning Strategy</h4>
                  <p className="text-gray-700">{rec.learningStrategy}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {rec.modules.map((module, modIdx) => {
                const Icon = contentTypeIcons[module.content_type as keyof typeof contentTypeIcons] || BookOpen;
                const colorClass = contentTypeColors[module.content_type as keyof typeof contentTypeColors] || 'bg-gray-100 text-gray-600';

                return (
                  <div
                    key={modIdx}
                    className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200 hover:border-emerald-300 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-gray-500">
                                #{module.sequenceOrder}
                              </span>
                              <h4 className="text-lg font-bold text-gray-900">
                                {module.title}
                              </h4>
                            </div>
                            {module.description && (
                              <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="bg-emerald-50 rounded-lg p-3 mb-3 border border-emerald-200">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-semibold text-emerald-700 mb-1">
                                Why This Module
                              </div>
                              <p className="text-sm text-gray-700">{module.whyThis}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass} border border-current border-opacity-20`}>
                            {module.content_type}
                          </span>

                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                            Level {module.difficulty_level}
                          </span>

                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            {module.estimated_minutes} min
                          </span>

                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            module.priorityLevel === 'urgent' ? 'bg-red-100 text-red-700' :
                            module.priorityLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                            module.priorityLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {module.priorityLevel} priority
                          </span>

                          {module.fitReason && (
                            <span className="text-xs text-gray-600 italic">
                              {module.fitReason}
                            </span>
                          )}
                        </div>

                        {module.practical_application && (
                          <div className="mt-3 text-sm text-gray-600">
                            <span className="font-semibold">Apply it:</span> {module.practical_application}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
