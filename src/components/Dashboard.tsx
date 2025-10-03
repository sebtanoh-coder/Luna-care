import { useEffect, useState } from 'react';
import { Calendar, Droplets, Zap } from 'lucide-react';
import { Preferences } from '@capacitor/preferences';

const Dashboard = () => {
  const [flowIntensity, setFlowIntensity] = useState(3);
  const [painLevel, setPainLevel] = useState(2);
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [lastPeriod, setLastPeriod] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      const last = await Preferences.get({ key: 'lastPeriod' });
      if (last.value) setLastPeriod(last.value);
      const cycle = await Preferences.get({ key: 'cycleLength' });
      if (cycle.value) setCycleLength(Number(cycle.value));
      const flow = await Preferences.get({ key: 'flowLog' });
      if (flow.value) {
        const parsed = JSON.parse(flow.value);
        if (parsed.date === new Date().toISOString().slice(0, 10)) {
          setFlowIntensity(parsed.intensity);
          setPainLevel(parsed.pain);
        }
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const entry = {
      date: new Date().toISOString().slice(0, 10),
      intensity: flowIntensity,
      pain: painLevel
    };
    Preferences.set({ key: 'flowLog', value: JSON.stringify(entry) });
  }, [flowIntensity, painLevel]);

  // Calculs pour l'affichage
  const today = new Date();
  const currentDay = lastPeriod ? Math.floor((today.getTime() - new Date(lastPeriod).getTime()) / (1000*60*60*24)) + 1 : 0;
  const cycleDay = currentDay % cycleLength || cycleLength;
  const nextPeriodDays = cycleLength - cycleDay;

  const flowLabels = ['Très léger', 'Léger', 'Modéré', 'Abondant', 'Très abondant'];
  const painLabels = ['Aucune', 'Légère', 'Modérée', 'Forte', 'Très forte'];

  const getFlowColor = (level: number) => {
    const colors = ['bg-pink-200', 'bg-pink-300', 'bg-pink-400', 'bg-pink-500', 'bg-pink-600'];
    return colors[level - 1] || 'bg-gray-200';
  };

  const getPainColor = (level: number) => {
    const colors = ['bg-green-200', 'bg-yellow-300', 'bg-orange-400', 'bg-red-400', 'bg-red-600'];
    return colors[level - 1] || 'bg-gray-200';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Current Status */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Jour {currentDay} des règles</h2>
            <p className="text-pink-100 mb-4">Suivi de votre cycle menstruel</p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Droplets className="w-4 h-4" />
                <span className="text-sm">Jour {cycleDay} du cycle</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Cycle de {cycleLength} jours</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{nextPeriodDays}</div>
            <div className="text-sm text-pink-100">jours avant les prochaines</div>
          </div>
        </div>
      </div>

      {/* Flow Intensity Tracker */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
            <Droplets className="w-5 h-5 text-pink-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Intensité du flux</h3>
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Niveau actuel</span>
            <span className="text-sm font-semibold text-pink-600">
              {flowIntensity}/5 - {flowLabels[flowIntensity - 1]}
            </span>
          </div>
          <div className="flex space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setFlowIntensity(level)}
                className={`flex-1 h-8 rounded-lg transition-all ${
                  level <= flowIntensity 
                    ? getFlowColor(level) + ' shadow-sm' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className="text-xs font-medium text-white">
                  {level <= flowIntensity ? level : ''}
                </span>
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Très léger</span>
            <span>Très abondant</span>
          </div>
        </div>
      </div>

      {/* Pain Level Tracker */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Niveau de douleur</h3>
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Douleur actuelle</span>
            <span className="text-sm font-semibold text-red-600">
              {painLevel}/5 - {painLabels[painLevel - 1]}
            </span>
          </div>
          <div className="flex space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setPainLevel(level)}
                className={`flex-1 h-8 rounded-lg transition-all ${
                  level <= painLevel 
                    ? getPainColor(level) + ' shadow-sm' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className="text-xs font-medium text-white">
                  {level <= painLevel ? level : ''}
                </span>
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Aucune</span>
            <span>Très forte</span>
          </div>
        </div>
      </div>

      {/* ...actions rapides retirées... */}

      {/* Today's Summary */}
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6">
        <h3 className="font-bold text-gray-800 mb-4">Résumé du jour</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-pink-600 mb-1">{flowIntensity}</div>
            <div className="text-xs text-gray-600">Intensité flux</div>
          </div>
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">{painLevel}</div>
            <div className="text-xs text-gray-600">Niveau douleur</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-white/60 rounded-lg">
          <p className="text-sm text-gray-700 text-center">
            {painLevel >= 4 
              ? "Douleurs intenses détectées. Pensez à vous reposer et consultez l'onglet Support pour des conseils." 
              : flowIntensity >= 4 
              ? "Flux abondant aujourd'hui. Hydratez-vous bien et surveillez votre niveau d'énergie."
              : "Journée plutôt gérable. Continuez à prendre soin de vous !"}
          </p>
        </div>
      </div>
    </div>
  );
  // Mode normal : affichage inchangé

  return (
    <div className="p-6 space-y-6">
      {/* Indicateurs cycle et stats - mise en page initiale */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Droplets className="w-5 h-5 text-pink-500" />
            <span className="text-base font-semibold">Jour {cycleDay}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            <span className="text-base font-semibold">{cycleLength} jours</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold text-pink-600">{nextPeriodDays}</span>
          <span className="text-xs text-pink-400">jours avant règles</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold">{nextPeriodDays}</div>
        <div className="text-sm text-pink-100">jours avant les prochaines</div>
      </div>

      {/* Flow Intensity Tracker */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
            <Droplets className="w-5 h-5 text-pink-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Intensité du flux</h3>
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Niveau actuel</span>
            <span className="text-sm font-semibold text-pink-600">
              {flowIntensity}/5 - {flowLabels[flowIntensity - 1]}
            </span>
          </div>
          <div className="flex space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setFlowIntensity(level)}
                className={`flex-1 h-8 rounded-lg transition-all ${
                  level <= flowIntensity 
                    ? getFlowColor(level) + ' shadow-sm' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className="text-xs font-medium text-white">
                  {level <= flowIntensity ? level : ''}
                </span>
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Très léger</span>
            <span>Très abondant</span>
          </div>
        </div>
      </div>

      {/* Pain Level Tracker */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Niveau de douleur</h3>
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Douleur actuelle</span>
            <span className="text-sm font-semibold text-red-600">
              {painLevel}/5 - {painLabels[painLevel - 1]}
            </span>
          </div>
          <div className="flex space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setPainLevel(level)}
                className={`flex-1 h-8 rounded-lg transition-all ${
                  level <= painLevel 
                    ? getPainColor(level) + ' shadow-sm' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className="text-xs font-medium text-white">
                  {level <= painLevel ? level : ''}
                </span>
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Aucune</span>
            <span>Très forte</span>
          </div>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6">
        <h3 className="font-bold text-gray-800 mb-4">Résumé du jour</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-pink-600 mb-1">{flowIntensity}</div>
            <div className="text-xs text-gray-600">Intensité flux</div>
          </div>
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">{painLevel}</div>
            <div className="text-xs text-gray-600">Niveau douleur</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-white/60 rounded-lg">
          <p className="text-sm text-gray-700 text-center">
            {painLevel >= 4 
              ? "Douleurs intenses détectées. Pensez à vous reposer et consultez l'onglet Support pour des conseils." 
              : flowIntensity >= 4 
              ? "Flux abondant aujourd'hui. Hydratez-vous bien et surveillez votre niveau d'énergie."
              : "Journée plutôt gérable. Continuez à prendre soin de vous !"}
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper function


export default Dashboard;
