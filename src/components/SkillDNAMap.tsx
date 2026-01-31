import { useState } from 'react';
import { AlertCircle, TrendingUp, Info } from 'lucide-react';
import type { SkillDNAMap, SkillGap } from '../agents/SkillGapAnalyzer';

interface SkillDNAMapProps {
  dnaMap: SkillDNAMap;
}

export function SkillDNAMap({ dnaMap }: SkillDNAMapProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillGap | null>(null);

  const severityColors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    moderate: 'bg-yellow-500',
    low: 'bg-green-500',
  };

  const severityBorders = {
    critical: 'border-red-500',
    high: 'border-orange-500',
    moderate: 'border-yellow-500',
    low: 'border-green-500',
  };

  const severityText = {
    critical: 'text-red-700',
    high: 'text-orange-700',
    moderate: 'text-yellow-700',
    low: 'text-green-700',
  };

  const readinessColor =
    dnaMap.overallScore >= 80 ? 'text-green-600' :
    dnaMap.overallScore >= 60 ? 'text-blue-600' :
    dnaMap.overallScore >= 40 ? 'text-yellow-600' : 'text-orange-600';

  const renderSkillCategory = (title: string, skills: SkillGap[], bgColor: string) => {
    if (skills.length === 0) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${bgColor}`}></span>
          {title}
          <span className="text-sm font-normal text-gray-500">({skills.length} gaps)</span>
        </h3>

        <div className="grid gap-3">
          {skills.map((skill, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSkill(skill)}
              className={`text-left p-4 rounded-xl border-2 hover:shadow-lg transition-all ${
                selectedSkill?.skill.id === skill.skill.id
                  ? `${severityBorders[skill.severity]} bg-gray-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-gray-900">{skill.skill.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${severityColors[skill.severity]} text-white`}>
                      {skill.severity}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Current:</span>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-6 h-2 rounded ${
                              i < skill.currentLevel ? 'bg-blue-500' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Target:</span>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-6 h-2 rounded ${
                              i < skill.requiredLevel ? severityColors[skill.severity] : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">{skill.explanation}</p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{skill.gap}</div>
                  <div className="text-xs text-gray-500">levels</div>
                  <div className="text-xs text-gray-500 mt-1">{skill.estimatedWeeks}w</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Skill DNA Analysis</h2>
            <p className="text-gray-600">Your personalized skill development map</p>
          </div>
          <div className="text-right">
            <div className={`text-5xl font-bold ${readinessColor}`}>
              {dnaMap.overallScore}
            </div>
            <div className="text-sm text-gray-600">Readiness Score</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Overall Assessment</h3>
          </div>
          <p className="text-gray-700 text-lg">{dnaMap.readinessLevel}</p>
        </div>
      </div>

      {dnaMap.topPriorities.length > 0 && (
        <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-bold text-gray-900">Top Priorities</h3>
          </div>
          <p className="text-gray-700 mb-4">Focus on these critical gaps first for maximum impact</p>
          <div className="space-y-2">
            {dnaMap.topPriorities.map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-white rounded-lg p-3 border border-red-200"
              >
                <div className={`w-8 h-8 rounded-full ${severityColors[skill.severity]} text-white flex items-center justify-center font-bold`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">{skill.skill.name}</div>
                  <div className="text-sm text-gray-600">{skill.estimatedWeeks} weeks • {skill.gap} level gap</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          {renderSkillCategory('Technical Skills', dnaMap.technical, 'bg-blue-500')}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          {renderSkillCategory('Soft Skills', dnaMap.soft, 'bg-emerald-500')}
        </div>
      </div>

      {dnaMap.domain.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          {renderSkillCategory('Domain Knowledge', dnaMap.domain, 'bg-amber-500')}
        </div>
      )}

      {selectedSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedSkill.skill.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${severityColors[selectedSkill.severity]} text-white`}>
                    {selectedSkill.severity}
                  </span>
                </div>
                <p className="text-gray-600">{selectedSkill.skill.category} • {selectedSkill.skill.subcategory}</p>
              </div>
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  Why This Matters
                </h4>
                <p className="text-gray-700 leading-relaxed">{selectedSkill.explanation}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Current Level</div>
                  <div className="text-3xl font-bold text-blue-600">{selectedSkill.currentLevel}</div>
                </div>
                <div className={`rounded-lg p-4 ${severityColors[selectedSkill.severity]} bg-opacity-10`}>
                  <div className="text-sm text-gray-600 mb-1">Target Level</div>
                  <div className={`text-3xl font-bold ${severityText[selectedSkill.severity]}`}>
                    {selectedSkill.requiredLevel}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Estimated Time to Close Gap</div>
                <div className="text-2xl font-bold text-gray-900">{selectedSkill.estimatedWeeks} weeks</div>
                <div className="text-sm text-gray-500 mt-1">With focused, consistent effort</div>
              </div>

              {selectedSkill.skill.description && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">About This Skill</h4>
                  <p className="text-gray-700">{selectedSkill.skill.description}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedSkill(null)}
              className="w-full mt-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
