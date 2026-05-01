# ⚡ Guide Rapide - Coupons Hybrides

## 🚀 Démarrage en 5 étapes (30 minutes)

### Étape 1: Base de données (5 min)
```bash
# Ouvrir un terminal et exécuter :
cd ferme-directe-complete/backend/sql
psql -U postgres -d ferme_directe -f COUPON_HYBRIDE_MIGRATION.sql
```

✅ **Vérification** : Vous devriez voir "Migration des coupons hybrides terminée avec succès!"

---

### Étape 2: Backend - Aucune action requise ! (0 min)
✅ Tous les fichiers backend sont déjà créés et prêts
✅ Le backend détectera automatiquement les nouvelles entités au démarrage

**Redémarrer le backend** :
```bash
cd ferme-directe-complete/backend
mvn spring-boot:run
```

---

### Étape 3: Frontend - Intégration (10 min)

#### 3.1 Ouvrir `app.module.ts` et ajouter :

```typescript
// AJOUTER CES IMPORTS EN HAUT
import { AdminCouponsComponent } from './components/admin-coupons/admin-coupons.component';
import { SellerCouponsComponent } from './components/seller-coupons/seller-coupons.component';
import { CouponFormComponent } from './components/coupon-form/coupon-form.component';

@NgModule({
  declarations: [
    // ... vos composants existants
    AdminCouponsComponent,      // AJOUTER
    SellerCouponsComponent,     // AJOUTER
    CouponFormComponent         // AJOUTER
  ],
  // ... reste du module
})
```

#### 3.2 Ouvrir votre fichier de routing et ajouter :

```typescript
const routes: Routes = [
  // ... vos routes existantes
  
  // AJOUTER CES ROUTES
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

#### 3.3 Ouvrir `models/index.ts` et ajouter :

```typescript
export * from './coupon.model';  // AJOUTER CETTE LIGNE
```

---

### Étape 4: Navigation - Ajouter les liens (5 min)

#### Dans le menu Admin :
```html
<a routerLink="/admin/coupons" routerLinkActive="active">
  <i class="fas fa-ticket-alt"></i>
  <span>Coupons</span>
</a>
```

#### Dans le menu Vendeur :
```html
<a routerLink="/seller/coupons" routerLinkActive="active">
  <i class="fas fa-tags"></i>
  <span>Mes Coupons</span>
</a>
```

---

### Étape 5: Test rapide (10 min)

#### 5.1 Tester l'interface Admin
1. Se connecter en tant qu'Admin
2. Aller sur `/admin/coupons`
3. Cliquer sur "Créer un coupon global"
4. Remplir le formulaire :
   - Code: `TEST2024`
   - Description: `Coupon de test`
   - Pourcentage: `20`
   - Montant fixe: `5`
   - Livraison gratuite: ✓
   - Montant minimum: `50`
   - Usages max: `100`
   - Usages par utilisateur: `1`
5. Cliquer sur "Créer"

✅ **Succès** : Le coupon apparaît dans la liste

#### 5.2 Tester l'interface Vendeur
1. Se connecter en tant que Vendeur
2. Aller sur `/seller/coupons`
3. Créer un coupon boutique
4. Vérifier qu'il apparaît dans "Mes Coupons"

✅ **Succès** : Le coupon est créé et visible

---

## 🎯 Utilisation Rapide

### Créer un coupon simple (Pourcentage seul)
```json
{
  "code": "PROMO10",
  "description": "10% de réduction",
  "pourcentageReduction": 10,
  "livraisonGratuite": false,
  "scope": "GLOBAL",
  "usagesMaxGlobal": 100,
  "usagesMaxParUtilisateur": 1,
  "dateDebut": "2024-01-01T00:00:00",
  "dateExpiration": "2024-12-31T23:59:59"
}
```

### Créer un coupon hybride complet
```json
{
  "code": "SUPER2024",
  "description": "Super offre : -20% + -5 DT + livraison offerte",
  "pourcentageReduction": 20,
  "montantFixeReduction": 5,
  "livraisonGratuite": true,
  "montantMinimum": 50,
  "scope": "GLOBAL",
  "usagesMaxGlobal": 50,
  "usagesMaxParUtilisateur": 1,
  "dateDebut": "2024-01-01T00:00:00",
  "dateExpiration": "2024-12-31T23:59:59"
}
```

---

## 🧪 Tests Rapides avec Postman

### 1. Créer un coupon (Admin)
```
POST http://localhost:8080/api/coupons/admin
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "code": "TEST2024",
  "description": "Coupon de test",
  "pourcentageReduction": 20,
  "livraisonGratuite": false,
  "scope": "GLOBAL",
  "usagesMaxGlobal": 100,
  "usagesMaxParUtilisateur": 1,
  "dateDebut": "2024-01-01T00:00:00",
  "dateExpiration": "2024-12-31T23:59:59"
}
```

### 2. Valider un coupon (Client)
```
POST http://localhost:8080/api/coupons/validate?code=TEST2024&sousTotal=100&fraisLivraison=10
Authorization: Bearer <client_token>
```

### 3. Voir tous les coupons (Admin)
```
GET http://localhost:8080/api/coupons/admin/all
Authorization: Bearer <admin_token>
```

---

## 🔍 Vérifications Rapides

### Vérifier que tout fonctionne

#### 1. Base de données
```sql
-- Vérifier les tables
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('coupons', 'coupon_usages', 'coupon_categories');

-- Vérifier les coupons de test
SELECT code, description, actif FROM coupons;
```

#### 2. Backend
```bash
# Vérifier les logs au démarrage
# Vous devriez voir :
# - Hibernate: create table coupons ...
# - Hibernate: create table coupon_usages ...
```

#### 3. Frontend
```bash
# Compiler le frontend
ng build

# Vérifier qu'il n'y a pas d'erreurs
```

---

## 🐛 Problèmes Courants

### Problème 1: "Table coupons does not exist"
**Solution** : Exécuter le script SQL de migration

### Problème 2: "Component not found"
**Solution** : Vérifier que les composants sont bien déclarés dans `app.module.ts`

### Problème 3: "Cannot find module coupon.model"
**Solution** : Ajouter l'export dans `models/index.ts`

### Problème 4: "403 Forbidden"
**Solution** : Vérifier que vous êtes connecté avec le bon rôle (Admin/Vendeur)

### Problème 5: "Coupon invalide"
**Solution** : Vérifier que :
- Le coupon est actif
- Les dates sont valides
- Le montant minimum est atteint
- Les limites d'utilisation ne sont pas dépassées

---

## 📱 Interfaces Disponibles

### Admin
- **URL** : `/admin/coupons`
- **Fonctions** :
  - Créer des coupons globaux
  - Voir tous les coupons
  - Filtrer et rechercher
  - Bloquer/débloquer
  - Voir les statistiques

### Vendeur
- **URL** : `/seller/coupons`
- **Fonctions** :
  - Créer des coupons boutique
  - Voir ses coupons
  - Activer/désactiver
  - Voir les statistiques
  - Modifier/supprimer

### Client (Checkout)
- **Fonction** : Appliquer un code coupon
- **Affichage** : Détail des économies

---

## 📊 Exemples de Coupons

### 1. Coupon Bienvenue
- Code: `BIENVENUE2024`
- Réduction: -20% + -5 DT + Livraison offerte
- Minimum: 50 DT
- Usage: 1 fois par utilisateur

### 2. Coupon Promo
- Code: `PROMO15`
- Réduction: -15%
- Minimum: 30 DT
- Usage: 2 fois par utilisateur

### 3. Coupon Livraison
- Code: `LIVRAISONGRATUITE`
- Réduction: Livraison offerte
- Minimum: Aucun
- Usage: 3 fois par utilisateur

### 4. Coupon Méga Promo
- Code: `MEGA50`
- Réduction: -50% (max 30 DT)
- Minimum: 100 DT
- Usage: 1 fois par utilisateur

---

## 🎓 Concepts Clés

### Ordre d'application des réductions
```
1. Pourcentage → 2. Montant fixe → 3. Livraison
```

### Exemple de calcul
```
Panier: 100 DT
Livraison: 10 DT
Coupon: -20% + -5 DT + Livraison offerte

Calcul:
100 DT × 20% = 20 DT → Reste 80 DT
80 DT - 5 DT = 75 DT
Livraison: 0 DT

Total: 75 DT
Économie: 35 DT
```

---

## 📞 Aide Rapide

### Commandes Utiles

```bash
# Redémarrer le backend
mvn spring-boot:run

# Compiler le frontend
ng build

# Lancer le frontend en dev
ng serve

# Vérifier la base de données
psql -U postgres -d ferme_directe
```

### Requêtes SQL Utiles

```sql
-- Voir tous les coupons
SELECT * FROM coupons;

-- Voir les utilisations
SELECT * FROM coupon_usages;

-- Statistiques
SELECT * FROM v_coupon_stats;
```

---

## ✅ Checklist Rapide

- [ ] Migration SQL exécutée
- [ ] Backend redémarré
- [ ] Composants ajoutés dans app.module.ts
- [ ] Routes ajoutées
- [ ] Liens de navigation ajoutés
- [ ] Export ajouté dans models/index.ts
- [ ] Test création coupon Admin
- [ ] Test création coupon Vendeur
- [ ] Test validation coupon Client

---

## 🎉 C'est Prêt !

Une fois ces étapes terminées, votre système de coupons hybrides est **100% fonctionnel** !

### Prochaines étapes optionnelles :
1. Intégrer dans le checkout (voir `INTEGRATION_COUPONS_HYBRIDES.md`)
2. Modifier le OrderService (voir `MODIFICATIONS_ORDER_SERVICE.md`)
3. Personnaliser les styles
4. Ajouter des notifications
5. Créer des rapports personnalisés

---

**Besoin d'aide ?** Consultez la documentation complète :
- `README_COUPONS.md` - Vue d'ensemble
- `INTEGRATION_COUPONS_HYBRIDES.md` - Guide détaillé
- `TESTS_API_COUPONS.md` - Tests et exemples

**Bon courage ! 🚀**
