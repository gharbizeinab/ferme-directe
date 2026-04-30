# Gestion des Catégories - Documentation

## 📋 Vue d'ensemble

Un nouveau module complet de gestion des catégories a été ajouté à l'application FermeDirecte. Ce module permet aux administrateurs de créer, modifier et supprimer des catégories de produits avec support de la hiérarchie (catégories parentes et sous-catégories).

## ✨ Fonctionnalités

### Backend (Déjà existant)
- ✅ **Endpoints REST** dans `CategoryController`
  - `GET /api/categories` - Liste toutes les catégories (arbre hiérarchique)
  - `GET /api/categories/{id}` - Récupérer une catégorie
  - `POST /api/categories` - Créer une catégorie (Admin uniquement)
  - `PUT /api/categories/{id}` - Modifier une catégorie (Admin uniquement)
  - `DELETE /api/categories/{id}` - Supprimer une catégorie (Admin uniquement)

- ✅ **Service** `CategoryService` avec :
  - Gestion de l'arbre hiérarchique
  - Validation des relations parent-enfant
  - Protection contre les boucles infinies
  - Empêche la suppression de catégories avec sous-catégories

### Frontend (Nouvellement ajouté)

#### 1. Composant `ManageCategoriesComponent`
**Localisation :** `src/app/components/manage-categories/`

**Fonctionnalités :**
- 📝 Formulaire de création/modification de catégories
- 📊 Tableau hiérarchique des catégories existantes
- 🌳 Support des catégories parentes (hiérarchie)
- ✏️ Modification en ligne
- 🗑️ Suppression avec confirmation
- 🔄 Rechargement automatique après chaque opération

**Champs du formulaire :**
- **Nom** (obligatoire, min 2 caractères)
- **Description** (optionnel)
- **Catégorie parente** (optionnel, pour créer une sous-catégorie)

#### 2. Modèles TypeScript mis à jour
**Fichier :** `src/app/models/index.ts`

```typescript
export interface Category {
  id: number;
  nom: string;
  description?: string;
  parentId?: number;
  sousCategories?: Category[];
}

export interface CategoryRequest {
  nom: string;
  description?: string;
  parentId?: number;
}
```

#### 3. Service mis à jour
**Fichier :** `src/app/services/category.service.ts`

Méthodes disponibles :
- `getAll()` - Récupère toutes les catégories
- `getById(id)` - Récupère une catégorie par ID
- `create(request)` - Crée une nouvelle catégorie
- `update(id, request)` - Modifie une catégorie
- `delete(id)` - Supprime une catégorie

#### 4. Navigation
- ✅ Route ajoutée : `/manage-categories`
- ✅ Lien dans le menu latéral (visible uniquement pour les ADMIN)
- ✅ Protection par `AuthGuard` et `RoleGuard`

## 🎨 Interface utilisateur

### Design
- **Carte formulaire** : Fond vert avec icônes Material
- **Carte liste** : Fond bleu avec tableau responsive
- **Affichage hiérarchique** : Indentation visuelle pour les sous-catégories
- **Badges colorés** :
  - 🟢 Vert : Catégorie parente
  - 🔵 Bleu : Catégorie racine
  - 🟠 Orange : Nombre de sous-catégories

### Actions disponibles
- ➕ **Créer** : Bouton "Créer" dans le formulaire
- ✏️ **Modifier** : Icône crayon dans le tableau
- 🗑️ **Supprimer** : Icône poubelle avec dialogue de confirmation
- ❌ **Annuler** : Bouton pour annuler l'édition

## 🔒 Sécurité

### Backend
- Authentification JWT requise
- Rôle ADMIN obligatoire pour toutes les opérations CRUD
- Validation des données avec `@Valid`
- Protection contre les boucles infinies (catégorie = son propre parent)
- Empêche la suppression de catégories avec sous-catégories

### Frontend
- Route protégée par `AuthGuard` et `RoleGuard`
- Visible uniquement pour les utilisateurs avec rôle ADMIN
- Validation des formulaires côté client

## 📱 Responsive

Le composant est entièrement responsive :
- **Desktop** : Tableau complet avec toutes les colonnes
- **Mobile** : Tableau adapté avec colonnes réduites et padding ajusté

## 🚀 Utilisation

### Pour accéder à la gestion des catégories :

1. **Se connecter en tant qu'administrateur**
   - Email : admin@fermedirecte.com (ou votre compte admin)
   - Mot de passe : votre mot de passe admin

2. **Naviguer vers la gestion**
   - Cliquer sur "Catégories" dans le menu latéral (section Gestion)
   - Ou accéder directement à `/manage-categories`

3. **Créer une catégorie racine**
   - Remplir le nom (ex: "Fruits et légumes")
   - Ajouter une description (optionnel)
   - Laisser "Catégorie parente" sur "Aucune"
   - Cliquer sur "Créer"

4. **Créer une sous-catégorie**
   - Remplir le nom (ex: "Fruits")
   - Sélectionner une catégorie parente (ex: "Fruits et légumes")
   - Cliquer sur "Créer"

5. **Modifier une catégorie**
   - Cliquer sur l'icône crayon (✏️) dans le tableau
   - Modifier les champs souhaités
   - Cliquer sur "Enregistrer"

6. **Supprimer une catégorie**
   - Cliquer sur l'icône poubelle (🗑️)
   - Confirmer la suppression dans le dialogue
   - ⚠️ Impossible si la catégorie a des sous-catégories

## 🧪 Tests

### Tests manuels recommandés :

1. ✅ Créer une catégorie racine
2. ✅ Créer une sous-catégorie
3. ✅ Modifier une catégorie
4. ✅ Tenter de supprimer une catégorie avec sous-catégories (doit échouer)
5. ✅ Supprimer une catégorie sans sous-catégories
6. ✅ Vérifier l'affichage hiérarchique
7. ✅ Tester la validation du formulaire (nom vide)
8. ✅ Vérifier que seuls les admins peuvent accéder

## 📂 Fichiers modifiés/créés

### Créés :
- `frontend/src/app/components/manage-categories/manage-categories.component.ts`
- `frontend/src/app/components/manage-categories/manage-categories.component.html`
- `frontend/src/app/components/manage-categories/manage-categories.component.scss`

### Modifiés :
- `frontend/src/app/models/index.ts` - Ajout de `CategoryRequest`, mise à jour de `Category`
- `frontend/src/app/services/category.service.ts` - Ajout de méthodes CRUD complètes
- `frontend/src/app/app.module.ts` - Ajout de la route `/manage-categories`
- `frontend/src/app/components/layout/layout.component.html` - Ajout du lien menu

## 🎯 Prochaines améliorations possibles

- [ ] Upload d'images pour les catégories
- [ ] Drag & drop pour réorganiser la hiérarchie
- [ ] Recherche/filtrage dans la liste
- [ ] Export/Import de catégories
- [ ] Statistiques par catégorie
- [ ] Gestion des icônes personnalisées

## 📞 Support

En cas de problème :
1. Vérifier que le backend est démarré
2. Vérifier que vous êtes connecté en tant qu'ADMIN
3. Consulter la console du navigateur pour les erreurs
4. Vérifier les logs du backend

---

**Date de création :** 29 avril 2026  
**Version :** 1.0.0  
**Auteur :** Kiro AI Assistant
