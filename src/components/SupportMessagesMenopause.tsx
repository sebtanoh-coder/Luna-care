import React from 'react';

const SupportMessagesMenopause: React.FC = () => {
  // ...existing code...
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-purple-700 mb-2">Conseils pour la ménopause</h2>
        <p className="text-gray-500">Accompagnement et conseils pour mieux vivre la ménopause.</p>
      </div>
      <div className="bg-gradient-to-br from-purple-100 to-yellow-100 rounded-2xl p-6">
        <h3 className="font-bold text-purple-800 mb-4">Conseils santé et bien-être</h3>
        <ul className="list-disc ml-6 text-sm text-gray-700">
          <li>Hydratation et gestion des bouffées de chaleur.</li>
          <li>Privilégiez les aliments riches en calcium et vitamine D.</li>
          <li>Bien-être émotionnel : techniques de relaxation et soutien social.</li>
        </ul>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mt-4">
        <h3 className="font-semibold text-yellow-700 mb-2">Bien-être émotionnel</h3>
        <ul className="list-disc ml-6 text-sm text-gray-700">
          <li>Pratiquez la méditation ou le yoga.</li>
          <li>Entourez-vous de personnes bienveillantes.</li>
        </ul>
      </div>
    </div>
  );
};

export default SupportMessagesMenopause;
