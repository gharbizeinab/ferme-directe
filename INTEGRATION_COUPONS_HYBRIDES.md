# 🎫 Intégration Complète des Coupons Hybrides

## ✅ Ce qui a été créé

### Backend (Java/Spring Boot)

#### 1. Entités
- ✅ `Coupon.java` - Entité principale avec support hybride
- ✅ `CouponUsage.java` - Tracking des utilisations
- ✅ `CouponScope.java` - Enum pour la portée (GLOBAL/SELLER)

#### 2. DTOs
- ✅ `CouponRequest.java` - Création/modification
- ✅ `CouponResponse.java` - Réponse complète
- ✅ `CouponValidationResponse.java` - Validation et calcul
- ✅ `CouponStatsResponse.java` - Statistiques

#### 3. Repositories
- ✅ `CouponRepository.java` - Accès aux données
- ✅ `CouponUsageRepository.java` - Tracking des utilisations

#### 4. Service
- ✅ `CouponService.java` - Logique métier complète avec calcul hybride

#### 5. Controller
- ✅ `CouponController.java` - Endpoints REST pour Admin/Vendeur/Client

#### 6. Base de données
- ✅ `COUPON_HYBRIDE_MIGRATION.sql` - Script SQL complet

### Frontend (Angular)

#### 1. Modèles
- ✅ `coupon.model.ts` - Interfaces TypeScript

#### 2. Service
- ✅ `coupon.service.ts` - Service Angular pour API

#### 3. Composants
- ✅ `admin-coupons` - Gestion admin (TS, HTML, CSS)
- ✅ `seller-coupons` - Gestion vendeur (TS, HTML, CSS)
- ✅ `coupon-form` - Formulaire création/édition (TS, HTML, CSS)

---

## 🔧 Étapes d'intégration

### 1. Base de données

```bash
# Exécuter le script SQL
psql -U votre_user -d votre_database -f ferme-directe-complete/backend/sql/COUPON_HYBRIDE_MIGRATION.sql
```

### 2. Backend - Vérifications

Assurez-vous que ces dépendances sont dans `pom.xml` :

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### 3. Frontend - Intégration dans app.module.ts

Ajoutez les nouveaux composants dans `app.module.ts` :

```typescript
import { AdminCouponsComponent } from './components/admin-coupons/admin-coupons.component';
import { SellerCouponsComponent } from './components/seller-coupons/seller-coupons.component';
import { CouponFormComponent } from './components/coupon-form/coupon-form.component';

@NgModule({
  declarations: [
    // ... autres composants
    AdminCouponsComponent,
    SellerCouponsComponent,
    CouponFormComponent
  ],
  // ...
})
```

### 4. Frontend - Routes

Ajoutez les routes dans votre fichier de routing :

```typescript
const routes: Routes = [
  // ... autres routes
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
];
```

### 5. Frontend - Mise à jour du modèle index.ts

Ajoutez dans `models/index.ts` :

```typescript
export * from './coupon.model';
```

### 6. Frontend - Intégration dans le Checkout

Modifiez `checkout.component.ts` pour ajouter la gestion des coupons :

```typescript
import { CouponService } from '../../services/coupon.service';
import { CouponValidation } from '../../models/coupon.model';

export class CheckoutComponent implements OnInit {
  // Ajouter ces propriétés
  couponCode: string = '';
  appliedCoupon: CouponValidation | null = null;
  couponError: string = '';
  applyingCoupon: boolean = false;

  constructor(
    // ... autres services
    private couponService: CouponService
  ) {}

  // Ajouter cette méthode
  applyCoupon(): void {
    if (!this.couponCode.trim()) {
      this.couponError = 'Veuillez entrer un code coupon';
      return;
    }

    this.applyingCoupon = true;
    this.couponError = '';

    const categoryIds = this.cart?.lignes.map(l => l.produit.categorie.id) || [];

    this.couponService.validateCoupon(
      this.couponCode,
      this.cart?.sousTotal || 0,
      10, // Frais de livraison (à adapter selon votre logique)
      categoryIds
    ).subscribe({
      next: (validation) => {
        if (validation.valide) {
          this.appliedCoupon = validation;
          this.snackBar.open('Coupon appliqué avec succès !', 'Fermer', { duration: 3000 });
        } else {
          this.couponError = validation.message;
        }
        this.applyingCoupon = false;
      },
      error: (error) => {
        this.couponError = error.error?.message || 'Erreur lors de l\'application du coupon';
        this.applyingCoupon = false;
      }
    });
  }

  removeCoupon(): void {
    this.appliedCoupon = null;
    this.couponCode = '';
    this.couponError = '';
  }

  get finalTotal(): number {
    return this.appliedCoupon?.totalApresCoupon || this.cartTotal;
  }
}
```

### 7. Frontend - Template Checkout

Ajoutez dans `checkout.component.html` (dans la section récapitulatif) :

```html
<!-- Section Coupon -->
<div class="coupon-section" *ngIf="!appliedCoupon">
  <h3>Code promo</h3>
  <div class="coupon-input-group">
    <input 
      type="text" 
      [(ngModel)]="couponCode" 
      placeholder="Entrez votre code"
      class="coupon-input"
      [disabled]="applyingCoupon">
    <button 
      (click)="applyCoupon()" 
      class="btn-apply-coupon"
      [disabled]="applyingCoupon">
      {{ applyingCoupon ? 'Vérification...' : 'Appliquer' }}
    </button>
  </div>
  <div class="coupon-error" *ngIf="couponError">
    {{ couponError }}
  </div>
</div>

<!-- Coupon appliqué -->
<div class="applied-coupon" *ngIf="appliedCoupon">
  <div class="coupon-success">
    <i class="fas fa-check-circle"></i>
    <span>Coupon {{ appliedCoupon.codeApplique }} appliqué</span>
    <button (click)="removeCoupon()" class="btn-remove-coupon">
      <i class="fas fa-times"></i>
    </button>
  </div>
  
  <div class="coupon-details">
    <div class="detail-line" *ngIf="appliedCoupon.reductionPourcentage && appliedCoupon.reductionPourcentage > 0">
      <span>Réduction pourcentage</span>
      <span class="discount">-{{ appliedCoupon.reductionPourcentage }} DT</span>
    </div>
    <div class="detail-line" *ngIf="appliedCoupon.reductionMontantFixe && appliedCoupon.reductionMontantFixe > 0">
      <span>Réduction fixe</span>
      <span class="discount">-{{ appliedCoupon.reductionMontantFixe }} DT</span>
    </div>
    <div class="detail-line" *ngIf="appliedCoupon.reductionLivraison && appliedCoupon.reductionLivraison > 0">
      <span>Livraison offerte</span>
      <span class="discount">-{{ appliedCoupon.reductionLivraison }} DT</span>
    </div>
    <div class="detail-line total-savings">
      <span>Total économisé</span>
      <span class="discount">-{{ appliedCoupon.reductionTotale }} DT</span>
    </div>
  </div>
</div>

<!-- Totaux mis à jour -->
<div class="order-summary">
  <div class="summary-line">
    <span>Sous-total</span>
    <span>{{ cart?.sousTotal || 0 }} DT</span>
  </div>
  <div class="summary-line">
    <span>Frais de livraison</span>
    <span>{{ appliedCoupon?.fraisLivraison || 10 }} DT</span>
  </div>
  <div class="summary-line total" *ngIf="appliedCoupon">
    <span>Total avant coupon</span>
    <span>{{ appliedCoupon.totalAvantCoupon }} DT</span>
  </div>
  <div class="summary-line total">
    <span>Total à payer</span>
    <span class="total-amount">{{ finalTotal }} DT</span>
  </div>
</div>
```

### 8. Frontend - Styles Checkout

Ajoutez dans `checkout.component.scss` ou `.css` :

```css
.coupon-section {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
}

.coupon-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #374151;
}

.coupon-input-group {
  display: flex;
  gap: 0.5rem;
}

.coupon-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
}

.coupon-input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-apply-coupon {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-apply-coupon:hover:not(:disabled) {
  background: #5568d3;
}

.btn-apply-coupon:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.coupon-error {
  margin-top: 0.5rem;
  color: #ef4444;
  font-size: 0.9rem;
}

.applied-coupon {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 8px;
  border-left: 4px solid #10b981;
}

.coupon-success {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #065f46;
}

.coupon-success i {
  font-size: 1.3rem;
  color: #10b981;
}

.btn-remove-coupon {
  margin-left: auto;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.3rem;
  font-size: 1.2rem;
  transition: color 0.2s;
}

.btn-remove-coupon:hover {
  color: #ef4444;
}

.coupon-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: #065f46;
}

.detail-line.total-savings {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 2px solid #10b981;
  font-weight: 700;
  font-size: 1.05rem;
}

.discount {
  color: #059669;
  font-weight: 600;
}

.order-summary {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  font-size: 1rem;
}

.summary-line.total {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #e5e7eb;
  font-weight: 700;
  font-size: 1.2rem;
}

.total-amount {
  color: #667eea;
  font-size: 1.5rem;
}
```

### 9. Navigation - Ajout des liens

Dans votre menu de navigation (admin) :

```html
<a routerLink="/admin/coupons" routerLinkActive="active">
  <i class="fas fa-ticket-alt"></i>
  Coupons
</a>
```

Dans votre menu de navigation (vendeur) :

```html
<a routerLink="/seller/coupons" routerLinkActive="active">
  <i class="fas fa-tags"></i>
  Mes Coupons
</a>
```

---

## 🧪 Tests

### 1. Tester la création d'un coupon (Admin)

```bash
POST http://localhost:8080/api/coupons/admin
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "code": "TEST2024",
  "description": "Coupon de test hybride",
  "pourcentageReduction": 20,
  "montantFixeReduction": 5,
  "livraisonGratuite": true,
  "montantMinimum": 50,
  "scope": "GLOBAL",
  "usagesMaxGlobal": 100,
  "usagesMaxParUtilisateur": 1,
  "dateDebut": "2024-01-01T00:00:00",
  "dateExpiration": "2024-12-31T23:59:59"
}
```

### 2. Tester la validation d'un coupon (Client)

```bash
POST http://localhost:8080/api/coupons/validate?code=TEST2024&sousTotal=100&fraisLivraison=10
Authorization: Bearer <token_client>
```

### 3. Tester les statistiques (Admin/Vendeur)

```bash
GET http://localhost:8080/api/coupons/1/stats
Authorization: Bearer <token>
```

---

## 📊 Fonctionnalités implémentées

### ✅ Admin
- Créer des coupons globaux
- Voir tous les coupons (globaux + vendeurs)
- Bloquer/débloquer n'importe quel coupon
- Voir les statistiques détaillées
- Filtrer par portée et statut

### ✅ Vendeur
- Créer des coupons pour sa boutique
- Modifier ses coupons
- Activer/désactiver ses coupons
- Voir les statistiques de ses coupons
- Supprimer ses coupons (si non utilisés)

### ✅ Client
- Appliquer un code coupon au checkout
- Voir le détail des réductions appliquées
- Économies calculées automatiquement

### ✅ Calcul hybride
1. Réduction en pourcentage appliquée en premier
2. Puis réduction montant fixe
3. Puis livraison gratuite
4. Respect du plafond de réduction
5. Total ne peut pas être négatif

---

## 🔒 Sécurité

- ✅ Validation des permissions (Admin/Vendeur/Client)
- ✅ Vérification des limites d'utilisation
- ✅ Validation des dates
- ✅ Protection contre les abus
- ✅ Tracking des utilisations

---

## 📝 Notes importantes

1. **Ordre d'application des réductions** : % → Fixe → Livraison
2. **Un coupon utilisé ne peut pas être supprimé** (seulement désactivé)
3. **Les coupons expirés restent visibles** pour l'historique
4. **Les statistiques sont calculées en temps réel**
5. **Le code coupon est automatiquement en majuscules**

---

## 🚀 Prochaines étapes optionnelles

- [ ] Notifications par email lors de l'utilisation d'un coupon
- [ ] Export des statistiques en CSV/Excel
- [ ] Coupons automatiques (ex: premier achat)
- [ ] Coupons personnalisés par utilisateur
- [ ] Système de parrainage avec coupons

---

## 📞 Support

En cas de problème :
1. Vérifier les logs backend
2. Vérifier la console navigateur
3. Vérifier que la base de données est à jour
4. Vérifier les permissions utilisateur

Bon courage ! 🎉
