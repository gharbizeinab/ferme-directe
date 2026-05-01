# 🐛 Debug - Top Produits Vendeur Ne S'affiche Pas

## 🎯 Problème

Le graphique "Mes Top 5 Produits" ne s'affiche pas dans le dashboard vendeur.

---

## 🔍 Diagnostic

### Étape 1 : Vérifier les Logs Console

1. **Ouvrir la console du navigateur** : F12 → Console
2. **Se connecter en tant que vendeur**
3. **Accéder au dashboard** : `/seller/dashboard`
4. **Chercher les logs** :
   ```
   === Initialisation des graphiques vendeur ===
   Données reçues: {...}
   topProduits: [...]
   ```

### Étape 2 : Vérifier les Données Backend

#### Test de l'API
```bash
# Ouvrir dans le navigateur ou Postman
GET http://localhost:8080/dashboard/seller
```

**Réponse attendue** :
```json
{
  "totalProduits": 5,
  "commandesEnAttente": 2,
  "revenuTotal": 1500.00,
  "produitsStockFaible": 1,
  "topProduits": [
    {
      "nomProduit": "Tomates Bio",
      "quantiteVendue": 125,
      "chiffreAffaires": 625.00
    },
    ...
  ],
  ...
}
```

**Si `topProduits` est absent ou vide** → Problème backend

---

## 🔧 Solutions Possibles

### Solution 1 : Vérifier que le Backend Renvoie les Données

#### Vérifier le fichier Java
`backend/src/main/java/com/FermeDirecte/FermeDirecte/service/DashboardService.java`

**Méthode** : `getSellerDashboard(String email)`

**Vérifier que cette ligne existe** :
```java
return SellerDashboardResponse.builder()
        // ... autres champs
        .topProduits(topProduits != null ? topProduits : new ArrayList<>())
        .build();
```

**Si la ligne est absente** → Ajouter `.topProduits(topProduits)`

---

### Solution 2 : Vérifier le DTO

#### Vérifier le fichier Java
`backend/src/main/java/com/FermeDirecte/FermeDirecte/dto/dashboard/SellerDashboardResponse.java`

**Vérifier que ce champ existe** :
```java
private List<Map<String, Object>> topProduits;
```

**Si le champ est absent** → Ajouter le champ

---

### Solution 3 : Vérifier le Modèle TypeScript

#### Vérifier le fichier TypeScript
`frontend/src/app/models/index.ts`

**Interface** : `SellerDashboard`

**Vérifier que ce champ existe** :
```typescript
export interface SellerDashboard {
  // ... autres champs
  topProduits?: Array<{ nomProduit: string; quantiteVendue: number; chiffreAffaires: number }>;
}
```

**Si le champ est absent** → Ajouter le champ

---

### Solution 4 : Vérifier qu'il y a des Données de Test

#### Problème : Pas de Ventes
Si le vendeur n'a pas de ventes, `topProduits` sera vide.

**Solution** : Créer des commandes de test

1. Se connecter en tant que client
2. Ajouter des produits du vendeur au panier
3. Passer une commande
4. Retourner au dashboard vendeur
5. Le graphique devrait maintenant s'afficher

---

### Solution 5 : Recompiler le Frontend

```bash
cd frontend
npm run build
npm start
```

---

### Solution 6 : Vider le Cache du Navigateur

1. **Chrome/Edge** : Ctrl + Shift + R
2. **Firefox** : Ctrl + F5
3. Ou vider le cache manuellement

---

## 🧪 Tests de Vérification

### Test 1 : Vérifier l'API Backend

```bash
# Dans le terminal
curl http://localhost:8080/dashboard/seller \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Résultat attendu** : JSON avec `topProduits`

---

### Test 2 : Vérifier les Logs Console

**Console du navigateur** :
```
=== Initialisation des graphiques vendeur ===
Données reçues: {topProduits: Array(5), ...}
topProduits: [{nomProduit: "Tomates Bio", quantiteVendue: 125, ...}, ...]
productLabels: ["Tomates Bio", "Huile d'olive", ...]
productData: [125, 98, ...]
sellerTopProductsChartData: {labels: Array(5), datasets: Array(1)}
=== Fin initialisation graphiques vendeur ===
```

**Si les logs ne s'affichent pas** → Le composant ne se charge pas

**Si `topProduits` est vide** → Pas de données dans la base

---

### Test 3 : Vérifier le HTML

**Inspecter l'élément** (F12 → Elements)

Chercher :
```html
<canvas baseChart
        [data]="sellerTopProductsChartData"
        [options]="sellerTopProductsChartOptions"
        [type]="'bar'">
</canvas>
```

**Si l'élément n'existe pas** → Problème de template

**Si l'élément existe mais est vide** → Problème de données

---

## 📋 Checklist de Débogage

### Backend
- [ ] Le fichier `DashboardService.java` contient le calcul de `topProduits`
- [ ] Le fichier `SellerDashboardResponse.java` contient le champ `topProduits`
- [ ] Le backend compile sans erreur
- [ ] L'API `/dashboard/seller` renvoie `topProduits` dans la réponse

### Frontend
- [ ] Le fichier `index.ts` contient le champ `topProduits` dans `SellerDashboard`
- [ ] Le fichier `dashboard.component.ts` initialise `sellerTopProductsChartData`
- [ ] Le fichier `dashboard.component.html` contient le canvas pour le graphique
- [ ] Le frontend compile sans erreur TypeScript
- [ ] Les logs console s'affichent correctement

### Données
- [ ] Il existe des commandes dans la base de données
- [ ] Les commandes contiennent des produits du vendeur
- [ ] Les commandes ne sont pas annulées
- [ ] Le vendeur a au moins un produit vendu

---

## 🔍 Logs de Débogage Ajoutés

J'ai ajouté des logs de débogage dans le fichier `dashboard.component.ts` :

```typescript
console.log('=== Initialisation des graphiques vendeur ===');
console.log('Données reçues:', data);
console.log('topProduits:', data.topProduits);
console.log('topProducts après extraction:', topProducts);
console.log('productLabels:', productLabels);
console.log('productData:', productData);
console.log('sellerTopProductsChartData:', this.sellerTopProductsChartData);
console.log('=== Fin initialisation graphiques vendeur ===');
```

**Ces logs vous aideront à identifier où se situe le problème.**

---

## 🎯 Scénarios Possibles

### Scénario 1 : topProduits est undefined
**Symptôme** : `topProduits: undefined` dans les logs

**Cause** : Le backend ne renvoie pas le champ

**Solution** : Vérifier `DashboardService.java` et `SellerDashboardResponse.java`

---

### Scénario 2 : topProduits est un tableau vide
**Symptôme** : `topProduits: []` dans les logs

**Cause** : Pas de ventes pour ce vendeur

**Solution** : Créer des commandes de test

---

### Scénario 3 : Le graphique ne se charge pas
**Symptôme** : Aucun log dans la console

**Cause** : Le composant ne s'initialise pas

**Solution** : Vérifier que vous êtes bien connecté en tant que vendeur

---

### Scénario 4 : Erreur TypeScript
**Symptôme** : Erreur dans la console du navigateur

**Cause** : Problème de typage ou de compilation

**Solution** : Vérifier les diagnostics TypeScript

---

## 🚀 Solution Rapide

Si vous voulez une solution rapide sans déboguer :

### 1. Recompiler le Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 2. Recompiler le Frontend
```bash
cd frontend
npm run build
npm start
```

### 3. Vider le Cache
Ctrl + Shift + R dans le navigateur

### 4. Créer des Données de Test
1. Se connecter en tant que client
2. Commander des produits du vendeur
3. Retourner au dashboard vendeur

---

## 📞 Support

Si le problème persiste après avoir suivi ces étapes :

1. **Copier les logs de la console** (F12 → Console)
2. **Copier la réponse de l'API** `/dashboard/seller`
3. **Vérifier les erreurs dans les logs du backend**

---

**Date de création** : 1er mai 2026  
**Version** : 1.0  
**Statut** : 🔍 En cours de débogage
