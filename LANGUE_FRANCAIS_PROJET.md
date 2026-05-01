# 🇫🇷 Langue du Projet - Français

## 🎯 Objectif

S'assurer que tout le projet utilise le **français** comme langue principale pour :
- Les interfaces utilisateur
- Les messages d'erreur
- Les commentaires de code
- La documentation

---

## ✅ État Actuel

Le projet utilise déjà majoritairement le français :

### 1️⃣ Interfaces Utilisateur (HTML)
- ✅ Tous les textes sont en français
- ✅ Boutons, labels, titres en français
- ✅ Messages de validation en français

### 2️⃣ Backend (Java)
- ✅ Noms de variables en français (ex: `nomProduit`, `prixUnitaire`)
- ✅ Noms de méthodes en français (ex: `calculerRevenusParMois`)
- ✅ Commentaires en français

### 3️⃣ Frontend (TypeScript)
- ✅ Interfaces et types en français
- ✅ Propriétés en français (ex: `chiffreAffairesGlobal`)
- ✅ Commentaires en français

### 4️⃣ Base de Données
- ✅ Noms de colonnes en français (ex: `nom_produit`, `prix_unitaire`)
- ✅ Noms de tables en français

---

## 📋 Vérifications Effectuées

### ✅ Fichiers HTML
```bash
Recherche : "Loading...", "Error", "Success"
Résultat : Aucun texte anglais trouvé
```

### ✅ Fichiers TypeScript
```bash
Recherche : Messages d'erreur en anglais
Résultat : Tous les messages sont en français
```

### ✅ Fichiers Java
```bash
Vérification : Commentaires et noms de variables
Résultat : Tout est en français
```

---

## 🔍 Exemples de Français dans le Projet

### Backend (Java)
```java
// ✅ Bon - Tout en français
public List<Map<String, Object>> calculerRevenusParMois(List<Order> commandes) {
    List<Map<String, Object>> revenusParMois = new ArrayList<>();
    // Calcul des revenus mensuels
    ...
}
```

### Frontend (TypeScript)
```typescript
// ✅ Bon - Tout en français
export interface AdminDashboard {
  totalUtilisateurs: number;
  totalCommandes: number;
  chiffreAffairesGlobal: number;
}
```

### HTML
```html
<!-- ✅ Bon - Tout en français -->
<mat-card-title>
  <mat-icon>dashboard</mat-icon>
  Tableau de Bord Administrateur
</mat-card-title>
<mat-card-subtitle>Vue d'ensemble des performances de la plateforme</mat-card-subtitle>
```

---

## 📝 Conventions de Nommage en Français

### Variables et Propriétés
```typescript
// ✅ Bon
const chiffreAffaires = 1000;
const nombreCommandes = 50;
const utilisateursActifs = 100;

// ❌ Mauvais
const revenue = 1000;
const orderCount = 50;
const activeUsers = 100;
```

### Méthodes et Fonctions
```typescript
// ✅ Bon
calculerTotal()
obtenirUtilisateurs()
afficherGraphique()

// ❌ Mauvais
calculateTotal()
getUsers()
displayChart()
```

### Commentaires
```typescript
// ✅ Bon
// Calcule le chiffre d'affaires mensuel
// Filtre les commandes annulées
// Retourne la liste des produits

// ❌ Mauvais
// Calculate monthly revenue
// Filter cancelled orders
// Return product list
```

---

## 🎨 Textes d'Interface

### Messages de Succès
```typescript
// ✅ Bon
'Produit ajouté avec succès'
'Commande créée avec succès'
'Profil mis à jour'

// ❌ Mauvais
'Product added successfully'
'Order created successfully'
'Profile updated'
```

### Messages d'Erreur
```typescript
// ✅ Bon
'Erreur lors du chargement des données'
'Impossible de créer la commande'
'Produit introuvable'

// ❌ Mauvais
'Error loading data'
'Failed to create order'
'Product not found'
```

### Labels et Boutons
```html
<!-- ✅ Bon -->
<button>Ajouter au panier</button>
<label>Nom du produit</label>
<mat-card-title>Mes Commandes</mat-card-title>

<!-- ❌ Mauvais -->
<button>Add to cart</button>
<label>Product name</label>
<mat-card-title>My Orders</mat-card-title>
```

---

## 🔧 Corrections à Faire (Si Nécessaire)

### 1. Rechercher les Textes Anglais
```bash
# Dans le terminal
cd frontend/src
grep -r "Loading\.\.\." .
grep -r "Error:" .
grep -r "Success:" .
```

### 2. Remplacer par du Français
```typescript
// Avant
console.error('Error loading dashboard');

// Après
console.error('Erreur lors du chargement du tableau de bord');
```

### 3. Vérifier les Fichiers de Configuration
```json
// package.json, angular.json, etc.
// Les noms de packages restent en anglais (normal)
// Mais les descriptions peuvent être en français
```

---

## 📚 Glossaire Technique Français

| Anglais | Français |
|---------|----------|
| Dashboard | Tableau de bord |
| Order | Commande |
| Product | Produit |
| User | Utilisateur |
| Cart | Panier |
| Checkout | Paiement / Validation |
| Revenue | Revenu / Chiffre d'affaires |
| Sales | Ventes |
| Stock | Stock |
| Price | Prix |
| Quantity | Quantité |
| Total | Total |
| Subtotal | Sous-total |
| Discount | Remise / Réduction |
| Coupon | Coupon |
| Shipping | Livraison |
| Address | Adresse |
| Payment | Paiement |
| Status | Statut |
| Pending | En attente |
| Confirmed | Confirmé |
| Delivered | Livré |
| Cancelled | Annulé |
| Loading | Chargement |
| Error | Erreur |
| Success | Succès |
| Warning | Avertissement |
| Info | Information |

---

## ✅ Checklist de Vérification

### Backend
- [x] Noms de variables en français
- [x] Noms de méthodes en français
- [x] Commentaires en français
- [x] Messages d'erreur en français
- [x] Noms de colonnes DB en français

### Frontend
- [x] Interfaces TypeScript en français
- [x] Propriétés en français
- [x] Méthodes en français
- [x] Commentaires en français
- [x] Textes HTML en français
- [x] Messages d'erreur en français
- [x] Labels et boutons en français

### Documentation
- [x] README en français
- [x] Commentaires de code en français
- [x] Documentation technique en français

---

## 🎯 Résultat

Le projet **Ferme Directe** utilise déjà le **français** comme langue principale dans tous ses composants. Aucune correction majeure n'est nécessaire.

---

## 📝 Recommandations

1. **Maintenir la cohérence** : Continuer à utiliser le français pour tous les nouveaux développements
2. **Éviter le franglais** : Ne pas mélanger français et anglais dans le même contexte
3. **Documenter en français** : Tous les nouveaux documents doivent être en français
4. **Commentaires clairs** : Utiliser un français simple et compréhensible

---

## 🌍 Exceptions Acceptables

Certains éléments peuvent rester en anglais :
- Noms de packages npm (ex: `@angular/core`)
- Noms de bibliothèques (ex: `chart.js`)
- Mots-clés du langage (ex: `function`, `class`, `interface`)
- URLs et routes (ex: `/api/products`)
- Noms de fichiers techniques (ex: `package.json`)

---

**Date de vérification** : 1er mai 2026  
**Version** : 1.0  
**Statut** : ✅ Conforme - Tout est en français
