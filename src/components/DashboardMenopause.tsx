import React from 'react';

const DashboardMenopause: React.FC = () => {
  // ...existing code...

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-700 mb-2">Mode Ménopause</h2>
        <p className="text-gray-500">Suivi des symptômes, conseils bien-être et gestion des bouffées de chaleur.</p>
      </div>
      {/* Suivi symptômes, conseils bouffées de chaleur, nutrition, sommeil */}
      <div className="bg-gradient-to-br from-purple-100 to-yellow-100 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-purple-800 mb-4">Bien-être à la ménopause</h3>
        <p className="text-gray-700 mb-2">Recevez des conseils pour mieux vivre la ménopause et gérer les symptômes.</p>
        {/* ...ajouter affichage symptômes, conseils, etc... */}
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mt-4">
        <h3 className="font-semibold text-yellow-700 mb-2">Conseils santé et nutrition</h3>
        <ul className="list-disc ml-6 text-sm text-gray-700">
          <li>Hydratation et gestion des bouffées de chaleur.</li>
          <li>Privilégiez les aliments riches en calcium et vitamine D.</li>
          <li>Bien-être émotionnel : techniques de relaxation et soutien social.</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardMenopause;
