import { useState } from 'react';
import { User, Briefcase, Target, Clock, Brain } from 'lucide-react';
import type { PersonaInput } from '../agents/PersonaBuilder';

interface PersonaFormProps {
  onSubmit: (persona: PersonaInput) => void;
  isLoading: boolean;
}

export function PersonaForm({ onSubmit, isLoading }: PersonaFormProps) {
  const [formData, setFormData] = useState<PersonaInput>({
    email: '',
    full_name: '',
    job_role: '',
    department: '',
    experience_level: 'mid',
    career_goals: [],
    learning_preferences: {
      styles: ['hands-on'],
      pace: 'moderate',
    },
    weekly_learning_hours: 5,
    current_skills: [],
  });

  const [currentGoal, setCurrentGoal] = useState('');
  const [currentSkill, setCurrentSkill] = useState({ name: '', level: 1 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addGoal = () => {
    if (currentGoal.trim()) {
      setFormData(prev => ({
        ...prev,
        career_goals: [...(prev.career_goals || []), currentGoal.trim()],
      }));
      setCurrentGoal('');
    }
  };

  const addSkill = () => {
    if (currentSkill.name.trim()) {
      setFormData(prev => ({
        ...prev,
        current_skills: [
          ...(prev.current_skills || []),
          { skill_name: currentSkill.name.trim(), level: currentSkill.level },
        ],
      }));
      setCurrentSkill({ name: '', level: 1 });
    }
  };

  const toggleStyle = (style: 'visual' | 'hands-on' | 'reading' | 'auditory') => {
    setFormData(prev => {
      const currentStyles = prev.learning_preferences?.styles || [];
      const hasStyle = currentStyles.includes(style);
      return {
        ...prev,
        learning_preferences: {
          ...prev.learning_preferences,
          styles: hasStyle
            ? currentStyles.filter(s => s !== style)
            : [...currentStyles, style],
        },
      };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            <p className="text-gray-600">Tell us about yourself</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="john@example.com"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Briefcase className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Professional Context</h2>
            <p className="text-gray-600">Your current role and experience</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Role
            </label>
            <input
              type="text"
              required
              value={formData.job_role}
              onChange={e => setFormData(prev => ({ ...prev, job_role: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder="Software Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder="Engineering"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Experience Level
            </label>
            <select
              value={formData.experience_level}
              onChange={e => setFormData(prev => ({ ...prev, experience_level: e.target.value as any }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            >
              <option value="junior">Junior</option>
              <option value="mid">Mid-Level</option>
              <option value="senior">Senior</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Weekly Learning Hours
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.weekly_learning_hours}
              onChange={e => setFormData(prev => ({ ...prev, weekly_learning_hours: parseInt(e.target.value) }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-100 rounded-xl">
            <Target className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Career Goals</h2>
            <p className="text-gray-600">Where do you want to go?</p>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={currentGoal}
            onChange={e => setCurrentGoal(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addGoal())}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
            placeholder="e.g., Become a Senior Engineer"
          />
          <button
            type="button"
            onClick={addGoal}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold"
          >
            Add
          </button>
        </div>

        {formData.career_goals && formData.career_goals.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.career_goals.map((goal, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200"
              >
                {goal}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-violet-100 rounded-xl">
            <Brain className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Learning Preferences</h2>
            <p className="text-gray-600">How do you learn best?</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Learning Styles (select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['visual', 'hands-on', 'reading', 'auditory'] as const).map(style => (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleStyle(style)}
                  className={`px-4 py-3 rounded-lg border-2 transition font-medium capitalize ${
                    formData.learning_preferences?.styles.includes(style)
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-violet-300'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Preferred Pace
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['slow', 'moderate', 'fast'] as const).map(pace => (
                <button
                  key={pace}
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    learning_preferences: { ...prev.learning_preferences, pace },
                  }))}
                  className={`px-4 py-3 rounded-lg border-2 transition font-medium capitalize ${
                    formData.learning_preferences?.pace === pace
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-violet-300'
                  }`}
                >
                  {pace}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-cyan-100 rounded-xl">
            <Clock className="w-6 h-6 text-cyan-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Current Skills</h2>
            <p className="text-gray-600">What skills do you already have?</p>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={currentSkill.name}
            onChange={e => setCurrentSkill(prev => ({ ...prev, name: e.target.value }))}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            placeholder="Skill name (e.g., React)"
          />
          <select
            value={currentSkill.level}
            onChange={e => setCurrentSkill(prev => ({ ...prev, level: parseInt(e.target.value) }))}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
          >
            {[1, 2, 3, 4, 5].map(level => (
              <option key={level} value={level}>Level {level}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={addSkill}
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-semibold"
          >
            Add
          </button>
        </div>

        {formData.current_skills && formData.current_skills.length > 0 && (
          <div className="space-y-2">
            {formData.current_skills.map((skill, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3 bg-cyan-50 rounded-lg border border-cyan-200"
              >
                <span className="font-medium text-gray-900">{skill.skill_name}</span>
                <span className="text-sm text-cyan-700">Level {skill.level}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isLoading ? 'Creating Your Learning Journey...' : 'Start My Learning Journey'}
      </button>
    </form>
  );
}
