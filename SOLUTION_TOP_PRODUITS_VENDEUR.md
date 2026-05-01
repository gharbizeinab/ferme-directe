# 🔧 Solution : Graphique Top Produits Vendeur

## 📋 Problème

Le graphique "Top 5 Produits" ne s'affiche pas dans le dashboard vendeur.

## ✅ Code Implémenté

### Backend (`DashboardService.java`)

Le backend calcule correctement le top 5 des produits :

```java
// Top 5 produits les plus vendus du vendeur
List<Object[]> topProduitsData = orderItemRepository.findTopProductsBySeller(sellerId, PageRequest.of(0, 5));
List<TopProductDTO> topProduits = topProduitsData.stream()
    .map(row -> new TopProductDTO(
        (String) row[0],  // nomProduit
        ((Number) row[1]).longValue()  // quantiteVendue
    ))
    .collect(Collectors.toList());

response.setTopProduits(topProduits);
```

### Frontend (`dashboard.component.ts`)

Le frontend initialise correctement le graphique :

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

### Frontend (`dashboard.component.html`)

Le template affiche correctement le graphique :

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

## 🔍 Diagnostic

### Étape 1 : Vérifier la Console du Navigateur

Ouvrir les outils de développement (F12) et vérifier :

1. **Onglet Console** - Rechercher les erreurs JavaScript
2. **Onglet Network** - Vérifier l'appel API `/api/dashboard/seller`
3. **Vérifier la réponse JSON** - S'assurer que `topProduits` est présent

### Étape 2 : Vérifier les Données Backend

Exécuter cette requête SQL pour vérifier s'il y a des données :

```sql
-- Vérifier les commandes du vendeur
SELECT 
    p.nom as nomProduit,
    SUM(oi.quantite) as quantiteVendue
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN orders o ON oi.order_id = o.id
WHERE p.seller_id = [ID_DU_VENDEUR]
GROUP BY p.id, p.nom
ORDER BY quantiteVendue DESC
LIMIT 5;
```

### Étape 3 : Créer des Données de Test

Si la base de données est vide, créer des commandes de test :

```sql
-- 1. Créer un vendeur de test (si nécessaire)
INSERT INTO users (email, password, nom, prenom, role, telephone, actif)
VALUES ('vendeur@test.com', '$2a$10$...', 'Vendeur', 'Test', 'SELLER', '0612345678', true);

-- 2. Créer des produits pour ce vendeur
INSERT INTO products (nom, description, prix, stock, seller_id, category_id, actif)
VALUES 
('Tomates Bio', 'Tomates fraîches', 5.50, 100, [ID_VENDEUR], 1, true),
('Carottes Bio', 'Carottes du jardin', 3.20, 80, [ID_VENDEUR], 1, true),
('Pommes', 'Pommes Golden', 4.00, 50, [ID_VENDEUR], 2, true);

-- 3. Créer un client de test
INSERT INTO users (email, password, nom, prenom, role, telephone, actif)
VALUES ('client@test.com', '$2a$10$...', 'Client', 'Test', 'CUSTOMER', '0698765432', true);

-- 4. Créer une commande
INSERT INTO orders (numero_commande, user_id, total_ht, total_ttc, statut, statut_paiement, date_commande)
VALUES ('CMD-TEST-001', [ID_CLIENT], 50.00, 55.00, 'DELIVERED', 'PAYE', NOW());

-- 5. Ajouter des articles à la commande
INSERT INTO order_items (order_id, product_id, quantite, prix_unitaire)
VALUES 
([ID_COMMANDE], [ID_TOMATES], 5, 5.50),
([ID_COMMANDE], [ID_CAROTTES], 3, 3.20),
([ID_COMMANDE], [ID_POMMES], 2, 4.00);
```

## 🎯 Solutions Possibles

### Solution 1 : Pas de Données

**Symptôme :** Le graphique affiche "Aucun produit"

**Cause :** Aucune commande n'a été passée pour les produits du vendeur

**Solution :** Créer des commandes de test (voir SQL ci-dessus)

### Solution 2 : Erreur API

**Symptôme :** Erreur dans la console "404 Not Found" ou "500 Internal Server Error"

**Cause :** Problème backend ou route incorrecte

**Solution :**
1. Vérifier que le backend est démarré
2. Vérifier l'URL de l'API dans `dashboard.service.ts`
3. Vérifier les logs du backend

### Solution 3 : Problème de Mapping

**Symptôme :** Le graphique ne s'affiche pas mais pas d'erreur

**Cause :** Les noms de propriétés ne correspondent pas

**Solution :** Vérifier que le DTO backend correspond au modèle frontend :

**Backend (`TopProductDTO.java`) :**
```java
public class TopProductDTO {
    private String nomProduit;
    private Long quantiteVendue;
    // getters/setters
}
```

**Frontend (`index.ts`) :**
```typescript
export interface TopProduct {
  nomProduit: string;
  quantiteVendue: number;
}
```

### Solution 4 : Problème ng2-charts

**Symptôme :** Erreur "Cannot read property 'datasets' of undefined"

**Cause :** ng2-charts n'est pas correctement initialisé

**Solution :**
1. Vérifier que `ng2-charts` est installé : `npm list ng2-charts`
2. Vérifier que `Chart.js` est installé : `npm list chart.js`
3. Réinstaller si nécessaire : `npm install ng2-charts chart.js`

## 📝 Checklist de Débogage

- [ ] Ouvrir la console du navigateur (F12)
- [ ] Se connecter comme vendeur
- [ ] Aller sur le dashboard
- [ ] Vérifier l'onglet Network pour l'appel `/api/dashboard/seller`
- [ ] Vérifier que la réponse contient `topProduits`
- [ ] Vérifier qu'il n'y a pas d'erreur JavaScript
- [ ] Vérifier que le graphique est visible dans le DOM
- [ ] Si vide, créer des données de test
- [ ] Rafraîchir la page

## 🔧 Commandes Utiles

### Vérifier les Logs Backend
```bash
# Voir les logs en temps réel
tail -f logs/application.log
```

### Recompiler le Frontend
```bash
cd frontend
npm run build
```

### Redémarrer le Backend
```bash
cd backend
mvn spring-boot:run
```

## ✅ Résultat Attendu

Une fois le problème résolu, le dashboard vendeur devrait afficher :

1. **Graphique "Mes Top 5 Produits"** avec :
   - Barres horizontales vertes
   - Noms des produits sur l'axe Y
   - Quantités vendues sur l'axe X
   - Tooltip au survol

2. **Si aucune donnée :**
   - Une seule barre avec "Aucun produit"
   - Valeur 0

---

**Date :** 1er mai 2026  
**Statut :** Code implémenté, en attente de test avec données réelles  
**Prochaine étape :** Tester avec un compte vendeur ayant des commandes
