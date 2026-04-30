# 🚀 Guide de démarrage rapide - Gestion des catégories

## 📋 Prérequis

- Backend Spring Boot démarré (port 8080)
- Frontend Angular démarré (port 4200)
- Compte administrateur créé

## 🎯 Étapes rapides

### 1. Démarrer l'application

#### Backend
```bash
cd ferme-directe-complete/backend
mvn spring-boot:run
```

#### Frontend
```bash
cd ferme-directe-complete/frontend
ng serve
```

### 2. Se connecter en tant qu'admin

1. Ouvrir le navigateur : `http://localhost:4200`
2. Cliquer sur "Se connecter"
3. Utiliser les identifiants admin :
   - Email : `admin@fermedirecte.com`
   - Mot de passe : `[votre mot de passe admin]`

### 3. Accéder à la gestion des catégories

**Option 1 :** Via le menu
- Cliquer sur le menu hamburger (☰)
- Section "Gestion"
- Cliquer sur "Catégories" 📦

**Option 2 :** URL directe
- Naviguer vers : `http://localhost:4200/manage-categories`

## 🎨 Utilisation de l'interface

### Créer une catégorie racine

1. Dans le formulaire en haut :
   - **Nom** : "Fruits et légumes"
   - **Description** : "Produits frais du potager"
   - **Catégorie parente** : Laisser sur "Aucune (catégorie racine)"
2. Cliquer sur **"Créer"** ✅

### Créer une sous-catégorie

1. Dans le formulaire :
   - **Nom** : "Fruits"
   - **Description** : "Fruits de saison"
   - **Catégorie parente** : Sélectionner "Fruits et légumes"
2. Cliquer sur **"Créer"** ✅

### Modifier une catégorie

1. Dans le tableau, trouver la catégorie
2. Cliquer sur l'icône **crayon** ✏️
3. Modifier les champs souhaités
4. Cliquer sur **"Enregistrer"** 💾

### Supprimer une catégorie

1. Dans le tableau, trouver la catégorie
2. Cliquer sur l'icône **poubelle** 🗑️
3. Confirmer la suppression

⚠️ **Note** : Impossible de supprimer une catégorie qui a des sous-catégories

## 📊 Exemple de structure hiérarchique

```
📁 Fruits et légumes (racine)
  ├── 🍎 Fruits
  │   ├── 🍑 Fruits à noyau
  │   ├── 🍏 Fruits à pépins
  │   └── 🍓 Fruits rouges
  ├── 🥕 Légumes
  │   ├── 🥔 Légumes racines
  │   ├── 🥬 Légumes feuilles
  │   └── 🍅 Légumes fruits
  └── 🌿 Herbes aromatiques

📁 Produits laitiers (racine)
  ├── 🧀 Fromages
  │   ├── Fromages à pâte dure
  │   ├── Fromages à pâte molle
  │   └── Fromages de chèvre
  ├── 🥛 Lait
  ├── 🍦 Yaourts
  └── 🧈 Crème et beurre
```

## 🗄️ Charger des données de test

Si vous voulez charger des catégories d'exemple :

### Option 1 : Via l'interface (recommandé)
Créer manuellement les catégories via l'interface web

### Option 2 : Via SQL
```bash
# Se connecter à votre base de données
mysql -u root -p ferme_directe

# Exécuter le script
source CATEGORIES_TEST_DATA.sql
```

## ✅ Vérification

### Backend
Tester les endpoints avec curl ou Postman :

```bash
# Récupérer toutes les catégories
curl http://localhost:8080/api/categories

# Créer une catégorie (nécessite token JWT)
curl -X POST http://localhost:8080/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "description": "Catégorie de test"
  }'
```

### Frontend
1. Vérifier que le menu "Catégories" est visible (admin uniquement)
2. Créer une catégorie de test
3. Vérifier qu'elle apparaît dans le tableau
4. Modifier et supprimer la catégorie de test

## 🐛 Dépannage

### Le menu "Catégories" n'apparaît pas
- ✅ Vérifier que vous êtes connecté en tant qu'ADMIN
- ✅ Rafraîchir la page (F5)
- ✅ Vider le cache du navigateur

### Erreur 403 (Forbidden)
- ✅ Vérifier que votre token JWT est valide
- ✅ Se reconnecter
- ✅ Vérifier que votre compte a le rôle ADMIN

### Erreur 500 (Internal Server Error)
- ✅ Vérifier que le backend est démarré
- ✅ Consulter les logs du backend
- ✅ Vérifier la connexion à la base de données

### Le formulaire ne se soumet pas
- ✅ Vérifier que le champ "Nom" est rempli (obligatoire)
- ✅ Vérifier qu'il contient au moins 2 caractères
- ✅ Ouvrir la console du navigateur (F12) pour voir les erreurs

## 📱 Captures d'écran attendues

### Vue du formulaire
- Carte verte avec titre "Nouvelle catégorie"
- 3 champs : Nom, Description, Catégorie parente
- Bouton "Créer" en bas

### Vue du tableau
- Carte bleue avec titre "Liste des catégories"
- Colonnes : Nom, Description, Catégorie parente, Sous-catégories, Actions
- Indentation visuelle pour les sous-catégories
- Icônes d'édition et suppression

## 🎓 Bonnes pratiques

1. **Nommage** : Utiliser des noms clairs et descriptifs
2. **Hiérarchie** : Ne pas dépasser 3 niveaux de profondeur
3. **Description** : Ajouter une description pour faciliter la compréhension
4. **Organisation** : Créer d'abord les catégories racines, puis les sous-catégories
5. **Suppression** : Supprimer d'abord les sous-catégories avant la catégorie parente

## 📞 Support

En cas de problème :
1. Consulter `GESTION_CATEGORIES.md` pour la documentation complète
2. Vérifier les logs du backend : `backend/logs/`
3. Vérifier la console du navigateur (F12)
4. Vérifier que tous les services sont démarrés

---

**Temps estimé pour le premier test :** 5 minutes ⏱️  
**Difficulté :** Facile 🟢
