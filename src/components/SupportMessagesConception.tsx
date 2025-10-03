import React from 'react';

const SupportMessagesConception: React.FC = () => {
  // ...existing code...
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-blue-700 mb-2">Conseils pour la conception</h2>
        <p className="text-gray-500">Optimisez vos chances avec des routines et conseils adaptés.</p>
      </div>
      <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-6">
        <h3 className="font-bold text-blue-800 mb-4">Conseils fertilité</h3>
        <ul className="list-disc ml-6 text-sm text-gray-700">
          <li>Consommez des aliments riches en acide folique et zinc.</li>
          <li>Évitez le tabac et l'alcool.</li>
          <li>Pratiquez une activité physique douce.</li>
          <li>Surveillez votre fenêtre de fertilité.</li>
        </ul>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mt-4">
        <h3 className="font-semibold text-green-700 mb-2">Bien-être émotionnel</h3>
        <ul className="list-disc ml-6 text-sm text-gray-700">
          <li>Gérez le stress par la méditation ou le yoga.</li>
          <li>Communiquez avec votre partenaire.</li>
        </ul>
      </div>
    </div>
  );
};

export default SupportMessagesConception;
