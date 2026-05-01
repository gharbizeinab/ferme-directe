# 📅 Filtre de Tri par Date - Coupons

## ✅ Fonctionnalité Ajoutée

Un filtre de tri par date a été ajouté pour permettre de trier les coupons par ordre chronologique.

---

## 🎯 Où Trouver le Filtre

### Interface Admin
- **Page :** `/admin/coupons`
- **Position :** Dans la section des filtres, à droite
- **Label :** "Tri par date"

### Interface Vendeur
- **Page :** `/seller/coupons`
- **Position :** En haut de la page, sous le titre
- **Label :** "Tri par date"

---

## 📊 Options de Tri

### Plus récent d'abord (DESC)
- **Valeur par défaut**
- Affiche les coupons créés récemment en premier
- Ordre : Du plus récent au plus ancien

### Plus ancien d'abord (ASC)
- Affiche les coupons créés il y a longtemps en premier
- Ordre : Du plus ancien au plus récent

---

## 🔧 Fichiers Modifiés

### 1. Admin - TypeScript
**Fichier :** `frontend/src/app/components/admin-coupons/admin-coupons.component.ts`

**Ajouts :**
```typescript
// Nouvelle propriété
sortOrder: string = 'DESC';

// Logique de tri dans applyFilters()
this.filteredCoupons.sort((a, b) => {
  const dateA = new Date(a.dateCreation).getTime();
  const dateB = new Date(b.dateCreation).getTime();
  return this.sortOrder === 'DESC' ? dateB - dateA : dateA - dateB;
});
```

---

### 2. Admin - HTML
**Fichier :** `frontend/src/app/components/admin-coupons/admin-coupons.component.html`

**Ajout :**
```html
<div class="filter-group">
  <label>Tri par date</label>
  <select [(ngModel)]="sortOrder" (ngModelChange)="applyFilters()" class="form-control">
    <option value="DESC">Plus récent d'abord</option>
    <option value="ASC">Plus ancien d'abord</option>
  </select>
</div>
```

---

### 3. Vendeur - TypeScript
**Fichier :** `frontend/src/app/components/seller-coupons/seller-coupons.component.ts`

**Ajouts :**
```typescript
// Nouvelle propriété
filteredCoupons: Coupon[] = [];
sortOrder: string = 'DESC';

// Nouvelle méthode
applySorting(): void {
  this.filteredCoupons = [...this.coupons];
  this.filteredCoupons.sort((a, b) => {
    const dateA = new Date(a.dateCreation).getTime();
    const dateB = new Date(b.dateCreation).getTime();
    return this.sortOrder === 'DESC' ? dateB - dateA : dateA - dateB;
  });
}

// Modification de loadMyCoupons()
loadMyCoupons(): void {
  this.loading = true;
  this.couponService.getMyCoupons().subscribe({
    next: (data) => {
      this.coupons = data;
      this.applySorting(); // ← Ajouté
      this.loading = false;
    },
    // ...
  });
}
```

---

### 4. Vendeur - HTML
**Fichier :** `frontend/src/app/components/seller-coupons/seller-coupons.component.html`

**Ajouts :**
```html
<!-- Nouvelle section de filtres -->
<div class="filters-section">
  <div class="filter-group">
    <label>Tri par date</label>
    <select [(ngModel)]="sortOrder" (ngModelChange)="applySorting()" class="form-control">
      <option value="DESC">Plus récent d'abord</option>
      <option value="ASC">Plus ancien d'abord</option>
    </select>
  </div>
</div>

<!-- Modification de la boucle -->
<div *ngFor="let coupon of filteredCoupons" class="coupon-card">
  <!-- au lieu de: let coupon of coupons -->
```

---

### 5. Vendeur - CSS
**Fichier :** `frontend/src/app/components/seller-coupons/seller-coupons.component.css`

**Ajout :**
```css
.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  background: white;
}

.form-control:focus {
  outline: none;
  border-color: #f5576c;
  box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1);
}
```

---

## 🎯 Utilisation

### Pour l'Admin
1. Allez sur `/admin/coupons`
2. Dans la section des filtres, trouvez "Tri par date"
3. Sélectionnez :
   - **"Plus récent d'abord"** pour voir les nouveaux coupons en premier
   - **"Plus ancien d'abord"** pour voir les anciens coupons en premier
4. La liste se met à jour automatiquement

### Pour le Vendeur
1. Allez sur `/seller/coupons`
2. En haut de la page, trouvez "Tri par date"
3. Sélectionnez l'ordre de tri souhaité
4. La liste se met à jour automatiquement

---

## 📊 Comportement

### Tri par Défaut
- **Ordre :** Plus récent d'abord (DESC)
- **Raison :** Les nouveaux coupons sont généralement plus pertinents

### Tri Dynamique
- Le tri s'applique **immédiatement** lors du changement
- Le tri fonctionne **avec les autres filtres** (portée, statut, recherche)
- Le tri est **conservé** lors du rechargement de la page (si vous ajoutez cette fonctionnalité)

### Critère de Tri
- **Champ utilisé :** `dateCreation`
- **Type :** Date et heure complète
- **Précision :** À la milliseconde

---

## 🔍 Exemples

### Exemple 1 : Voir les Derniers Coupons Créés
1. Sélectionnez "Plus récent d'abord"
2. Les coupons créés aujourd'hui apparaissent en premier
3. Puis ceux d'hier, d'avant-hier, etc.

### Exemple 2 : Voir les Anciens Coupons
1. Sélectionnez "Plus ancien d'abord"
2. Les coupons créés il y a longtemps apparaissent en premier
3. Utile pour retrouver des coupons historiques

### Exemple 3 : Combiner avec d'Autres Filtres
1. Sélectionnez "Portée : Globaux"
2. Sélectionnez "Statut : Actifs"
3. Sélectionnez "Tri : Plus récent d'abord"
4. Résultat : Coupons globaux actifs, du plus récent au plus ancien

---

## 💡 Cas d'Usage

### Pour l'Admin
- **Surveiller les nouveaux coupons** créés par les vendeurs
- **Auditer les anciens coupons** pour les archiver
- **Vérifier les coupons récents** pour détecter les abus

### Pour le Vendeur
- **Voir ses dernières créations** en premier
- **Retrouver un ancien coupon** facilement
- **Organiser ses coupons** chronologiquement

---

## 🎨 Design

### Style
- **Select moderne** avec bordure arrondie
- **Focus violet** cohérent avec le thème
- **Responsive** : S'adapte aux petits écrans

### Position
- **Admin :** 4ème filtre (après Recherche, Portée, Statut)
- **Vendeur :** Seul filtre (pour l'instant)

---

## 🚀 Améliorations Futures (Optionnel)

### 1. Tri par Date d'Expiration
```typescript
sortBy: string = 'dateCreation'; // ou 'dateExpiration'
```

### 2. Tri par Nombre d'Utilisations
```typescript
sortBy: string = 'usagesActuels';
```

### 3. Tri par Montant de Réduction
```typescript
sortBy: string = 'montantReduction';
```

### 4. Sauvegarde du Tri
```typescript
// Sauvegarder dans localStorage
localStorage.setItem('couponSortOrder', this.sortOrder);

// Restaurer au chargement
this.sortOrder = localStorage.getItem('couponSortOrder') || 'DESC';
```

---

## ✅ Tests

### Test 1 : Tri Descendant
1. Créez 3 coupons : A, B, C
2. Sélectionnez "Plus récent d'abord"
3. Vérifiez l'ordre : C, B, A

### Test 2 : Tri Ascendant
1. Sélectionnez "Plus ancien d'abord"
2. Vérifiez l'ordre : A, B, C

### Test 3 : Avec Filtres
1. Créez des coupons globaux et vendeurs
2. Filtrez par "Globaux"
3. Changez le tri
4. Vérifiez que seuls les globaux sont triés

---

## 📊 Résumé

| Aspect | Détail |
|--------|--------|
| **Fichiers modifiés** | 5 fichiers |
| **Lignes ajoutées** | ~100 lignes |
| **Temps de développement** | 15 minutes |
| **Complexité** | Faible |
| **Impact** | Amélioration UX significative |

---

## 🎉 Résultat

Les utilisateurs peuvent maintenant **trier les coupons par date de création** pour une meilleure organisation et navigation !

