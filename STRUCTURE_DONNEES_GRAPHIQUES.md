# 📊 Structure des Données - Graphiques Dashboard Admin

## 🔗 Flux de Données

```
┌─────────────────┐
│   Base MySQL    │
│  (Commandes,    │
│   Produits,     │
│  Utilisateurs)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  Backend Java (DashboardService.java)                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │ calculerRevenusParMois()                          │  │
│  │ calculerCommandesParStatut()                      │  │
│  │ calculerUtilisateursParRole()                     │  │
│  │ calculerTopProduits()                             │  │
│  └───────────────────────────────────────────────────┘  │
└────────┬────────────────────────────────────────────────┘
         │
         ▼ GET /dashboard/admin
┌─────────────────────────────────────────────────────────┐
│  AdminDashboardResponse (DTO)                           │
│  {                                                       │
│    revenusParMois: [...],                               │
│    commandesParStatut: {...},                           │
│    utilisateursParRole: {...},                          │
│    topProduits: [...]                                   │
│  }                                                       │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  Frontend Angular (dashboard.component.ts)              │
│  ┌───────────────────────────────────────────────────┐  │
│  │ initializeAdminCharts(data)                       │  │
│  │   - Line Chart (data.revenusParMois)              │  │
│  │   - Bar Chart (data.commandesParStatut)           │  │
│  │   - Donut Chart (data.utilisateursParRole)        │  │
│  │   - Horizontal Bar (data.topProduits)             │  │
│  └───────────────────────────────────────────────────┘  │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  Chart.js (ng2-charts)                                  │
│  Affichage des graphiques dans le navigateur            │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Structure des Données Backend

### 1️⃣ revenusParMois

**Type** : `List<Map<String, Object>>`

**Structure** :
```json
[
  {
    "mois": "JANUARY",
    "annee": 2026,
    "revenu": 1250.50
  },
  {
    "mois": "FEBRUARY",
    "annee": 2026,
    "revenu": 1580.75
  },
  ...
]
```

**Calcul** :
```java
// Pour chaque mois des 12 derniers mois
BigDecimal revenuMois = commandes.stream()
    .filter(o -> o.getStatut() != OrderStatus.CANCELLED)
    .filter(o -> dateCommande dans le mois)
    .map(Order::getTotalTTC)
    .reduce(BigDecimal.ZERO, BigDecimal::add);
```

**Utilisation Frontend** :
```typescript
const revenueLabels = data.revenusParMois?.map(r => {
  const monthIndex = this.getMonthIndex(r.mois);
  return monthNames[monthIndex];
});
const revenueData = data.revenusParMois?.map(r => r.revenu);
```

---

### 2️⃣ commandesParStatut

**Type** : `Map<String, Long>`

**Structure** :
```json
{
  "EN_ATTENTE": 5,
  "EN_COURS": 12,
  "LIVRE": 28,
  "ANNULE": 3
}
```

**Calcul** :
```java
commandesParStatut.put("EN_ATTENTE", 
    commandes.stream().filter(o -> o.getStatut() == OrderStatus.PENDING).count());
commandesParStatut.put("EN_COURS", 
    commandes.stream().filter(o -> o.getStatut() == OrderStatus.PAID || 
                                    o.getStatut() == OrderStatus.PROCESSING).count());
commandesParStatut.put("LIVRE", 
    commandes.stream().filter(o -> o.getStatut() == OrderStatus.DELIVERED).count());
commandesParStatut.put("ANNULE", 
    commandes.stream().filter(o -> o.getStatut() == OrderStatus.CANCELLED).count());
```

**Utilisation Frontend** :
```typescript
const commandesStats = data.commandesParStatut || { EN_ATTENTE: 0, EN_COURS: 0, LIVRE: 0, ANNULE: 0 };
data: [
  commandesStats.EN_ATTENTE || 0,
  commandesStats.EN_COURS || 0,
  commandesStats.LIVRE || 0,
  commandesStats.ANNULE || 0
]
```

---

### 3️⃣ utilisateursParRole

**Type** : `Map<String, Long>`

**Structure** :
```json
{
  "CUSTOMER": 45,
  "SELLER": 8,
  "ADMIN": 2
}
```

**Calcul** :
```java
List<User> users = userRepository.findAll();
utilisateursParRole.put("CUSTOMER", 
    users.stream().filter(u -> u.getRole() == Role.CUSTOMER).count());
utilisateursParRole.put("SELLER", 
    users.stream().filter(u -> u.getRole() == Role.SELLER).count());
utilisateursParRole.put("ADMIN", 
    users.stream().filter(u -> u.getRole() == Role.ADMIN).count());
```

**Utilisation Frontend** :
```typescript
const usersStats = data.utilisateursParRole || { CUSTOMER: 0, SELLER: 0, ADMIN: 0 };
data: [
  usersStats.CUSTOMER || 0,
  usersStats.SELLER || 0,
  usersStats.ADMIN || 0
]
```

---

### 4️⃣ topProduits

**Type** : `List<Map<String, Object>>`

**Structure** :
```json
[
  {
    "nomProduit": "Tomates Bio",
    "vendeur": "Ferme du Soleil",
    "quantiteVendue": 125,
    "chiffreAffaires": 625.00
  },
  {
    "nomProduit": "Huile d'olive",
    "vendeur": "Oliveraie du Cap Bon",
    "quantiteVendue": 98,
    "chiffreAffaires": 1470.00
  },
  ...
]
```

**Calcul** :
```java
// Grouper par produit et calculer quantité vendue
Map<Long, Map<String, Object>> produitsVendus = new HashMap<>();
commandes.stream()
    .filter(o -> o.getStatut() != OrderStatus.CANCELLED)
    .flatMap(o -> o.getLignes().stream())
    .forEach(item -> {
        Long productId = item.getProduit().getId();
        produitsVendus.putIfAbsent(productId, new HashMap<>());
        Map<String, Object> produitData = produitsVendus.get(productId);
        
        produitData.put("nomProduit", item.getProduit().getNom());
        produitData.put("vendeur", item.getProduit().getSellerProfile().getNomBoutique());
        
        int quantite = (int) produitData.getOrDefault("quantiteVendue", 0);
        produitData.put("quantiteVendue", quantite + item.getQuantite());
    });

// Trier par quantité et prendre le top 5
List<Map<String, Object>> topProduits = produitsVendus.values().stream()
    .sorted((p1, p2) -> Integer.compare(
        (int) p2.get("quantiteVendue"), 
        (int) p1.get("quantiteVendue")))
    .limit(5)
    .collect(Collectors.toList());
```

**Utilisation Frontend** :
```typescript
const topProducts = data.topProduits || [];
const productLabels = topProducts.map((p: any) => p.nomProduit || 'Produit');
const productData = topProducts.map((p: any) => p.quantiteVendue || 0);
```

---

## 🔄 Transformation des Données

### Exemple Complet : Line Chart

#### Étape 1 : Backend calcule les revenus
```java
// DashboardService.java
List<Map<String, Object>> revenusParMois = calculerRevenusParMois(commandes);
// Résultat : [
//   { mois: "JANUARY", annee: 2026, revenu: 1250.50 },
//   { mois: "FEBRUARY", annee: 2026, revenu: 1580.75 },
//   ...
// ]
```

#### Étape 2 : Backend envoie la réponse
```java
// AdminDashboardResponse.java
return AdminDashboardResponse.builder()
    .revenusParMois(revenusParMois)
    .build();
```

#### Étape 3 : Frontend reçoit les données
```typescript
// dashboard.component.ts
this.dashService.getAdminDashboard().subscribe({
  next: (data) => {
    // data.revenusParMois = [
    //   { mois: "JANUARY", annee: 2026, revenu: 1250.50 },
    //   { mois: "FEBRUARY", annee: 2026, revenu: 1580.75 },
    //   ...
    // ]
    this.initializeAdminCharts(data);
  }
});
```

#### Étape 4 : Frontend transforme pour Chart.js
```typescript
// dashboard.component.ts
const monthNames = ['Jan', 'Fév', 'Mar', ...];
const revenueLabels = data.revenusParMois?.map(r => {
  const monthIndex = this.getMonthIndex(r.mois); // JANUARY -> 0
  return monthNames[monthIndex]; // 0 -> "Jan"
});
// revenueLabels = ['Jan', 'Fév', 'Mar', ...]

const revenueData = data.revenusParMois?.map(r => r.revenu);
// revenueData = [1250.50, 1580.75, ...]
```

#### Étape 5 : Chart.js affiche le graphique
```typescript
this.adminRevenueChartData = {
  labels: revenueLabels,  // ['Jan', 'Fév', 'Mar', ...]
  datasets: [{
    label: 'Chiffre d\'affaires (DT)',
    data: revenueData  // [1250.50, 1580.75, ...]
  }]
};
```

---

## 📊 Mapping des Données

| Backend (Java) | Frontend (TypeScript) | Chart.js |
|----------------|----------------------|----------|
| `revenusParMois[].mois` | `getMonthIndex()` → `monthNames[]` | `labels[]` |
| `revenusParMois[].revenu` | `revenueData[]` | `datasets[0].data[]` |
| `commandesParStatut.EN_ATTENTE` | `commandesStats.EN_ATTENTE` | `datasets[0].data[0]` |
| `utilisateursParRole.CUSTOMER` | `usersStats.CUSTOMER` | `datasets[0].data[0]` |
| `topProduits[].nomProduit` | `productLabels[]` | `labels[]` |
| `topProduits[].quantiteVendue` | `productData[]` | `datasets[0].data[]` |

---

## 🎯 Points Clés

1. **Backend** : Calcule les données réelles à partir de la base MySQL
2. **DTO** : Transporte les données du backend au frontend
3. **Frontend** : Transforme les données pour Chart.js
4. **Chart.js** : Affiche les graphiques dans le navigateur

5. **Pas de données simulées** : Toutes les données proviennent de la base
6. **Calculs en temps réel** : Les données sont recalculées à chaque requête
7. **Gestion des cas vides** : Utilisation de `|| []` et `|| 0` pour éviter les erreurs

---

## ✅ Validation

Pour vérifier que les données sont correctes :

1. **Backend** : Vérifier les logs et l'API `/dashboard/admin`
2. **Frontend** : Vérifier la console du navigateur (F12 → Network → Response)
3. **Graphiques** : Vérifier que les valeurs correspondent aux données de la base

---

**Date de création** : 1er mai 2026  
**Version** : 1.0  
**Statut** : ✅ Documenté
