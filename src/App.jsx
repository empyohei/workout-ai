import React, { useState, useEffect } from 'react';

// Google Gemini Vision API call
async function analyzeWorkoutMenuWithGemini(imageBase64) {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) throw new Error('Gemini API key not configured');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Analyze this workout menu photo and return JSON format:
{
  "exercises": [
    {
      "name": "Exercise name",
      "sets": [{"kg": number, "reps": number}]
    }
  ],
  "confidence": 0-100
}
Return ONLY valid JSON, no markdown.`
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }]
      })
    }
  );

  const data = await response.json();
  const content = data.candidates[0].content.parts[0].text;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch[0]);
}

// localStorage management
const Storage = {
  getWorkouts: () => JSON.parse(localStorage.getItem('workouts') || '[]'),
  saveWorkout: (workout) => {
    const workouts = Storage.getWorkouts();
    workouts.push({ ...workout, id: Date.now(), date: new Date().toISOString() });
    localStorage.setItem('workouts', JSON.stringify(workouts));
  },
  getUserData: () => JSON.parse(localStorage.getItem('userData') || '{"username":"Athlete","joinDate":"2024-01-01"}'),
  saveUserData: (data) => localStorage.setItem('userData', JSON.stringify(data))
};

// ===== Login Screen =====
function LoginScreen({ onLogin }) {
  const [geminiKey, setGeminiKey] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">💪</div>
          <h1 className="text-3xl font-bold text-white mb-2">Workout AI</h1>
          <p className="text-slate-400">Auto-analyze workouts with Gemini</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Gemini API Key
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
            <p className="text-xs text-slate-400 mt-2">
              🔗 <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Get API Key</a>
            </p>
          </div>

          <button
            onClick={() => {
              if (!geminiKey) alert('Please enter your API key');
              else {
                localStorage.setItem('gemini_api_key', geminiKey);
                onLogin();
              }
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 rounded-lg transition-all duration-200"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Home Screen =====
function HomeScreen() {
  const workouts = Storage.getWorkouts();
  const recentWorkouts = workouts.slice(-10).reverse();

  const getWorkoutSummary = (workout) => {
    const totalVolume = workout.exercises.reduce((sum, ex) => {
      return sum + ex.sets.reduce((s, set) => s + (set.kg || 0) * (set.reps || 0), 0);
    }, 0);
    return {
      totalVolume,
      exercises: workout.exercises.length,
      sets: workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
    };
  };

  return (
    <div className="pb-24 bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 p-4">
        <h1 className="text-2xl font-bold text-white">Home</h1>
      </div>

      <div className="p-4 space-y-3">
        {recentWorkouts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Log your first workout to get started</p>
          </div>
        ) : (
          recentWorkouts.map((workout) => {
            const summary = getWorkoutSummary(workout);
            const date = new Date(workout.date);
            const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];

            return (
              <div key={workout.id} className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 hover:bg-slate-800/70 transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      {workout.exercises.map(e => e.name).join(' + ')}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">{formattedDate} • {dayName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-700/30 rounded-lg p-2 text-center">
                    <p className="text-blue-400 font-bold text-lg">{summary.totalVolume.toLocaleString()}</p>
                    <p className="text-slate-400 text-xs">kg</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-2 text-center">
                    <p className="text-blue-400 font-bold text-lg">{summary.exercises}</p>
                    <p className="text-slate-400 text-xs">Exercises</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-2 text-center">
                    <p className="text-blue-400 font-bold text-lg">{summary.sets}</p>
                    <p className="text-slate-400 text-xs">Sets</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ===== Workout Screen =====
function WorkoutScreen() {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState('');

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      setPhotoPreview(event.target.result);
      const base64 = event.target.result.split(',')[1];
      setAnalyzing(true);
      setError('');

      try {
        const result = await analyzeWorkoutMenuWithGemini(base64);
        setExercises(result.exercises || []);
      } catch (err) {
        setError('Analysis failed: ' + err.message);
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const updateExercise = (index, field, value) => {
    const updated = [...exercises];
    if (field.startsWith('set_')) {
      const [_, setIndex, setField] = field.split('_');
      updated[index].sets[parseInt(setIndex)][setField] = isNaN(value) ? value : Number(value);
    } else {
      updated[index][field] = value;
    }
    setExercises(updated);
  };

  const handleSave = () => {
    if (exercises.length === 0) {
      alert('Please add exercises');
      return;
    }
    Storage.saveWorkout({ exercises });
    alert('Workout saved!');
    setExercises([]);
    setPhotoPreview(null);
  };

  return (
    <div className="pb-24 bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 p-4">
        <h1 className="text-2xl font-bold text-white">Workout</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Start Button */}
        <label className="block cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-6 text-center hover:from-blue-500 hover:to-blue-400 transition-all">
            <div className="text-4xl mb-2">📸</div>
            <p className="text-white font-semibold">Start Workout</p>
            <p className="text-blue-100 text-sm mt-1">Take a photo of your workout menu</p>
          </div>
        </label>

        {/* Photo Preview */}
        {photoPreview && (
          <div className="bg-slate-800 rounded-xl overflow-hidden">
            <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover" />
          </div>
        )}

        {/* Analyzing */}
        {analyzing && (
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 text-center">
            <p className="text-blue-300">🤖 Analyzing menu...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Exercises */}
        {exercises.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-white font-semibold">Exercises</h2>
            {exercises.map((ex, exIdx) => (
              <div key={exIdx} className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4">
                <input
                  type="text"
                  value={ex.name}
                  onChange={(e) => updateExercise(exIdx, 'name', e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white mb-3 text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="Exercise name"
                />
                <div className="space-y-2">
                  {ex.sets?.map((set, setIdx) => (
                    <div key={setIdx} className="flex gap-2">
                      <input
                        type="number"
                        placeholder="kg"
                        value={set.kg || ''}
                        onChange={(e) => updateExercise(exIdx, `set_${setIdx}_kg`, e.target.value)}
                        className="w-20 bg-slate-700/50 border border-slate-600 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500/50"
                      />
                      <input
                        type="number"
                        placeholder="reps"
                        value={set.reps || ''}
                        onChange={(e) => updateExercise(exIdx, `set_${setIdx}_reps`, e.target.value)}
                        className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-all"
            >
              ✓ Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== Profile Screen =====
function ProfileScreen() {
  const [userData, setUserData] = useState(Storage.getUserData());
  const [editing, setEditing] = useState(false);
  const workouts = Storage.getWorkouts();

  const stats = {
    totalWorkouts: workouts.length,
    totalVolume: workouts.reduce((sum, w) => {
      return sum + w.exercises.reduce((s, e) => s + e.sets.reduce((ss, set) => ss + (set.kg || 0) * (set.reps || 0), 0), 0);
    }, 0),
    uniqueExercises: new Set(workouts.flatMap(w => w.exercises.map(e => e.name))).size,
    bestLifts: {}
  };

  // Best lifts by exercise
  workouts.forEach(w => {
    w.exercises.forEach(ex => {
      if (!stats.bestLifts[ex.name]) stats.bestLifts[ex.name] = 0;
      ex.sets.forEach(set => {
        stats.bestLifts[ex.name] = Math.max(stats.bestLifts[ex.name], set.kg || 0);
      });
    });
  });

  return (
    <div className="pb-24 bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <button
          onClick={() => setEditing(!editing)}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          {editing ? 'Done' : 'Edit'}
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* User Info */}
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
              💪
            </div>
            <div>
              {editing ? (
                <input
                  type="text"
                  value={userData.username}
                  onChange={(e) => {
                    setUserData({ ...userData, username: e.target.value });
                    Storage.saveUserData({ ...userData, username: e.target.value });
                  }}
                  className="bg-slate-700 text-white px-2 py-1 rounded text-lg font-semibold mb-1 w-full"
                />
              ) : (
                <h2 className="text-white text-xl font-bold">{userData.username}</h2>
              )}
              <p className="text-slate-400 text-sm">Member since {new Date(userData.joinDate).toLocaleDateString('en-US')}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4">
            <p className="text-slate-400 text-xs">Total Workouts</p>
            <p className="text-white text-2xl font-bold mt-1">{stats.totalWorkouts}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4">
            <p className="text-slate-400 text-xs">Total Volume</p>
            <p className="text-white text-2xl font-bold mt-1">{(stats.totalVolume / 1000).toFixed(1)}t</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4">
            <p className="text-slate-400 text-xs">Unique Exercises</p>
            <p className="text-white text-2xl font-bold mt-1">{stats.uniqueExercises}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4">
            <p className="text-slate-400 text-xs">Total Sets</p>
            <p className="text-white text-2xl font-bold mt-1">{workouts.reduce((sum, w) => sum + w.exercises.reduce((s, e) => s + e.sets.length, 0), 0)}</p>
          </div>
        </div>

        {/* Best Lifts */}
        <div>
          <h3 className="text-white font-semibold mb-3">Personal Records</h3>
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl divide-y divide-slate-700/30">
            {Object.entries(stats.bestLifts).length === 0 ? (
              <div className="p-4 text-slate-400 text-sm">No records yet</div>
            ) : (
              Object.entries(stats.bestLifts).map(([exercise, weight]) => (
                <div key={exercise} className="p-4 flex justify-between items-center">
                  <p className="text-white text-sm">{exercise}</p>
                  <p className="text-blue-400 font-bold">{weight}kg</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* All Workouts */}
        <div>
          <h3 className="text-white font-semibold mb-3">Workout History</h3>
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl divide-y divide-slate-700/30 max-h-96 overflow-y-auto">
            {workouts.length === 0 ? (
              <div className="p-4 text-slate-400 text-sm">No workouts logged yet</div>
            ) : (
              workouts.slice().reverse().map((w) => {
                const date = new Date(w.date);
                return (
                  <div key={w.id} className="p-3 text-sm">
                    <p className="text-white">{date.toLocaleDateString('en-US')}</p>
                    <p className="text-slate-400 text-xs">{w.exercises.map(e => e.name).join(', ')}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Tab Navigation =====
function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'workout', label: 'Workout', icon: '🏋️' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800 flex justify-around">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 py-4 flex flex-col items-center gap-1 border-t-2 transition-all ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-xs font-semibold">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// ===== Main App =====
export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('gemini_api_key'));
  const [activeTab, setActiveTab] = useState('home');

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="bg-slate-950 min-h-screen">
      {activeTab === 'home' && <HomeScreen />}
      {activeTab === 'workout' && <WorkoutScreen />}
      {activeTab === 'profile' && <ProfileScreen />}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
