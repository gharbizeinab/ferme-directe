# ⚡ Démarrage Ultra-Rapide - Coupons Hybrides

## 🎯 En 3 commandes et 5 minutes

### 1️⃣ Base de données (1 min)
```bash
cd ferme-directe-complete/backend/sql
psql -U postgres -d ferme_directe -f COUPON_HYBRIDE_MIGRATION.sql
```

### 2️⃣ Backend (1 min)
```bash
cd ferme-directe-complete/backend
mvn spring-boot:run
```

### 3️⃣ Frontend (3 min)

**Ouvrir** `frontend/src/app/app.module.ts` et **ajouter** :

```typescript
// EN HAUT DU FICHIER
import { AdminCouponsComponent } from './components/admin-coupons/admin-coupons.component';
import { SellerCouponsComponent } from './components/seller-coupons/seller-coupons.component';
import { CouponFormComponent } from './components/coupon-form/coupon-form.component';

// DANS declarations:
declarations: [
  // ... vos composants existants
  AdminCouponsComponent,
  SellerCouponsComponent,
  CouponFormComponent
]
```

**Ouvrir** votre fichier de routing et **ajouter** :

```typescript
// EN HAUT
import { AdminCouponsComponent } from './components/admin-coupons/admin-coupons.component';
import { SellerCouponsComponent } from './components/seller-coupons/seller-coupons.component';

// DANS routes:
{
  path: 'admin/coupons',
  component: AdminCouponsComponent,
  canActivate: [AuthGuard],
  data: { role: 'ADMIN' }
},
{
  path: 'seller/coupons',
  component: SellerCouponsComponent,
  canActivate: [AuthGuard],
  data: { role: 'SELLER' }
}
```

**Ouvrir** `models/index.ts` et **ajouter** :

```typescript
export * from './coupon.model';
```

**Démarrer** :
```bash
cd ferme-directe-complete/frontend
ng serve
```

---

## ✅ C'est prêt !

### Tester maintenant :

1. **Admin** : Aller sur `http://localhost:4200/admin/coupons`
2. **Vendeur** : Aller sur `http://localhost:4200/seller/coupons`

### Créer votre premier coupon :

**Code** : `TEST2024`  
**Description** : `Mon premier coupon`  
**Réduction** : `-20%`  
**Livraison gratuite** : ✓  
**Montant minimum** : `50 DT`  
**Usages max** : `100`

---

## 📚 Documentation Complète

Pour aller plus loin :

- **Guide complet** : `INTEGRATION_COUPONS_HYBRIDES.md`
- **Tests API** : `TESTS_API_COUPONS.md`
- **Checklist détaillée** : `CHECKLIST_INTEGRATION.md`
- **Vue d'ensemble** : `README_COUPONS.md`

---

## 🎨 Ajouter les liens de navigation (Optionnel)

### Menu Admin :
```html
<a routerLink="/admin/coupons">
  <i class="fas fa-ticket-alt"></i> Coupons
</a>
```

### Menu Vendeur :
```html
<a routerLink="/seller/coupons">
  <i class="fas fa-tags"></i> Mes Coupons
</a>
```

---

## 🧪 Test Rapide avec Postman

```http
POST http://localhost:8080/api/coupons/admin
Authorization: Bearer <votre_token_admin>
Content-Type: application/json

{
  "code": "PROMO15",
  "description": "15% de réduction",
  "pourcentageReduction": 15,
  "livraisonGratuite": false,
  "scope": "GLOBAL",
  "usagesMaxGlobal": 100,
  "usagesMaxParUtilisateur": 1,
  "dateDebut": "2024-01-01T00:00:00",
  "dateExpiration": "2024-12-31T23:59:59"
}
```

---

## 🎉 Terminé !

Votre système de coupons hybrides est opérationnel.

**Prochaine étape** : Intégrer dans le checkout (voir `INTEGRATION_COUPONS_HYBRIDES.md` section 6-8)

---

**Questions ?** Consultez `GUIDE_RAPIDE_COUPONS.md` ou `README_COUPONS.md`
