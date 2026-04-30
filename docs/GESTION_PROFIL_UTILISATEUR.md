# Gestion du Profil Utilisateur

## Vue d'ensemble

La page profil permet à tous les utilisateurs (CUSTOMER, SELLER, ADMIN) de consulter et modifier leurs informations personnelles.

## Fonctionnalités

### 1. Affichage du Profil

**Carte de profil principale:**
- Avatar utilisateur
- Nom complet (prénom + nom)
- Badge de rôle (Acheteur, Vendeur, Administrateur)
- Date d'inscription

### 2. Modification des Informations

**Formulaire de modification:**
- **Prénom** (obligatoire, 2-50 caractères)
- **Nom** (obligatoire, 2-50 caractères)
- **Email** (obligatoire, format email valide)
- **Téléphone** (optionnel, max 20 caractères)

**Validation:**
- Validation en temps réel des champs
- Messages d'erreur clairs
- Vérification de l'unicité de l'email

**Actions:**
- Bouton "Réinitialiser" : annule les modifications
- Bouton "Enregistrer" : sauvegarde les changements

### 3. Gestion des Adresses

**Affichage des adresses:**
- Liste de toutes les adresses enregistrées
- Badge "Principale" pour l'adresse par défaut
- Détails complets : rue, ville, code postal, gouvernorat, pays
- Téléphone et instructions de livraison

**État vide:**
- Message informatif si aucune adresse
- Indication que les adresses peuvent être ajoutées lors d'une commande

## Architecture Backend

### Endpoints API

#### GET /api/users/profile
Récupère le profil complet de l'utilisateur connecté.

**Réponse:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "prenom": "Jean",
  "nom": "Dupont",
  "telephone": "+216 12 345 678",
  "role": "CUSTOMER",
  "dateCreation": "2024-01-15T10:30:00",
  "adresses": [
    {
      "id": 1,
      "prenom": "Jean",
      "nom": "Dupont",
      "rue": "123 Rue de la Paix",
      "ville": "Tunis",
      "codePostal": "1000",
      "pays": "Tunisie",
      "gouvernorat": "Tunis",
      "telephone": "+216 12 345 678",
      "instructions": "Sonner deux fois",
      "principal": true
    }
  ]
}
```

#### PUT /api/users/profile
Met à jour le profil de l'utilisateur connecté.

**Requête:**
```json
{
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean.dupont@example.com",
  "telephone": "+216 12 345 678"
}
```

**Réponse:**
- Même structure que GET /api/users/profile

### Services Backend

**UserService:**
- `getProfile(String email)` : Récupère le profil complet
- `updateProfile(String currentEmail, UserProfileRequest request)` : Met à jour le profil

**Sécurité:**
- Authentification requise pour tous les endpoints
- Vérification de l'unicité de l'email lors de la modification
- L'utilisateur ne peut modifier que son propre profil

## Architecture Frontend

### Composant ProfileComponent

**Fichiers:**
- `profile.component.ts` : Logique du composant
- `profile.component.html` : Template
- `profile.component.scss` : Styles

**Fonctionnalités:**
- Chargement automatique du profil au montage
- Formulaire réactif avec validation
- Gestion des états (chargement, sauvegarde)
- Notifications de succès/erreur

### Service UserService

**Méthodes:**
- `getProfile()` : Récupère le profil
- `updateProfile(request)` : Met à jour le profil

### Modèles TypeScript

```typescript
interface UserProfile {
  id: number;
  email: string;
  prenom: string;
  nom: string;
  telephone?: string;
  role: string;
  dateCreation: string;
  adresses: Address[];
}

interface UserProfileRequest {
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
}
```

## Navigation

### Accès à la page profil

**Menu utilisateur (toolbar):**
1. Cliquer sur l'avatar utilisateur (cercle vert)
2. Sélectionner "Profil" dans le menu déroulant

**Route:**
- `/profile` (protégée par AuthGuard)

## Design et UX

### Carte de profil
- Dégradé vert (couleur primaire)
- Avatar circulaire
- Badge de rôle stylisé
- Date d'inscription

### Formulaire
- Disposition en grille (2 colonnes sur desktop, 1 sur mobile)
- Champs Material Design avec icônes
- Validation en temps réel
- Boutons d'action alignés à droite

### Adresses
- Grille responsive
- Cartes avec bordure au survol
- Badge "Principale" pour l'adresse par défaut
- Icônes pour téléphone et instructions

### États
- Spinner de chargement
- Spinner sur le bouton lors de la sauvegarde
- Messages de succès/erreur via snackbar

## Responsive Design

**Desktop (> 768px):**
- Formulaire en 2 colonnes
- Adresses en grille multi-colonnes
- Largeur maximale de 1000px

**Mobile (≤ 768px):**
- Formulaire en 1 colonne
- Adresses en liste verticale
- Avatar et informations centrés

## Notifications

**Succès:**
- "Profil mis à jour avec succès"
- Snackbar verte, 3 secondes

**Erreur:**
- Message d'erreur du serveur ou message générique
- Snackbar rouge, 4 secondes

**Cas particulier:**
- Si l'email est modifié, la page se recharge pour mettre à jour le token JWT

## Validation

### Côté Frontend
- Prénom : obligatoire, 2-50 caractères
- Nom : obligatoire, 2-50 caractères
- Email : obligatoire, format email valide
- Téléphone : optionnel, max 20 caractères

### Côté Backend
- Mêmes validations avec annotations Jakarta
- Vérification de l'unicité de l'email
- Messages d'erreur en français

## Évolutions Futures

### Fonctionnalités possibles
1. **Changement de mot de passe**
   - Formulaire séparé avec ancien/nouveau mot de passe
   
2. **Gestion avancée des adresses**
   - Ajouter/modifier/supprimer des adresses
   - Définir l'adresse principale
   
3. **Photo de profil**
   - Upload d'avatar personnalisé
   - Stockage sur serveur ou cloud
   
4. **Préférences utilisateur**
   - Langue
   - Notifications
   - Thème (clair/sombre)
   
5. **Historique d'activité**
   - Dernières connexions
   - Modifications du profil
   
6. **Suppression de compte**
   - Avec confirmation
   - Anonymisation des données

## Sécurité

### Mesures en place
- Authentification JWT requise
- L'utilisateur ne peut modifier que son propre profil
- Validation des données côté serveur
- Vérification de l'unicité de l'email

### Bonnes pratiques
- Ne jamais exposer le mot de passe
- Valider toutes les entrées utilisateur
- Utiliser HTTPS en production
- Logger les modifications importantes

## Tests

### Tests à effectuer

**Frontend:**
1. Chargement du profil
2. Modification des champs
3. Validation des erreurs
4. Sauvegarde réussie
5. Gestion des erreurs serveur
6. Responsive design

**Backend:**
1. Récupération du profil
2. Mise à jour réussie
3. Email déjà utilisé
4. Validation des champs
5. Authentification requise
6. Utilisateur non trouvé

## Conclusion

La page profil offre une interface complète et intuitive pour la gestion des informations personnelles. Elle est accessible à tous les rôles et s'intègre parfaitement dans le design global de l'application.
