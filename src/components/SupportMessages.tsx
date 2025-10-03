
import { Clock } from 'lucide-react';
import { useMode } from '../hooks/useMode';
import { useSymptomsHistory } from '../hooks/useSymptomsHistory';

const SupportMessages = () => {
  const { mode } = useMode();
  const recentSymptoms = useSymptomsHistory();

  // Préparation des conseils personnalisés selon symptômes
  let symptomAdvices: JSX.Element[] = [];
  if (recentSymptoms.length > 0) {
    symptomAdvices = recentSymptoms.map((symptom, idx) => {
      let details = "";
      let aliments: string[] = [];
      let tisanes: string[] = [];
      switch (symptom) {
        case 'Headache':
          details = "Pour soulager les maux de tête, privilégiez le repos dans une pièce sombre et calme. Massez vos tempes avec de l'huile essentielle de lavande diluée.";
          tisanes = ["Menthe poivrée", "Camomille", "Gingembre", "Mélisse", "Tilleul", "Romarin", "Verveine", "Lavande", "Basilic", "Saule blanc", "Reine-des-prés", "Feuilles de framboisier"];
          aliments = ["Amandes", "Eau fraîche", "Banane", "Noix du Brésil", "Graines de chia", "Épinards", "Avocat", "Poisson gras", "Brocoli", "Patate douce", "Oeuf", "Yaourt nature", "Quinoa", "Lentilles", "Chocolat noir"];
          break;
        case 'Fatigue':
          details = "La fatigue peut être atténuée par une sieste courte, une bonne hydratation et une alimentation riche en magnésium.";
          tisanes = ["Ortie", "Rooibos", "Citron", "Ginseng", "Maté", "Thé vert", "Romarin", "Menthe poivrée", "Guarana", "Sureau", "Fenouil", "Gingembre"];
          aliments = ["Amandes", "Chocolat noir", "Épinards", "Lentilles", "Banane", "Noix", "Abricot sec", "Graines de courge", "Poisson gras", "Oeuf", "Quinoa", "Patate douce", "Avocat", "Brocoli", "Yaourt nature"];
          break;
        case 'Cramps':
          details = "Pour les crampes, appliquez une bouillotte chaude et privilégiez les étirements doux. Les tisanes anti-inflammatoires sont recommandées.";
          tisanes = ["Gingembre", "Framboisier", "Camomille", "Ortie", "Sauge", "Achillée millefeuille", "Menthe poivrée", "Fenouil", "Tilleul", "Reine-des-prés", "Lavande", "Basilic"];
          aliments = ["Banane", "Noix", "Poisson gras", "Graines de chia", "Épinards", "Amandes", "Lentilles", "Patate douce", "Brocoli", "Oeuf", "Quinoa", "Abricot sec", "Avocat", "Yaourt nature"];
          break;
        case 'Nausea':
          details = "En cas de nausées, mangez en petites quantités et buvez des tisanes digestives. Respirez profondément à l'air frais.";
          tisanes = ["Gingembre", "Menthe", "Verveine", "Citronnelle", "Camomille", "Fenouil", "Anis", "Basilic", "Romarin", "Sureau", "Tilleul", "Mélisse"];
          aliments = ["Riz", "Pomme", "Carotte cuite", "Banane", "Yaourt nature", "Papaye", "Concombre", "Poisson blanc", "Patate douce", "Abricot sec", "Oeuf", "Quinoa", "Avocat", "Brocoli"];
          break;
        case 'Mood swings':
          details = "Les variations d'humeur sont normales. Pratiquez la respiration profonde et notez vos émotions. Privilégiez les aliments riches en oméga-3.";
          tisanes = ["Mélisse", "Passiflore", "Tilleul", "Camomille", "Lavande", "Verveine", "Sauge", "Ortie", "Framboisier", "Achillée millefeuille", "Romarin", "Sureau"];
          aliments = ["Saumon", "Noix", "Graines de chia", "Huile de lin", "Amandes", "Avocat", "Épinards", "Lentilles", "Patate douce", "Brocoli", "Oeuf", "Quinoa", "Abricot sec", "Yaourt nature"];
          break;
        case 'Back pain':
          details = "Pour le mal de dos, faites des étirements doux et appliquez une compresse chaude. Un bain chaud peut aussi aider.";
          tisanes = ["Reine-des-prés", "Gingembre", "Camomille", "Ortie", "Sauge", "Achillée millefeuille", "Menthe poivrée", "Fenouil", "Tilleul", "Lavande", "Basilic", "Framboisier"];
          aliments = ["Avoine", "Fruits rouges", "Huile d'olive", "Noix", "Graines de chia", "Épinards", "Amandes", "Lentilles", "Patate douce", "Brocoli", "Oeuf", "Quinoa", "Abricot sec", "Avocat", "Yaourt nature"];
          break;
        case 'Bloating':
          details = "Pour les ballonnements, buvez une tisane de fenouil et évitez les boissons gazeuses. Marchez après le repas.";
          tisanes = ["Fenouil", "Anis", "Menthe", "Camomille", "Verveine", "Citronnelle", "Sauge", "Ortie", "Framboisier", "Achillée millefeuille", "Romarin", "Sureau"];
          aliments = ["Yaourt nature", "Papaye", "Concombre", "Banane", "Riz", "Carotte cuite", "Poisson blanc", "Patate douce", "Abricot sec", "Oeuf", "Quinoa", "Avocat", "Brocoli", "Amandes", "Lentilles"];
          break;
        case 'Breast tenderness':
          details = "Portez un soutien-gorge confortable et évitez la caféine. Appliquez une compresse froide si besoin.";
          tisanes = ["Sauge", "Camomille", "Framboisier", "Ortie", "Achillée millefeuille", "Menthe poivrée", "Fenouil", "Tilleul", "Lavande", "Basilic", "Reine-des-prés", "Romarin"];
          aliments = ["Tofu", "Brocoli", "Amandes", "Noix", "Graines de chia", "Épinards", "Lentilles", "Patate douce", "Oeuf", "Quinoa", "Abricot sec", "Avocat", "Yaourt nature", "Fruits rouges"];
          break;
        case 'Food cravings':
          details = "Pour les envies alimentaires, privilégiez les fruits frais et les oléagineux. Buvez un verre d'eau avant de grignoter.";
          tisanes = ["Cannelle", "Rooibos", "Menthe", "Camomille", "Verveine", "Citronnelle", "Sauge", "Ortie", "Framboisier", "Achillée millefeuille", "Romarin", "Sureau"];
          aliments = ["Pomme", "Noix", "Abricot sec", "Banane", "Amandes", "Graines de courge", "Fruits rouges", "Papaye", "Concombre", "Poisson blanc", "Patate douce", "Oeuf", "Quinoa", "Avocat", "Brocoli"];
          break;
        case 'Acne':
          details = "Pour l'acné, nettoyez votre peau matin et soir et évitez de toucher votre visage. Les tisanes détox peuvent aider.";
          tisanes = ["Ortie", "Bardane", "Thym", "Romarin", "Sauge", "Camomille", "Verveine", "Citronnelle", "Menthe poivrée", "Achillée millefeuille", "Sureau", "Framboisier"];
          aliments = ["Carotte", "Avocat", "Poisson gras", "Brocoli", "Patate douce", "Oeuf", "Quinoa", "Abricot sec", "Amandes", "Lentilles", "Fruits rouges", "Yaourt nature", "Graines de chia", "Épinards"];
          break;
        default:
          details = "Prenez soin de vous et écoutez votre corps. Reposez-vous et privilégiez une alimentation variée.";
          tisanes = ["Camomille", "Verveine", "Tilleul", "Menthe poivrée", "Gingembre", "Ortie", "Sauge", "Achillée millefeuille", "Romarin", "Sureau", "Framboisier", "Citronnelle"];
          aliments = ["Fruits frais", "Légumes de saison", "Amandes", "Noix", "Graines de chia", "Épinards", "Lentilles", "Patate douce", "Brocoli", "Oeuf", "Quinoa", "Abricot sec", "Avocat", "Yaourt nature", "Fruits rouges"];
      }
      return (
        <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-pink-600 mb-2">{symptom}</h3>
          <p className="text-gray-700 mb-2">{details}</p>
          <div className="mb-2">
            <span className="font-semibold text-gray-800">Tisanes recommandées :</span>
            <ul className="list-disc ml-6 text-sm text-gray-700">
              {tisanes.slice(0, Math.ceil(tisanes.length / 2)).map((tisane, i) => <li key={i}>{tisane}</li>)}
            </ul>
          </div>
          <div>
            <span className="font-semibold text-gray-800">Aliments conseillés :</span>
            <ul className="list-disc ml-6 text-sm text-gray-700">
              {aliments.slice(0, Math.ceil(aliments.length / 2)).map((aliment, i) => <li key={i}>{aliment}</li>)}
            </ul>
          </div>
        </div>
      );
    });
  }
  // (supprimé, déjà déclaré en haut)

  // Conseils par mode
  const modeAdvices: Record<string, { title: string; tips: string[] }> = {
    regular: {
      title: "Cycle régulier",
      tips: [
        "Hydratation : buvez des tisanes chaudes pour apaiser les crampes.",
        "Alimentation : privilégiez les aliments riches en fer et magnésium.",
        "Repos : accordez-vous des moments de repos sans culpabilité."
      ]
    },
    conception: {
      title: "Conception",
      tips: [
        "Favorisez les aliments riches en acide folique.",
        "Pratiquez une activité physique douce.",
        "Évitez le stress et dormez suffisamment."
      ]
    },
    pregnancy: {
      title: "Grossesse",
      tips: [
        "Hydratez-vous régulièrement.",
        "Consommez des aliments riches en calcium et fer.",
        "Pratiquez la relaxation et le yoga prénatal."
      ]
    },
    menopause: {
      title: "Ménopause",
      tips: [
        "Hydratation et gestion des bouffées de chaleur.",
        "Bien-être émotionnel : techniques de relaxation et soutien social."
      ]
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{modeAdvices[mode]?.title || 'Conseils'}</h2>
        <p className="text-gray-500">Remèdes naturels et routines adaptées à votre mode</p>
      </div>

      {/* Symptômes récents */}
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Vos symptômes récents</h3>
        </div>
        {recentSymptoms.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {recentSymptoms.map((symptom, index) => (
              <span
                key={index}
                className="bg-white/60 px-3 py-1 rounded-full text-sm font-medium text-gray-700"
              >
                {symptom}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">
            Aucun symptôme enregistré récemment. Utilisez l'onglet Humeur pour enregistrer vos symptômes et recevoir des conseils personnalisés.
          </p>
        )}
      </div>

      {/* Conseils personnalisés selon symptômes */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {recentSymptoms.length > 0 ? 'Conseils personnalisés pour vous' : 'Conseils adaptés à votre mode'}
        </h3>
        {recentSymptoms.length > 0 ? (
          symptomAdvices
        ) : (
          <ul className="list-disc ml-6 text-sm text-gray-700">
            {modeAdvices[mode]?.tips.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        )}
      </div>

      {/* Conseils généraux enrichis */}
      <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-6 mt-6">
        <h3 className="font-bold text-gray-800 mb-4">🌿 Conseils généraux de nos grand-mères</h3>
        <div className="space-y-3">
          <div className="bg-white/60 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <strong>Hydratation :</strong> Buvez des tisanes chaudes (camomille, menthe, fenouil, gingembre) plutôt que de l'eau froide pendant vos règles pour apaiser les crampes et favoriser la digestion.
            </p>
          </div>
          <div className="bg-white/60 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <strong>Alimentation :</strong> Privilégiez les aliments riches en fer (épinards, lentilles, boudin noir, tofu), en magnésium (chocolat noir, amandes, noix du Brésil, banane), et en oméga-3 (saumon, graines de chia, huile de lin).
            </p>
          </div>
          <div className="bg-white/60 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <strong>Repos & mouvement :</strong> Écoutez votre corps et accordez-vous des moments de repos sans culpabilité. Pratiquez des étirements doux ou du yoga pour soulager les tensions et favoriser la circulation.
            </p>
          </div>
          <div className="bg-white/60 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <strong>Bien-être émotionnel :</strong> Prenez le temps de respirer profondément, de méditer ou d'écrire vos ressentis. Entourez-vous de personnes bienveillantes et n'hésitez pas à demander du soutien.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SupportMessages;
