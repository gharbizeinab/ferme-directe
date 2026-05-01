# ✅ Checklist d'Intégration - Coupons Hybrides

## 📋 Vue d'ensemble

Cette checklist vous guide pas à pas dans l'intégration complète du système de coupons hybrides.

**Temps estimé total** : 2-3 heures  
**Niveau de difficulté** : ⭐⭐⭐ (Moyen)

---

## 🗄️ Phase 1: Base de Données (15 min)

### Étape 1.1: Exécuter la migration
- [ ] Ouvrir un terminal
- [ ] Naviguer vers `ferme-directe-complete/backend/sql`
- [ ] Exécuter : `psql -U postgres -d ferme_directe -f COUPON_HYBRIDE_MIGRATION.sql`
- [ ] Vérifier le message de succès

**Commande** :
```bash
cd ferme-directe-complete/backend/sql
psql -U postgres -d ferme_directe -f COUPON_HYBRIDE_MIGRATION.sql
```

**Résultat attendu** :
```
Migration des coupons hybrides terminée avec succès!
```

### Étape 1.2: Vérifier les tables créées
- [ ] Se connecter à la base de données
- [ ] Exécuter : `\dt` pour voir les tables
- [ ] Vérifier que `coupons`, `coupon_usages`, `coupon_categories` existent

**Commande** :
```sql
\dt
SELECT * FROM coupons LIMIT 5;
```

### Étape 1.3: (Optionnel) Charger les données de test
- [ ] Exécuter : `psql -U postgres -d ferme_directe -f COUPON_TEST_DATA.sql`
- [ ] Vérifier que des coupons de test sont créés

**Commande** :
```bash
psql -U postgres -d ferme_directe -f COUPON_TEST_DATA.sql
```

---

## 🔧 Phase 2: Backend (30 min)

### Étape 2.1: Vérifier les fichiers créés
- [ ] Vérifier que tous les fichiers backend existent :
  - [ ] `entity/Coupon.java`
  - [ ] `entity/CouponUsage.java`
  - [ ] `enums/CouponScope.java`
  - [ ] `dto/coupon/CouponRequest.java`
  - [ ] `dto/coupon/CouponResponse.java`
  - [ ] `dto/coupon/CouponValidationResponse.java`
  - [ ] `dto/coupon/CouponStatsResponse.java`
  - [ ] `repository/CouponRepository.java`
  - [ ] `repository/CouponUsageRepository.java`
  - [ ] `service/CouponService.java`
  - [ ] `controller/CouponController.java`

### Étape 2.2: Vérifier les dépendances Maven
- [ ] Ouvrir `pom.xml`
- [ ] Vérifier que ces dépendances existent :
  - [ ] `spring-boot-starter-data-jpa`
  - [ ] `spring-boot-starter-validation`
  - [ ] `spring-boot-starter-web`
  - [ ] `spring-boot-starter-security`

### Étape 2.3: Redémarrer le backend
- [ ] Arrêter le backend si en cours d'exécution
- [ ] Exécuter : `mvn clean install`
- [ ] Exécuter : `mvn spring-boot:run`
- [ ] Vérifier qu'il n'y a pas d'erreurs au démarrage

**Commandes** :
```bash
cd ferme-directe-complete/backend
mvn clean install
mvn spring-boot:run
```

**Logs attendus** :
```
Hibernate: create table coupons ...
Hibernate: create table coupon_usages ...
Started FermeDirecteApplication in X seconds
```

### Étape 2.4: Tester un endpoint
- [ ] Ouvrir Postman ou un navigateur
- [ ] Tester : `GET http://localhost:8080/api/coupons/admin/all`
- [ ] Vérifier la réponse (même si vide ou 403)

---

## 🎨 Phase 3: Frontend - Fichiers (20 min)

### Étape 3.1: Vérifier les fichiers créés
- [ ] Vérifier que tous les fichiers frontend existent :
  - [ ] `models/coupon.model.ts`
  - [ ] `services/coupon.service.ts`
  - [ ] `components/admin-coupons/admin-coupons.component.ts`
  - [ ] `components/admin-coupons/admin-coupons.component.html`
  - [ ] `components/admin-coupons/admin-coupons.component.css`
  - [ ] `components/seller-coupons/seller-coupons.component.ts`
  - [ ] `components/seller-coupons/seller-coupons.component.html`
  - [ ] `components/seller-coupons/seller-coupons.component.css`
  - [ ] `components/coupon-form/coupon-form.component.ts`
  - [ ] `components/coupon-form/coupon-form.component.html`
  - [ ] `components/coupon-form/coupon-form.component.css`

---

## 🔌 Phase 4: Frontend - Intégration (30 min)

### Étape 4.1: Mettre à jour app.module.ts
- [ ] Ouvrir `frontend/src/app/app.module.ts`
- [ ] Ajouter les imports en haut du fichier :

```typescript
import { AdminCouponsComponent } from './components/admin-coupons/admin-coupons.component';
import { SellerCouponsComponent } from './components/seller-coupons/seller-coupons.component';
import { CouponFormComponent } from './components/coupon-form/coupon-form.component';
```

- [ ] Ajouter dans `declarations` :

```typescript
declarations: [
  // ... autres composants
  AdminCouponsComponent,
  SellerCouponsComponent,
  CouponFormComponent
]
```

- [ ] Sauvegarder le fichier

### Étape 4.2: Mettre à jour le routing
- [ ] Ouvrir votre fichier de routing (ex: `app-routing.module.ts`)
- [ ] Ajouter les imports :

```typescript
import { AdminCouponsComponent } from './components/admin-coupons/admin-coupons.component';
import { SellerCouponsComponent } from './components/seller-coupons/seller-coupons.component';
```

- [ ] Ajouter les routes :

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

- [ ] Sauvegarder le fichier

### Étape 4.3: Mettre à jour models/index.ts
- [ ] Ouvrir `frontend/src/app/models/index.ts`
- [ ] Ajouter à la fin :

```typescript
export * from './coupon.model';
```

- [ ] Sauvegarder le fichier

### Étape 4.4: Ajouter les liens de navigation

#### Pour le menu Admin
- [ ] Ouvrir le composant de navigation admin
- [ ] Ajouter le lien :

```html
<a routerLink="/admin/coupons" routerLinkActive="active">
  <i class="fas fa-ticket-alt"></i>
  <span>Coupons</span>
</a>
```

#### Pour le menu Vendeur
- [ ] Ouvrir le composant de navigation vendeur
- [ ] Ajouter le lien :

```html
<a routerLink="/seller/coupons" routerLinkActive="active">
  <i class="fas fa-tags"></i>
  <span>Mes Coupons</span>
</a>
```

### Étape 4.5: Compiler le frontend
- [ ] Ouvrir un terminal
- [ ] Naviguer vers `ferme-directe-complete/frontend`
- [ ] Exécuter : `ng build`
- [ ] Vérifier qu'il n'y a pas d'erreurs

**Commandes** :
```bash
cd ferme-directe-complete/frontend
ng build
```

**Résultat attendu** :
```
✔ Browser application bundle generation complete.
Build at: ...
```

---

## 🧪 Phase 5: Tests Fonctionnels (30 min)

### Étape 5.1: Tester l'interface Admin
- [ ] Démarrer le frontend : `ng serve`
- [ ] Se connecter en tant qu'Admin
- [ ] Naviguer vers `/admin/coupons`
- [ ] Vérifier que la page s'affiche correctement
- [ ] Cliquer sur "Créer un coupon global"
- [ ] Remplir le formulaire avec ces données :
  - Code: `TEST2024`
  - Description: `Coupon de test`
  - Pourcentage: `20`
  - Montant fixe: `5`
  - Livraison gratuite: ✓
  - Montant minimum: `50`
  - Usages max global: `100`
  - Usages max par utilisateur: `1`
  - Dates: Aujourd'hui → +30 jours
- [ ] Cliquer sur "Créer"
- [ ] Vérifier que le coupon apparaît dans la liste
- [ ] Tester les filtres (portée, statut, recherche)
- [ ] Tester le blocage d'un coupon
- [ ] Tester le déblocage d'un coupon

### Étape 5.2: Tester l'interface Vendeur
- [ ] Se connecter en tant que Vendeur
- [ ] Naviguer vers `/seller/coupons`
- [ ] Vérifier que la page s'affiche correctement
- [ ] Créer un coupon boutique :
  - Code: `MABOUTIQUE10`
  - Description: `10% sur mes produits`
  - Pourcentage: `10`
  - Montant minimum: `20`
  - Usages max: `50`
- [ ] Vérifier que le coupon apparaît dans "Mes Coupons"
- [ ] Tester l'activation/désactivation
- [ ] Cliquer sur "Stats" et vérifier le modal
- [ ] Tester la modification d'un coupon
- [ ] Tester la suppression (si non utilisé)

### Étape 5.3: Tester l'API avec Postman
- [ ] Ouvrir Postman
- [ ] Créer une nouvelle requête
- [ ] Tester la création d'un coupon :

```
POST http://localhost:8080/api/coupons/admin
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "code": "POSTMAN2024",
  "description": "Test depuis Postman",
  "pourcentageReduction": 15,
  "livraisonGratuite": false,
  "scope": "GLOBAL",
  "usagesMaxGlobal": 100,
  "usagesMaxParUtilisateur": 1,
  "dateDebut": "2024-01-01T00:00:00",
  "dateExpiration": "2024-12-31T23:59:59"
}
```

- [ ] Vérifier la réponse `201 Created`
- [ ] Tester la validation d'un coupon :

```
POST http://localhost:8080/api/coupons/validate?code=TEST2024&sousTotal=100&fraisLivraison=10
Authorization: Bearer <client_token>
```

- [ ] Vérifier que le calcul est correct

---

## 🛒 Phase 6: Intégration Checkout (45 min)

### Étape 6.1: Modifier checkout.component.ts
- [ ] Ouvrir `checkout.component.ts`
- [ ] Suivre les instructions dans `INTEGRATION_COUPONS_HYBRIDES.md` section 6
- [ ] Ajouter les propriétés nécessaires
- [ ] Ajouter les méthodes `applyCoupon()` et `removeCoupon()`
- [ ] Sauvegarder le fichier

### Étape 6.2: Modifier checkout.component.html
- [ ] Ouvrir `checkout.component.html`
- [ ] Suivre les instructions dans `INTEGRATION_COUPONS_HYBRIDES.md` section 7
- [ ] Ajouter la section coupon
- [ ] Mettre à jour les totaux
- [ ] Sauvegarder le fichier

### Étape 6.3: Ajouter les styles
- [ ] Ouvrir `checkout.component.css` ou `.scss`
- [ ] Suivre les instructions dans `INTEGRATION_COUPONS_HYBRIDES.md` section 8
- [ ] Ajouter les styles pour les coupons
- [ ] Sauvegarder le fichier

### Étape 6.4: Tester le checkout
- [ ] Se connecter en tant que Client
- [ ] Ajouter des produits au panier
- [ ] Aller au checkout
- [ ] Entrer le code `TEST2024`
- [ ] Cliquer sur "Appliquer"
- [ ] Vérifier que le coupon est appliqué
- [ ] Vérifier le détail des réductions
- [ ] Vérifier le total final
- [ ] Tester avec un code invalide
- [ ] Tester avec un montant minimum non atteint

---

## 🔄 Phase 7: Modification OrderService (30 min)

### Étape 7.1: Modifier OrderService.java
- [ ] Ouvrir `OrderService.java`
- [ ] Suivre les instructions dans `MODIFICATIONS_ORDER_SERVICE.md`
- [ ] Ajouter la dépendance `CouponService`
- [ ] Modifier la méthode `passerCommande()`
- [ ] Modifier la méthode `annuler()`
- [ ] Mettre à jour `toResponse()`
- [ ] Sauvegarder le fichier

### Étape 7.2: Mettre à jour OrderRequest
- [ ] Ouvrir `OrderRequest.java`
- [ ] Ajouter le champ `codeCoupon` si absent
- [ ] Sauvegarder le fichier

### Étape 7.3: Mettre à jour OrderResponse
- [ ] Ouvrir `OrderResponse.java`
- [ ] Ajouter les champs `codeCoupon` et `montantRemise`
- [ ] Sauvegarder le fichier

### Étape 7.4: Redémarrer et tester
- [ ] Redémarrer le backend
- [ ] Passer une commande avec un coupon
- [ ] Vérifier dans la base de données :
  - [ ] Table `orders` : coupon_id renseigné
  - [ ] Table `coupon_usages` : utilisation enregistrée
  - [ ] Table `coupons` : usages_actuels incrémenté

---

## ✅ Phase 8: Vérifications Finales (15 min)

### Étape 8.1: Tests de bout en bout
- [ ] Créer un coupon en tant qu'Admin
- [ ] Vérifier qu'il apparaît dans la liste
- [ ] Se connecter en tant que Client
- [ ] Ajouter des produits au panier
- [ ] Appliquer le coupon au checkout
- [ ] Passer la commande
- [ ] Vérifier que la commande est créée avec le coupon
- [ ] Vérifier les statistiques du coupon
- [ ] Essayer de réutiliser le coupon (doit échouer si limite = 1)

### Étape 8.2: Tests de sécurité
- [ ] Essayer d'accéder à `/admin/coupons` en tant que Vendeur (doit échouer)
- [ ] Essayer d'accéder à `/seller/coupons` en tant que Client (doit échouer)
- [ ] Essayer de modifier le coupon d'un autre vendeur (doit échouer)
- [ ] Essayer d'utiliser un coupon expiré (doit échouer)
- [ ] Essayer d'utiliser un coupon bloqué (doit échouer)

### Étape 8.3: Tests de calcul
- [ ] Tester un coupon pourcentage seul
- [ ] Tester un coupon montant fixe seul
- [ ] Tester un coupon livraison gratuite seule
- [ ] Tester un coupon hybride complet
- [ ] Tester un coupon avec plafond
- [ ] Tester un coupon avec montant minimum

### Étape 8.4: Vérifications base de données
- [ ] Exécuter : `SELECT COUNT(*) FROM coupons;`
- [ ] Exécuter : `SELECT COUNT(*) FROM coupon_usages;`
- [ ] Exécuter : `SELECT * FROM v_coupon_stats;`
- [ ] Vérifier que les données sont cohérentes

---

## 📊 Phase 9: Documentation (10 min)

### Étape 9.1: Documenter pour l'équipe
- [ ] Créer un document interne avec :
  - [ ] URL des interfaces (admin, vendeur)
  - [ ] Exemples de codes coupons
  - [ ] Règles de calcul
  - [ ] Limites et restrictions

### Étape 9.2: Former les utilisateurs
- [ ] Préparer une démo pour les admins
- [ ] Préparer une démo pour les vendeurs
- [ ] Créer un guide utilisateur simple

---

## 🎉 Félicitations !

Si toutes les cases sont cochées, votre système de coupons hybrides est **100% fonctionnel** !

### Prochaines étapes optionnelles :
- [ ] Ajouter des notifications par email
- [ ] Créer des rapports personnalisés
- [ ] Ajouter des coupons automatiques
- [ ] Implémenter un système de parrainage
- [ ] Créer des coupons récurrents

---

## 📞 Besoin d'aide ?

### Documentation disponible :
- `README_COUPONS.md` - Vue d'ensemble
- `GUIDE_RAPIDE_COUPONS.md` - Guide rapide
- `INTEGRATION_COUPONS_HYBRIDES.md` - Guide détaillé
- `TESTS_API_COUPONS.md` - Tests et exemples
- `MODIFICATIONS_ORDER_SERVICE.md` - Modifications OrderService

### Problèmes courants :
- Voir la section "Dépannage" dans `GUIDE_RAPIDE_COUPONS.md`

---

**Temps total estimé** : 2-3 heures  
**Difficulté** : ⭐⭐⭐ (Moyen)  
**Statut** : ✅ Prêt pour l'intégration

Bon courage ! 🚀
