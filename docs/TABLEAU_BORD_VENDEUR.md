# Tableau de Bord Vendeur - Documentation Complète

## Vue d'ensemble

Le tableau de bord vendeur est maintenant entièrement fonctionnel et offre une vue complète de l'activité du vendeur sur la plateforme FermeDirecte.

## Fonctionnalités Implémentées

### 1. **Statistiques Principales (4 Cartes)**

#### 📦 Mes Produits
- Affiche le nombre total de produits du vendeur
- Couleur : Vert
- Icône : inventory_2

#### 📋 Commandes en Attente
- Affiche le nombre de commandes en attente contenant les produits du vendeur
- Couleur : Bleu
- Icône : receipt_long

#### 💰 Mon Chiffre d'Affaires
- Affiche le revenu total généré par les ventes (hors commandes annulées)
- Format : XX.XX DT
- Couleur : Violet
- Icône : payments

#### ⚠️ Stock Faible
- Affiche le nombre de produits avec un stock < 10 unités
- Couleur : Orange
- Icône : warning_amber

---

### 2. **Graphique des Revenus (7 derniers jours)**

- **Visualisation** : Graphique en barres interactif
- **Période** : 7 derniers jours
- **Données affichées** :
  - Jour de la semaine (Lun, Mar, Mer, etc.)
  - Montant du revenu par jour
- **Interactivité** :
  - Survol pour voir le montant exact
  - Animation au chargement
  - Hauteur proportionnelle au revenu maximum

---

### 3. **Commandes Récentes**

- **Affichage** : Tableau avec les 5 dernières commandes
- **Colonnes** :
  - N° Commande (format monospace)
  - Montant (en DT)
  - Statut (badge coloré)
  - Date (format dd/MM/yyyy)
- **Statuts possibles** :
  - 🟠 En attente
  - 🔵 Confirmé
  - 🟣 En livraison
  - 🟢 Livré
  - 🔴 Annulé
- **Action** : Bouton "Voir toutes les commandes" → redirige vers `/orders`

---

### 4. **Produits en Stock Faible**

- **Affichage** : Liste des produits avec stock < 10
- **Informations affichées** :
  - Nom du produit
  - Prix unitaire
  - Nombre d'unités restantes
- **Badge de stock** :
  - 🟠 Orange : stock entre 5 et 9 unités
  - 🔴 Rouge (critique) : stock < 5 unités
- **État vide** : Message positif si tous les produits ont un stock suffisant
- **Action** : Bouton "Gérer mes produits" → redirige vers `/manage-products`

---

### 5. **Statistiques des Commandes**

Grille affichant la répartition des commandes par statut :

| Statistique | Description |
|------------|-------------|
| **Total** | Nombre total de commandes |
| **En attente** | Commandes non encore confirmées (🟠) |
| **Confirmées** | Commandes confirmées (🔵) |
| **En livraison** | Commandes en cours de livraison (🟣) |
| **Livrées** | Commandes livrées avec succès (🟢) |
| **Annulées** | Commandes annulées (🔴) |

Chaque statistique a une bordure colorée correspondant à son statut.

---

### 6. **Actions Rapides**

Trois boutons d'action rapide :

1. **➕ Ajouter un nouveau produit** (bouton principal)
   - Redirige vers `/manage-products/new`
   
2. **📦 Voir mes produits** (bouton secondaire)
   - Redirige vers `/manage-products`
   
3. **📋 Gérer mes commandes** (bouton secondaire)
   - Redirige vers `/orders`

---

## Architecture Backend

### DTO : `SellerDashboardResponse`

```java
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SellerDashboardResponse {
    private Long totalProduits;
    private Long commandesEnAttente;
    private BigDecimal revenuTotal;
    private Long produitsStockFaible;
    private List<Map<String, Object>> stockFaible;
    private List<Map<String, Object>> commandesRecentes;
    private List<Map<String, Object>> revenusParJour;
    private Map<String, Object> statistiquesCommandes;
}
```

### Service : `DashboardService.getSellerDashboard()`

**Calculs effectués** :

1. **Total produits** : Compte tous les produits du vendeur
2. **Commandes en attente** : Filtre les commandes avec statut `PENDING` contenant les produits du vendeur
3. **Revenu total** : Somme des montants de toutes les lignes de commande (hors annulées)
4. **Stock faible** : Liste des produits avec stock < 10, triés par stock croissant
5. **Commandes récentes** : 5 dernières commandes, triées par date décroissante
6. **Revenus par jour** : Calcul du revenu pour chacun des 7 derniers jours
7. **Statistiques commandes** : Comptage par statut (EN_ATTENTE, CONFIRME, EN_LIVRAISON, LIVRE, ANNULE)

### Endpoint API

```
GET /api/dashboard/seller
Authorization: Bearer <token>
Rôles autorisés: SELLER, ADMIN
```

---

## Architecture Frontend

### Modèle TypeScript : `SellerDashboard`

```typescript
export interface SellerDashboard {
  totalProduits: number;
  commandesEnAttente: number;
  revenuTotal: number;
  produitsStockFaible: number;
  stockFaible: Array<{ id: number; nom: string; stock: number; prix: number }>;
  commandesRecentes: Array<{ 
    id: number; 
    numeroCommande: string; 
    statut: string; 
    totalTTC: number; 
    dateCommande: string 
  }>;
  revenusParJour: Array<{ date: string; revenu: number }>;
  statistiquesCommandes: {
    total: number;
    enAttente: number;
    confirmees: number;
    enLivraison: number;
    livrees: number;
    annulees: number;
  };
}
```

### Composant : `DashboardComponent`

**Méthodes principales** :

- `loadSellerDashboard()` : Charge les données depuis l'API
- `getBarHeight(revenu)` : Calcule la hauteur proportionnelle des barres du graphique
- `formatDate(dateStr)` : Formate la date en jour de la semaine (Lun, Mar, etc.)
- `getStatusClass(statut)` : Retourne la classe CSS pour le badge de statut
- `getStatusLabel(statut)` : Retourne le libellé français du statut

---

## Styles et Design

### Palette de Couleurs

- **Vert** (#43a047) : Produits
- **Bleu** (#1e88e5) : Commandes
- **Violet** (#7b1fa2) : Revenus
- **Orange** (#fb8c00) : Alertes stock

### Responsive Design

- **Desktop** : Grille 4 colonnes pour les stats, 2 colonnes pour les sections
- **Tablette** (< 900px) : Sections en 1 colonne
- **Mobile** (< 600px) : Stats en grille 2x2

---

## Sécurité

- **Authentification** : Token JWT requis
- **Autorisation** : Rôles `SELLER` ou `ADMIN`
- **Isolation des données** : Chaque vendeur ne voit que ses propres données
- **Validation** : Vérification du profil vendeur via email

---

## Points Clés

✅ **Données en temps réel** : Toutes les statistiques sont calculées dynamiquement
✅ **Performance optimisée** : Utilisation de streams Java pour les calculs
✅ **Interface intuitive** : Design moderne avec Material Design
✅ **Responsive** : Adapté à tous les écrans
✅ **Accessibilité** : Utilisation de badges colorés et icônes claires
✅ **Navigation fluide** : Liens directs vers les sections pertinentes

---

## Améliorations Futures Possibles

1. **Graphiques avancés** : Intégration de Chart.js ou D3.js
2. **Filtres temporels** : Sélection de période personnalisée
3. **Export de données** : Export PDF/Excel des statistiques
4. **Notifications** : Alertes en temps réel pour stock faible
5. **Comparaison** : Comparaison avec la période précédente
6. **Prévisions** : Prédictions de ventes basées sur l'historique

---

## Utilisation

1. **Connexion** : Se connecter avec un compte vendeur
2. **Navigation** : Cliquer sur "Tableau de bord" dans le menu
3. **Consultation** : Visualiser toutes les statistiques en un coup d'œil
4. **Actions** : Utiliser les boutons d'action rapide pour gérer produits et commandes

---

## Support

Pour toute question ou problème, consulter :
- La documentation technique dans le code
- Les commentaires dans les fichiers source
- L'équipe de développement FermeDirecte
