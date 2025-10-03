import React from 'react';

const SupportMessagesGrossesse: React.FC = () => {
  // ...existing code...
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-pink-700 mb-2">Conseils pour la grossesse</h2>
        <p className="text-gray-500">Accompagnement et conseils pour chaque étape de la grossesse.</p>
      </div>
      <div className="bg-gradient-to-br from-pink-100 to-yellow-100 rounded-2xl p-6">
        <h3 className="font-bold text-pink-800 mb-4">Conseils santé et bien-être</h3>
        <ul className="list-disc ml-6 text-sm text-gray-700">
          <li>Hydratez-vous régulièrement.</li>
          <li>Consommez des aliments riches en calcium et fer.</li>
          <li>Pratiquez la relaxation et le yoga prénatal.</li>
          <li>Suivez l'évolution de bébé par trimestre.</li>
        </ul>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mt-4">
        <h3 className="font-semibold text-yellow-700 mb-2">Bien-être émotionnel</h3>
        <ul className="list-disc ml-6 text-sm text-gray-700">
          <li>Entourez-vous de personnes bienveillantes.</li>
          <li>Demandez du soutien si besoin.</li>
        </ul>
      </div>
    </div>
  );
};

export default SupportMessagesGrossesse;
