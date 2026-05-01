# 🎫 Système de Coupons Hybrides - Ferme Directe

## 📋 Vue d'ensemble

Ce système permet de créer et gérer des **coupons hybrides** qui combinent plusieurs types de réductions :
- ✅ Réduction en pourcentage (ex: -20%)
- ✅ Réduction montant fixe (ex: -5 DT)
- ✅ Livraison gratuite
- ✅ Combinaison de plusieurs réductions dans un seul coupon

## 🎯 Fonctionnalités principales

### Pour l'Admin
- Créer des coupons globaux applicables à toute la plateforme
- Voir et gérer tous les coupons (globaux + vendeurs)
- Bloquer/débloquer n'importe quel coupon
- Définir des règles transversales (limites, dates, catégories)
- Consulter les statistiques en temps réel
- Filtrer et rechercher les coupons

### Pour le Vendeur
- Créer des coupons pour sa boutique uniquement
- Définir des réductions hybrides personnalisées
- Activer/désactiver ses coupons
- Voir les statistiques d'utilisation
- Gérer les conditions d'application
- Supprimer les coupons non utilisés

### Pour l'Acheteur
- Appliquer un code coupon au checkout
- Voir le détail des réductions en temps réel
- Économies calculées automatiquement
- Messages clairs en cas d'erreur

## 🔢 Règles de calcul

### Ordre d'application des réductions
1. **Pourcentage** : appliqué sur le sous-total
2. **Montant fixe** : soustrait du résultat
3. **Livraison gratuite** : frais de livraison = 0

### Règles de sécurité
- ✅ Le total ne peut jamais être négatif
- ✅ Plafond de réduction respecté si défini
- ✅ Montant minimum vérifié
- ✅ Limites d'utilisation par utilisateur
- ✅ Vérification des dates de validité

### Exemple de calcul

**Coupon**: -20% + -5 DT + Livraison offerte  
**Panier**: 100 DT  
**Livraison**: 10 DT

**Calcul**:
1. Sous-total: 100 DT
2. Réduction 20%: 100 × 0.20 = **20 DT** → Reste 80 DT
3. Réduction fixe: 80 - 5 = **5 DT** → Reste 75 DT
4. Livraison offerte: **10 DT** économisés
5. **Total final**: 75 DT
6. **Économie totale**: 35 DT (20 + 5 + 10)

## 📁 Structure des fichiers

### Backend (Java/Spring Boot)
```
backend/
├── src/main/java/com/FermeDirecte/FermeDirecte/
│   ├── entity/
│   │   ├── Coupon.java                    ✅ Entité principale
│   │   └── CouponUsage.java               ✅ Tracking utilisations
│   ├── enums/
│   │   └── CouponScope.java               ✅ GLOBAL/SELLER
│   ├── dto/coupon/
│   │   ├── CouponRequest.java             ✅ Création/modification
│   │   ├── CouponResponse.java            ✅ Réponse API
│   │   ├── CouponValidationResponse.java  ✅ Validation
│   │   └── CouponStatsResponse.java       ✅ Statistiques
│   ├── repository/
│   │   ├── CouponRepository.java          ✅ Accès données
│   │   └── CouponUsageRepository.java     ✅ Tracking
│   ├── service/
│   │   └── CouponService.java             ✅ Logique métier
│   └── controller/
│       └── CouponController.java          ✅ Endpoints REST
└── sql/
    ├── COUPON_HYBRIDE_MIGRATION.sql       ✅ Migration BD
    └── COUPON_QUERIES_UTILES.sql          ✅ Requêtes utiles
```

### Frontend (Angular)
```
frontend/src/app/
├── models/
│   └── coupon.model.ts                    ✅ Interfaces TypeScript
├── services/
│   └── coupon.service.ts                  ✅ Service API
└── components/
    ├── admin-coupons/                     ✅ Gestion admin
    │   ├── admin-coupons.component.ts
    │   ├── admin-coupons.component.html
    │   └── admin-coupons.component.css
    ├── seller-coupons/                    ✅ Gestion vendeur
    │   ├── seller-coupons.component.ts
    │   ├── seller-coupons.component.html
    │   └── seller-coupons.component.css
    └── coupon-form/                       ✅ Formulaire
        ├── coupon-form.component.ts
        ├── coupon-form.component.html
        └── coupon-form.component.css
```

## 🚀 Installation rapide

### 1. Base de données
```bash
psql -U postgres -d ferme_directe -f backend/sql/COUPON_HYBRIDE_MIGRATION.sql
```

### 2. Backend
Le backend est prêt ! Aucune modification nécessaire si vous avez déjà Spring Boot configuré.

### 3. Frontend

**Étape 1**: Ajouter les composants dans `app.module.ts`
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
  ]
})
```

**Étape 2**: Ajouter les routes
```typescript
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

**Étape 3**: Ajouter les liens de navigation

Admin:
```html
<a routerLink="/admin/coupons">
  <i class="fas fa-ticket-alt"></i> Coupons
</a>
```

Vendeur:
```html
<a routerLink="/seller/coupons">
  <i class="fas fa-tags"></i> Mes Coupons
</a>
```

## 📚 Documentation complète

- 📖 **[INTEGRATION_COUPONS_HYBRIDES.md](./INTEGRATION_COUPONS_HYBRIDES.md)** - Guide d'intégration détaillé
- 🧪 **[TESTS_API_COUPONS.md](./TESTS_API_COUPONS.md)** - Tests API et exemples Postman
- 🗄️ **[COUPON_QUERIES_UTILES.sql](./backend/sql/COUPON_QUERIES_UTILES.sql)** - Requêtes SQL utiles

## 🔌 Endpoints API

### Admin
```
POST   /api/coupons/admin              - Créer coupon global
GET    /api/coupons/admin/all          - Tous les coupons
GET    /api/coupons/admin/global       - Coupons globaux
PUT    /api/coupons/admin/{id}/block   - Bloquer
PUT    /api/coupons/admin/{id}/unblock - Débloquer
```

### Vendeur
```
POST   /api/coupons/seller             - Créer coupon boutique
GET    /api/coupons/seller/my-coupons  - Mes coupons
PUT    /api/coupons/seller/{id}        - Modifier
PUT    /api/coupons/seller/{id}/toggle - Activer/Désactiver
DELETE /api/coupons/seller/{id}        - Supprimer
GET    /api/coupons/seller/{id}/stats  - Statistiques
```

### Client
```
POST   /api/coupons/validate           - Valider un coupon
```

### Commun
```
GET    /api/coupons/{id}               - Détails
GET    /api/coupons/{id}/stats         - Statistiques
PUT    /api/coupons/{id}               - Modifier
DELETE /api/coupons/{id}               - Supprimer
```

## 🎨 Captures d'écran

### Interface Admin
- Liste de tous les coupons avec filtres
- Création de coupons globaux
- Statistiques en temps réel
- Blocage/déblocage de coupons

### Interface Vendeur
- Gestion de ses propres coupons
- Création de coupons boutique
- Statistiques détaillées
- Activation/désactivation rapide

### Interface Client (Checkout)
- Champ de saisie du code
- Validation en temps réel
- Détail des économies
- Messages d'erreur clairs

## 🔒 Sécurité

- ✅ Authentification JWT requise
- ✅ Vérification des rôles (Admin/Vendeur/Client)
- ✅ Validation des permissions
- ✅ Protection contre les abus
- ✅ Limites d'utilisation strictes
- ✅ Tracking complet des utilisations

## 📊 Base de données

### Tables créées
- `coupons` - Table principale
- `coupon_categories` - Catégories applicables
- `coupon_usages` - Historique d'utilisation

### Vues créées
- `v_coupon_stats` - Statistiques des coupons
- `v_admin_coupon_dashboard` - Dashboard admin
- `v_seller_coupon_dashboard` - Dashboard vendeur

### Fonctions créées
- `can_user_use_coupon()` - Vérifier si un utilisateur peut utiliser un coupon
- `update_coupon_usage_count()` - Mise à jour automatique du compteur

## 🧪 Tests

### Tests unitaires recommandés
- [ ] Calcul des réductions hybrides
- [ ] Validation des conditions
- [ ] Vérification des limites
- [ ] Gestion des permissions
- [ ] Tracking des utilisations

### Tests d'intégration
- [ ] Création de coupons
- [ ] Application au checkout
- [ ] Statistiques
- [ ] Blocage/déblocage

Voir **[TESTS_API_COUPONS.md](./TESTS_API_COUPONS.md)** pour les exemples détaillés.

## 🐛 Dépannage

### Problème: Coupon non valide
- Vérifier les dates de validité
- Vérifier le montant minimum
- Vérifier les limites d'utilisation
- Vérifier les catégories applicables

### Problème: Calcul incorrect
- Vérifier l'ordre d'application (% → fixe → livraison)
- Vérifier le plafond de réduction
- Vérifier que le total n'est pas négatif

### Problème: Permission refusée
- Vérifier le rôle de l'utilisateur
- Vérifier le token JWT
- Vérifier la portée du coupon (GLOBAL/SELLER)

## 📈 Améliorations futures

- [ ] Notifications email lors de l'utilisation
- [ ] Export des statistiques (CSV/Excel)
- [ ] Coupons automatiques (premier achat, anniversaire)
- [ ] Coupons personnalisés par utilisateur
- [ ] Système de parrainage
- [ ] Coupons récurrents (hebdomadaires, mensuels)
- [ ] A/B testing de coupons
- [ ] Prédiction d'efficacité

## 🤝 Contribution

Pour contribuer :
1. Lire la documentation complète
2. Tester localement
3. Suivre les conventions de code
4. Ajouter des tests
5. Mettre à jour la documentation

## 📞 Support

En cas de problème :
1. Consulter la documentation
2. Vérifier les logs backend
3. Vérifier la console navigateur
4. Tester avec Postman
5. Vérifier la base de données

## 📄 Licence

Ce système fait partie du projet Ferme Directe.

---

**Développé avec ❤️ pour Ferme Directe**

Version: 1.0.0  
Date: 2024  
Auteur: Kiro AI Assistant
