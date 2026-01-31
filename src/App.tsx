import { useState } from 'react';
import { Brain, Sparkles, Map, Target } from 'lucide-react';
import { PersonaForm } from './components/PersonaForm';
import { SkillDNAMap } from './components/SkillDNAMap';
import { RecommendationsView } from './components/RecommendationsView';
import { LearningTimeline } from './components/LearningTimeline';
import { PersonaBuilder, type PersonaInput, type EnrichedPersona } from './agents/PersonaBuilder';
import { SkillGapAnalyzer, type SkillDNAMap as SkillDNA } from './agents/SkillGapAnalyzer';
import { ContentRecommender, type RecommendationSet } from './agents/ContentRecommender';
import { PathOrchestrator, type LearningJourney } from './agents/PathOrchestrator';
import { AdaptiveEngine } from './agents/AdaptiveEngine';

type Step = 'welcome' | 'persona' | 'analyzing' | 'dashboard';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [persona, setPersona] = useState<EnrichedPersona | null>(null);
  const [dnaMap, setDnaMap] = useState<SkillDNA | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationSet[]>([]);
  const [journey, setJourney] = useState<LearningJourney | null>(null);
  const [activeTab, setActiveTab] = useState<'dna' | 'recommendations' | 'timeline'>('dna');

  const handlePersonaSubmit = async (input: PersonaInput) => {
    setIsLoading(true);
    setCurrentStep('analyzing');

    try {
      const enrichedPersona = await PersonaBuilder.buildPersona(input);
      setPersona(enrichedPersona);

      const skillDna = await SkillGapAnalyzer.analyzeGaps(enrichedPersona.id);
      setDnaMap(skillDna);

      const recs = await ContentRecommender.recommendForGaps(enrichedPersona.id);
      setRecommendations(recs);

      const learningJourney = await PathOrchestrator.createOptimalPath(
        enrichedPersona.id,
        recs
      );
      setJourney(learningJourney);

      setTimeout(() => {
        setCurrentStep('dashboard');
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error creating learning journey:', error);
      setIsLoading(false);
      alert('Failed to create learning journey. Please try again.');
      setCurrentStep('persona');
    }
  };

  const handleStartModule = async (moduleId: string) => {
    if (!persona) return;

    await AdaptiveEngine.updateProgress(persona.id, moduleId, {
      status: 'in_progress',
      completionPercentage: 0,
    });

    alert('Module started! Progress tracking activated.');
  };

  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl mb-6 shadow-2xl">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-4">
              AI Learning Experience Architect
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your intelligent mentor that designs deeply personalized, adaptive training programs.
              We analyze your skills, recommend optimized content, and continuously adapt to your progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Persona Builder</h3>
              <p className="text-sm text-gray-600">
                Rich profile analysis with inferred motivations and learning capacity
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Map className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Skill DNA Map</h3>
              <p className="text-sm text-gray-600">
                Visual gap analysis with severity indicators and explanations
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-violet-200 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Smart Recommendations</h3>
              <p className="text-sm text-gray-600">
                Optimized content with transparent reasoning for each suggestion
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-amber-200 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Adaptive Engine</h3>
              <p className="text-sm text-gray-600">
                Continuous learning from feedback to optimize your journey
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setCurrentStep('persona')}
              className="px-12 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-cyan-700 transition shadow-2xl hover:shadow-3xl"
            >
              Begin Your Journey
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'persona') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Build Your Learning Persona</h1>
            <p className="text-gray-600">Help us understand your unique profile to design your perfect learning path</p>
          </div>

          <PersonaForm onSubmit={handlePersonaSubmit} isLoading={isLoading} />
        </div>
      </div>
    );
  }

  if (currentStep === 'analyzing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl mb-8 animate-pulse shadow-2xl">
            <Brain className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Multi-Agent System Working</h2>
          <div className="space-y-3 text-lg text-gray-700 max-w-md mx-auto">
            <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow">
              <span>Persona Builder</span>
              <div className="w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow">
              <span>Skill Gap Analyzer</span>
              <div className="w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow">
              <span>Content Recommender</span>
              <div className="w-6 h-6 bg-violet-500 rounded-full animate-ping"></div>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow">
              <span>Path Orchestrator</span>
              <div className="w-6 h-6 bg-amber-500 rounded-full animate-ping"></div>
            </div>
          </div>
          <p className="text-gray-600 mt-6">Designing your personalized learning journey...</p>
        </div>
      </div>
    );
  }

  if (currentStep === 'dashboard' && persona && dnaMap && journey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Welcome, {persona.full_name}!</h1>
                  <p className="text-sm text-gray-600">{persona.job_role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right mr-4">
                  <div className="text-2xl font-bold text-blue-600">{dnaMap.overallScore}</div>
                  <div className="text-xs text-gray-600">Readiness</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl border border-gray-200 mb-6 overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('dna')}
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  activeTab === 'dna'
                    ? 'bg-blue-50 text-blue-600 border-b-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Skill DNA Map
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  activeTab === 'recommendations'
                    ? 'bg-emerald-50 text-emerald-600 border-b-4 border-emerald-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Recommendations
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  activeTab === 'timeline'
                    ? 'bg-violet-50 text-violet-600 border-b-4 border-violet-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Learning Timeline
              </button>
            </div>
          </div>

          <div className="pb-12">
            {activeTab === 'dna' && <SkillDNAMap dnaMap={dnaMap} />}
            {activeTab === 'recommendations' && <RecommendationsView recommendations={recommendations} />}
            {activeTab === 'timeline' && <LearningTimeline journey={journey} onStartModule={handleStartModule} />}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
