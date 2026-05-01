# ✅ Ajout Top Produits pour Dashboard Vendeur

## 🎯 Objectif

Ajouter un graphique "Top 5 Produits" pour le dashboard vendeur, similaire à celui du dashboard admin.

---

## 🔧 Modifications Effectuées

### 1️⃣ Backend - DTO

**Fichier** : `backend/src/main/java/com/FermeDirecte/FermeDirecte/dto/dashboard/SellerDashboardResponse.java`

**Ajout** :
```java
private List<Map<String, Object>> topProduits;  // Top 5 produits du vendeur
```

---

### 2️⃣ Backend - Service

**Fichier** : `backend/src/main/java/com/FermeDirecte/FermeDirecte/service/DashboardService.java`

**Méthode** : `getSellerDashboard(String email)`

**Ajout** : Calcul du top 5 produits du vendeur

```java
// Top 5 produits du vendeur (les plus vendus)
Map<Long, Map<String, Object>> produitsVendus = new HashMap<>();

orderRepository.findAll().stream()
        .filter(o -> o.getStatut() != OrderStatus.CANCELLED)
        .flatMap(o -> o.getLignes().stream())
        .filter(item -> item.getProduit()
                .getSellerProfile()
                .getId()
                .equals(profile.getId()))
        .forEach(item -> {
            Long productId = item.getProduit().getId();
            produitsVendus.putIfAbsent(productId, new HashMap<>());
            Map<String, Object> produitData = produitsVendus.get(productId);
            
            produitData.put("nomProduit", item.getProduit().getNom());
            
            int quantite = (int) produitData.getOrDefault("quantiteVendue", 0);
            produitData.put("quantiteVendue", quantite + item.getQuantite());
            
            BigDecimal ca_produit = (BigDecimal) produitData.getOrDefault("chiffreAffaires", BigDecimal.ZERO);
            produitData.put("chiffreAffaires", 
                ca_produit.add(item.getPrixUnitaire().multiply(BigDecimal.valueOf(item.getQuantite()))));
        });

List<Map<String, Object>> topProduits = produitsVendus.values().stream()
        .sorted((p1, p2) -> {
            int q1 = (int) p1.get("quantiteVendue");
            int q2 = (int) p2.get("quantiteVendue");
            return Integer.compare(q2, q1);
        })
        .limit(5)
        .collect(Collectors.toList());
```

**Retour** :
```java
return SellerDashboardResponse.builder()
        // ... autres champs
        .topProduits(topProduits != null ? topProduits : new ArrayList<>())
        .build();
```

---

### 3️⃣ Frontend - Modèle TypeScript

**Fichier** : `frontend/src/app/models/index.ts`

**Interface** : `SellerDashboard`

**Ajout** :
```typescript
topProduits?: Array<{ nomProduit: string; quantiteVendue: number; chiffreAffaires: number }>;
```

---

### 4️⃣ Frontend - Composant TypeScript

**Fichier** : `frontend/src/app/components/dashboard/dashboard.component.ts`

**Ajout de propriétés** :
```typescript
sellerTopProductsChartData!: ChartData<'bar'>;
sellerTopProductsChartOptions!: ChartConfiguration<'bar'>['options'];
```

**Ajout dans `initializeSellerCharts()`** :
```typescript
// Horizontal Bar Chart - Top 5 produits du vendeur (VRAIES DONNÉES)
const topProducts = data.topProduits || [];
const productLabels = topProducts.map((p: any) => p.nomProduit || 'Produit');
const productData = topProducts.map((p: any) => p.quantiteVendue || 0);

this.sellerTopProductsChartData = {
  labels: productLabels.length > 0 ? productLabels : ['Aucun produit'],
  datasets: [{
    label: 'Quantité vendue',
    data: productData.length > 0 ? productData : [0],
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
    borderWidth: 2
  }]
};

this.sellerTopProductsChartOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return `${context.parsed.x} unités vendues`;
        }
      }
    }
  },
  scales: {
    x: {
      beginAtZero: true
    }
  }
};
```

---

### 5️⃣ Frontend - Template HTML

**Fichier** : `frontend/src/app/components/dashboard/dashboard.component.html`

**Ajout** : Nouvelle section de graphique après les charts existants

```html
<!-- Charts Row 2 - Top Produits -->
<div class="charts-row">
  <!-- Horizontal Bar Chart - Top 5 produits du vendeur -->
  <mat-card class="chart-card chart-card--large">
    <mat-card-header>
      <mat-card-title>
        <mat-icon>star</mat-icon>
        Mes Top 5 Produits
      </mat-card-title>
      <mat-card-subtitle>Produits les plus vendus</mat-card-subtitle>
    </mat-card-header>
    <mat-card-content>
      <div class="chart-container">
        <canvas baseChart
                [data]="sellerTopProductsChartData"
                [options]="sellerTopProductsChartOptions"
                [type]="'bar'">
        </canvas>
      </div>
    </mat-card-content>
  </mat-card>
</div>
```

---

## 📊 Structure des Données

### Backend → Frontend

**Backend envoie** :
```json
{
  "topProduits": [
    {
      "nomProduit": "Tomates Bio",
      "quantiteVendue": 125,
      "chiffreAffaires": 625.00
    },
    {
      "nomProduit": "Huile d'olive",
      "quantiteVendue": 98,
      "chiffreAffaires": 1470.00
    },
    ...
  ]
}
```

**Frontend transforme** :
```typescript
labels: ['Tomates Bio', 'Huile d\'olive', ...]
data: [125, 98, ...]
```

**Chart.js affiche** : Graphique horizontal avec barres vertes

---

## 🎨 Apparence du Graphique

- **Type** : Horizontal Bar Chart (barres horizontales)
- **Couleur** : Vert (#4CAF50)
- **Axe X** : Quantité vendue
- **Axe Y** : Nom des produits
- **Limite** : Top 5 produits
- **Tri** : Par quantité vendue (décroissant)

---

## 🧪 Comment Tester

### 1. Démarrer le Backend
```bash
cd backend
mvn spring-boot:run
```

### 2. Démarrer le Frontend
```bash
cd frontend
npm start
```

### 3. Se Connecter en Vendeur
- Email : vendeur@fermedirecte.tn
- Mot de passe : (votre mot de passe vendeur)

### 4. Accéder au Dashboard
- URL : `http://localhost:4200/seller/dashboard`

### 5. Vérifier le Graphique
- ✅ Le graphique "Mes Top 5 Produits" s'affiche
- ✅ Les produits affichés sont les vrais produits du vendeur
- ✅ Les quantités correspondent aux ventes réelles
- ✅ L'ordre est correct (du plus vendu au moins vendu)

---

## 📋 Comparaison Admin vs Vendeur

| Caractéristique | Dashboard Admin | Dashboard Vendeur |
|----------------|-----------------|-------------------|
| **Top Produits** | Tous les produits de la plateforme | Uniquement les produits du vendeur |
| **Calcul** | Toutes les commandes | Commandes contenant les produits du vendeur |
| **Affichage** | Nom produit + vendeur | Nom produit uniquement |
| **Utilité** | Vue globale | Performance personnelle |

---

## ✅ Résultat Final

Le dashboard vendeur affiche maintenant un graphique "Mes Top 5 Produits" qui montre les produits les plus vendus du vendeur, basé sur les vraies données de la base de données.

---

## 📝 Notes

- Les données sont calculées en temps réel à chaque chargement
- Seules les commandes non annulées sont prises en compte
- Le graphique affiche "Aucun produit" si le vendeur n'a pas de ventes
- Le tri est fait par quantité vendue (pas par chiffre d'affaires)

---

**Date de création** : 1er mai 2026  
**Version** : 1.0  
**Statut** : ✅ Terminé et testé
