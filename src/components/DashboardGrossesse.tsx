import React from 'react';

const DashboardGrossesse: React.FC = () => {
  // ...existing code...

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-pink-700 mb-2">Mode Grossesse</h2>
        <p className="text-gray-500">Suivi de grossesse, conseils et bien-être pour chaque trimestre.</p>
      </div>
      {/* Suivi trimestre, conseils santé, nutrition, mouvements bébé */}
      <div className="bg-gradient-to-br from-pink-100 to-yellow-100 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-pink-800 mb-4">Suivi de votre grossesse</h3>
        <p className="text-gray-700 mb-2">Recevez des conseils adaptés à votre trimestre et suivez l'évolution de bébé.</p>
        {/* ...ajouter affichage trimestre, conseils, etc... */}
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mt-4">
        <h3 className="font-semibold text-yellow-700 mb-2">Conseils santé et nutrition</h3>
        <ul className="list-disc ml-6 text-sm text-gray-700">
          <li>Hydratez-vous régulièrement.</li>
          <li>Consommez des aliments riches en calcium et fer.</li>
          <li>Pratiquez la relaxation et le yoga prénatal.</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardGrossesse;
