import React from 'react';

const DashboardConception: React.FC = () => {
  // ...existing code...

  // UI inspirée de Flo, charte visuelle conservée
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">Mode Conception</h2>
        <p className="text-gray-500">Optimisez vos chances de conception avec des conseils personnalisés.</p>
      </div>
      {/* Conseils fertilité, calendrier d'ovulation, suivi symptômes */}
      <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4">Fenêtre de fertilité</h3>
        <p className="text-gray-700 mb-2">Suivez votre période d'ovulation et recevez des conseils pour maximiser vos chances.</p>
        {/* ...ajouter affichage calendrier, conseils, etc... */}
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mt-4">
        <h3 className="font-semibold text-green-700 mb-2">Conseils nutrition et bien-être</h3>
        <ul className="list-disc ml-6 text-sm text-gray-700">
          <li>Consommez des aliments riches en acide folique et zinc.</li>
          <li>Pratiquez une activité physique douce.</li>
          <li>Évitez le stress et dormez suffisamment.</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardConception;
