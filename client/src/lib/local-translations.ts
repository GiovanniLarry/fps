export type SupportedLang = 'en' | 'fr';

// Minimal dictionary for common UI phrases. Extend as needed.
const enToFr: Record<string, string> = {
  'Home': 'Accueil',
  'Search': 'Rechercher',
  'Packages': 'Colis',
  'Package': 'Colis',
  'Track': 'Suivre',
  'Track package': 'Suivre le colis',
  'Track Package': 'Suivre le colis',
  'Tracking number': 'Numéro de suivi',
  'Tracking...': 'Suivi...',
  'Enter tracking number': 'Saisir le numéro de suivi',
  'Enter tracking number...': 'Saisir le numéro de suivi...',
  'Package title (optional)...': 'Titre du colis (facultatif)...',
  'Add': 'Ajouter',
  'Add package': 'Ajouter un colis',
  'Add Package': 'Ajouter un colis',
  'Delete': 'Supprimer',
  'Remove': 'Supprimer',
  'Cancel': 'Annuler',
  'Confirm': 'Confirmer',
  'Save': 'Enregistrer',
  'Settings': 'Paramètres',
  'Language': 'Langue',
  'Recent searches': 'Recherches récentes',
  'Recent Searches': 'Recherches récentes',
  'Activity': 'Activité',
  'Status': 'Statut',
  'Origin': 'Origine',
  'Destination': 'Destination',
  'Estimated delivery': 'Livraison estimée',
  'Last update': 'Dernière mise à jour',
  'No packages yet': 'Aucun colis pour le moment',
  'No Packages Yet': 'Aucun colis pour le moment',
  'Start tracking your first package to see it here': 'Commencez à suivre votre premier colis pour le voir ici',
  'Try adding your first tracking number': 'Ajoutez votre premier numéro de suivi',
  'Copy': 'Copier',
  'Close': 'Fermer',
  'Open': 'Ouvrir',
  'Submit': 'Envoyer',
  'Loading...': 'Chargement...',
  'Error': 'Erreur',
  'Success': 'Succès',
  'In transit': 'En transit',
  'Delivered': 'Livré',
  'delivered': 'livré',
  'updated': 'mis à jour',
  'Out for delivery': 'En cours de livraison',
  'Exception': 'Exception',
  'Pending': 'En attente',
  'Package details': 'Détails du colis',
  'Not found': 'Introuvable',
  'Track Your': 'Suivez vos',
  'Monitor your shipments in real-time with our advanced tracking system': 'Surveillez vos envois en temps réel avec notre système de suivi avancé',
  'Active Packages': 'Colis actifs',
  'Powerful Features': 'Fonctionnalités puissantes',
  'Everything you need to track packages efficiently': 'Tout ce dont vous avez besoin pour suivre les colis efficacement',
  'Global Coverage': 'Couverture mondiale',
  'Track packages from 847+ carriers across 220+ countries worldwide': 'Suivez les colis auprès de plus de 847 transporteurs dans plus de 220 pays',
  'Real-time Updates': 'Mises à jour en temps réel',
  'Get instant notifications and live tracking updates as your package moves': 'Recevez des notifications instantanées et des mises à jour en direct des déplacements de votre colis',
  'Mobile Optimized': 'Optimisé pour mobile',
  'Beautiful responsive design that works perfectly on all devices': 'Un design responsive magnifique qui fonctionne parfaitement sur tous les appareils',
  'Analytics': 'Analytique',
  'Detailed insights and analytics about your shipping patterns': 'Des informations détaillées et des analyses sur vos habitudes d’expédition',
  'Secure & Private': 'Sécurisé et privé',
  'Your tracking data is encrypted and protected with enterprise-grade security': 'Vos données de suivi sont chiffrées et protégées avec une sécurité de niveau entreprise',
  'Multi-Language': 'Multilingue',
  'Support for multiple languages with real-time translation capabilities': 'Prise en charge de plusieurs langues avec des capacités de traduction en temps réel',
  'Recent Activity': 'Activité récente',
  'View All': 'Tout voir',
  'Carriers Supported': 'Transporteurs pris en charge',
  'Uptime': 'Disponibilité',
  'Packages Tracked': 'Colis suivis',
  'Countries': 'Pays',
  'The most advanced package tracking platform for modern logistics.': 'La plateforme de suivi de colis la plus avancée pour la logistique moderne.',
  'Features': 'Fonctionnalités',
  'Package Tracking': 'Suivi de colis',
  'Bulk Import': 'Import en masse',
  'Real-time Notifications': 'Notifications en temps réel',
  'Support': 'Support',
  'Help Center': 'Centre d’aide',
  'API Documentation': 'Documentation API',
  'Contact Us': 'Nous contacter',
  'Status Page': 'Page de statut',
  'Company': 'Entreprise',
  'About Us': 'À propos de nous',
  'Privacy Policy': 'Politique de confidentialité',
  'Terms of Service': 'Conditions d’utilisation',
  'Careers': 'Carrières',
  '© 2024 FedPack. All rights reserved.': '© 2025 FedPack. Tous droits réservés.',
  '© 2025 FedPack. All rights reserved.': '© 2025 FedPack. Tous droits réservés.',
  'No recent activity': 'Aucune activité récente',
  'Start tracking packages to see updates here': 'Commencez à suivre des colis pour voir les mises à jour ici',
  // Toasts & messages
  'Package Removed': 'Colis supprimé',
  'Package has been removed from tracking': 'Le colis a été supprimé du suivi',
  'Failed to remove package': 'Échec de la suppression du colis',
  'Package Added': 'Colis ajouté',
  'Now tracking': 'Suivi en cours',
  'Tracking Failed': 'Échec du suivi',
  'Failed to track package': 'Échec du suivi du colis',
  // Activity feed time phrases
  'Just now': 'À l’instant',
  'Recently': 'Récemment',
  'hours ago': 'heures',
  'days ago': 'jours',
  // Activity verbs
  'departed from': 'est parti de',
  'label created, package processing': 'étiquette créée, colis en traitement',
  'status updated': 'statut mis à jour',
  // 404 page
  '404 Page Not Found': '404 Page non trouvée',
  'Did you forget to add the page to the router?': 'Avez-vous oublié d’ajouter la page au routeur ?',
};

export function localTranslate(text: string, targetLang: SupportedLang): string {
  if (targetLang === 'en') return text;
  // Exact match first
  const trimmed = text.trim();
  if (enToFr[trimmed]) return enToFr[trimmed];

  // Phrase-level fallback: replace known phrases inside longer strings
  let output = text;
  for (const [en, fr] of Object.entries(enToFr)) {
    if (!en) continue;
    // Replace whole words/phrases, case-sensitive
    const pattern = new RegExp(`\\b${escapeRegExp(en)}\\b`, 'g');
    output = output.replace(pattern, fr);
  }
  return output;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


