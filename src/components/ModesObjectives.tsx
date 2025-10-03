import React, { useState, useEffect } from 'react';
import { Baby, Heart, Flower, Calendar, ArrowLeft, CheckCircle, Info } from 'lucide-react';
import { Preferences } from '@capacitor/preferences';

interface ModesObjectivesProps {
  onBack: () => void;
  onModeChange?: (modeId: string) => void; // callback pour synchroniser avec Dashboard
}

const ModesObjectives: React.FC<ModesObjectivesProps> = ({ onBack, onModeChange }) => {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<string>('regular');

  // Charger le mode depuis Preferences au montage
  useEffect(() => {
    const loadMode = async () => {
      const mode = await Preferences.get({ key: 'lunacare_mode' });
      if (mode.value) setCurrentMode(mode.value);
    };
    loadMode();
  }, []);

  const modes = [
    {
      id: 'conception',
      title: 'Mode Conception',
      subtitle: 'Essayer de tomber enceinte',
      description: 'Optimisez vos chances de conception avec un suivi personnalisé',
      icon: Baby,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      features: [
        'Prédiction précise de la fenêtre fertile',
        'Suivi de la température basale',
        'Conseils nutritionnels pour la fertilité',
        "Tracking des tests d'ovulation",
        'Rappels pour les relations intimes optimales',
        "Suivi des symptômes d'ovulation"
      ]
    },
    {
      id: 'pregnancy',
      title: 'Mode Grossesse',
      subtitle: 'Suivi de votre grossesse',
      description: 'Accompagnement semaine par semaine pendant votre grossesse',
      icon: Heart,
      color: 'from-pink-400 to-rose-500',
      bgColor: 'bg-pink-50',
      features: [
        'Suivi semaine par semaine du développement',
        'Calendrier des rendez-vous médicaux',
        'Conseils nutritionnels adaptés',
        'Suivi du poids et des symptômes',
        "Préparation à l'accouchement",
        'Journal de grossesse personnalisé'
      ]
    },
    {
      id: 'menopause',
      title: 'Mode Ménopause',
      subtitle: 'Transition et ménopause',
      description: 'Accompagnement pendant la périménopause et ménopause',
      icon: Flower,
      color: 'from-purple-400 to-violet-500',
      bgColor: 'bg-purple-50',
      features: [
        'Suivi des bouffées de chaleur',
        'Tracking des cycles irréguliers',
        'Conseils pour gérer les symptômes',
        "Suivi de l'humeur et du sommeil",
        'Informations sur les traitements',
        'Communauté de soutien'
      ]
    },
    {
      id: 'regular',
      title: 'Mode Classique',
      subtitle: 'Suivi menstruel standard',
      description: 'Suivi complet de votre cycle menstruel et bien-être',
      icon: Calendar,
      color: 'from-indigo-400 to-blue-500',
      bgColor: 'bg-blue-50',
      features: [
        'Prédiction des règles',
        'Suivi des symptômes',
        "Tracking de l'humeur",
        'Conseils de bien-être',
        'Analyses de cycle',
        'Rappels personnalisés'
      ]
    }
  ];

  const handleModeSelection = async (modeId: string) => {
    setCurrentMode(modeId);
    setSelectedMode(null);
    await Preferences.set({ key: 'lunacare_mode', value: modeId });
    if (onModeChange) onModeChange(modeId); // callback pour synchroniser le Dashboard
  };

  const getCurrentModeInfo = () => {
    return modes.find(mode => mode.id === currentMode) || modes[3];
  };

  const currentModeInfo = getCurrentModeInfo();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Modes & Objectifs</h2>
          <p className="text-gray-500">Personnalisez votre expérience</p>
        </div>
      </div>

      {/* Mode actuel */}
      <div className={`${currentModeInfo.bgColor} rounded-2xl p-6 border-2 border-green-200`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${currentModeInfo.color} rounded-full flex items-center justify-center`}>
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Mode actuel</h3>
            <p className="text-sm text-gray-600">{currentModeInfo.title}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{currentModeInfo.description}</p>
        <div className="bg-white/60 rounded-lg p-3">
          <p className="text-sm text-gray-600">
            ✨ Vous bénéficiez actuellement de toutes les fonctionnalités du {currentModeInfo.title.toLowerCase()}
          </p>
        </div>
      </div>

      {/* Sélection de mode */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Changer de mode</h3>
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;
          const isCurrent = currentMode === mode.id;
          return (
            <div key={mode.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div 
                className={`p-6 cursor-pointer transition-all ${
                  isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'
                } ${isCurrent ? 'opacity-50' : ''}`}
                onClick={() => !isCurrent && setSelectedMode(isSelected ? null : mode.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-12 h-12 bg-gradient-to-r ${mode.color} rounded-full flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-bold text-gray-800">{mode.title}</h4>
                        {isCurrent && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            Actuel
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{mode.subtitle}</p>
                      <p className="text-sm text-gray-500">{mode.description}</p>
                    </div>
                  </div>
                  {!isCurrent && (
                    <div className="ml-4">
                      <Info className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              {isSelected && !isCurrent && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-4 space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3">Fonctionnalités incluses :</h5>
                      <div className="grid grid-cols-1 gap-2">
                        {mode.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={() => handleModeSelection(mode.id)}
                        className={`flex-1 bg-gradient-to-r ${mode.color} text-white py-3 px-4 rounded-xl font-semibold hover:shadow-md transition-shadow`}
                      >
                        Activer ce mode
                      </button>
                      <button
                        onClick={() => setSelectedMode(null)}
                        className="px-4 py-3 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Informations importantes */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">À savoir</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Vous pouvez changer de mode à tout moment</li>
              <li>• Vos données précédentes sont conservées</li>
              <li>• Chaque mode adapte l'interface à vos besoins spécifiques</li>
              <li>• Les conseils et prédictions sont personnalisés selon votre mode</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Conseils selon le mode */}
      {currentMode === 'conception' && (
        <div className="bg-green-50 rounded-2xl p-6">
          <h4 className="font-bold text-green-800 mb-3">💡 Conseils pour la conception</h4>
          <div className="space-y-2 text-sm text-green-700">
            <p>• Prenez de l'acide folique (400μg/jour) avant la conception</p>
            <p>• Maintenez un poids santé et une alimentation équilibrée</p>
            <p>• Évitez l'alcool, le tabac et limitez la caféine</p>
            <p>• Consultez votre médecin pour un bilan préconceptionnel</p>
          </div>
        </div>
      )}
      {currentMode === 'pregnancy' && (
        <div className="bg-pink-50 rounded-2xl p-6">
          <h4 className="font-bold text-pink-800 mb-3">💡 Conseils grossesse</h4>
          <div className="space-y-2 text-sm text-pink-700">
            <p>• Prenez vos vitamines prénatales quotidiennement</p>
            <p>• Hydratez-vous bien (8-10 verres d'eau par jour)</p>
            <p>• Reposez-vous suffisamment et écoutez votre corps</p>
            <p>• Suivez régulièrement vos rendez-vous médicaux</p>
          </div>
        </div>
      )}
      {currentMode === 'menopause' && (
        <div className="bg-purple-50 rounded-2xl p-6">
          <h4 className="font-bold text-purple-800 mb-3">💡 Conseils ménopause</h4>
          <div className="space-y-2 text-sm text-purple-700">
            <p>• Maintenez une activité physique régulière</p>
            <p>• Adoptez une alimentation riche en calcium et vitamine D</p>
            <p>• Pratiquez des techniques de relaxation pour gérer le stress</p>
            <p>• N'hésitez pas à parler de vos symptômes à votre médecin</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModesObjectives;
