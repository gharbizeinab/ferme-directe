# ✅ Vérification Complète du Système de Coupons

## 🎯 Objectif

Ce document vous permet de vérifier que **TOUT** est correctement configuré avant de tester la création de coupons.

---

## 📋 Checklist de Vérification

### 1️⃣ Base de Données MySQL

#### ☐ Tables Créées
Dans phpMyAdmin, vérifiez que ces 3 tables existent :
```sql
SHOW TABLES LIKE 'coupon%';
```

**Résultat attendu :**
```
coupon_categories
coupon_usages
coupons
```

#### ☐ Structure de la Table `coupons`
```sql
DESCRIBE coupons;
```

**Résultat attendu :** 18 colonnes
- id
- code
- description
- pourcentage_reduction
- montant_fixe_reduction
- livraison_gratuite
- montant_minimum
- montant_maximum_reduction
- scope
- seller_id
- usages_max_global
- usages_actuels
- usages_max_par_utilisateur
- date_debut
- date_expiration
- date_creation
- actif
- bloque

#### ☐ Coupons de Test
```sql
SELECT COUNT(*) FROM coupons;
```

**Résultat attendu :** 5 coupons

#### ☐ Contrainte dans orders
```sql
SELECT 
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'orders'
AND TABLE_SCHEMA = 'fermedirecte'
AND REFERENCED_TABLE_NAME = 'coupons';
```

**Résultat attendu :** 1 ligne avec `fk_orders_coupon`

---

### 2️⃣ Backend Java

#### ☐ Compilation Sans Erreur
```bash
cd ferme-directe-complete/backend
mvn clean compile
```

**Résultat attendu :**
```
[INFO] BUILD SUCCESS
```

#### ☐ Fichiers Backend Présents
Vérifiez que ces fichiers existent :
- ✅ `src/main/java/.../entity/Coupon.java`
- ✅ `src/main/java/.../entity/CouponUsage.java`
- ✅ `src/main/java/.../enums/CouponScope.java`
- ✅ `src/main/java/.../dto/coupon/CouponRequest.java`
- ✅ `src/main/java/.../dto/coupon/CouponResponse.java`
- ✅ `src/main/java/.../dto/coupon/CouponValidationResponse.java`
- ✅ `src/main/java/.../dto/coupon/CouponStatsResponse.java`
- ✅ `src/main/java/.../repository/CouponRepository.java`
- ✅ `src/main/java/.../repository/CouponUsageRepository.java`
- ✅ `src/main/java/.../service/CouponService.java`
- ✅ `src/main/java/.../controller/CouponController.java`

#### ☐ Backend Démarré
```bash
cd ferme-directe-complete/backend
mvn spring-boot:run
```

**Résultat attendu :**
```
Started FermeDirecteApplication in X.XXX seconds
```

#### ☐ Endpoints Disponibles
Vérifiez dans les logs que ces endpoints sont mappés :
```
POST   /api/coupons/admin
GET    /api/coupons/admin/all
POST   /api/coupons/seller
GET    /api/coupons/seller/my-coupons
POST   /api/coupons/validate
```

---

### 3️⃣ Frontend Angular

#### ☐ Fichiers Frontend Présents
Vérifiez que ces fichiers existent :
- ✅ `src/app/models/coupon.model.ts`
- ✅ `src/app/services/coupon.service.ts`
- ✅ `src/app/components/admin-coupons/admin-coupons.component.ts`
- ✅ `src/app/components/admin-coupons/admin-coupons.component.html`
- ✅ `src/app/components/admin-coupons/admin-coupons.component.css`
- ✅ `src/app/components/seller-coupons/seller-coupons.component.ts`
- ✅ `src/app/components/seller-coupons/seller-coupons.component.html`
- ✅ `src/app/components/seller-coupons/seller-coupons.component.css`
- ✅ `src/app/components/coupon-form/coupon-form.component.ts`
- ✅ `src/app/components/coupon-form/coupon-form.component.html`
- ✅ `src/app/components/coupon-form/coupon-form.component.css`

#### ☐ Modules Importés dans app.module.ts
Vérifiez que ces modules sont importés :
```typescript
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
```

#### ☐ Composants Déclarés dans app.module.ts
Vérifiez que ces composants sont déclarés :
```typescript
declarations: [
  // ...
  AdminCouponsComponent,
  SellerCouponsComponent,
  CouponFormComponent,
  // ...
]
```

#### ☐ Routes Ajoutées
Vérifiez que ces routes existent dans le fichier de routing :
```typescript
{ path: 'admin/coupons', component: AdminCouponsComponent },
{ path: 'seller/coupons', component: SellerCouponsComponent },
```

#### ☐ Liens de Navigation
Vérifiez que les liens sont ajoutés dans `layout.component.html` :
- Admin : Lien vers `/admin/coupons`
- Vendeur : Lien vers `/seller/coupons`

#### ☐ Frontend Démarré
```bash
cd ferme-directe-complete/frontend
ng serve
```

**Résultat attendu :**
```
✔ Compiled successfully.
```

#### ☐ Aucune Erreur dans la Console
Ouvrez `http://localhost:4200` et vérifiez qu'il n'y a pas d'erreurs dans la console (F12)

---

### 4️⃣ Connexion Backend ↔ Frontend

#### ☐ CORS Configuré
Vérifiez que `@CrossOrigin(origins = "*")` est présent dans `CouponController.java`

#### ☐ URL de l'API Correcte
Vérifiez dans `coupon.service.ts` :
```typescript
private apiUrl = 'http://localhost:8080/api/coupons';
```

#### ☐ Test de Connexion
Ouvrez la console du navigateur (F12) et exécutez :
```javascript
fetch('http://localhost:8080/api/coupons/admin/all', {
  headers: {
    'Authorization': 'Bearer VOTRE_TOKEN_JWT'
  }
})
.then(r => r.json())
.then(console.log)
```

**Résultat attendu :** Liste des 5 coupons de test

---

### 5️⃣ Authentification

#### ☐ Utilisateur Admin Existe
```sql
SELECT id, email, role FROM users WHERE role = 'ADMIN' LIMIT 1;
```

**Résultat attendu :** Au moins 1 admin

#### ☐ Utilisateur Vendeur Existe
```sql
SELECT id, email, role FROM users WHERE role = 'SELLER' LIMIT 1;
```

**Résultat attendu :** Au moins 1 vendeur

#### ☐ Connexion Fonctionne
1. Allez sur `http://localhost:4200/login`
2. Connectez-vous avec un compte admin ou vendeur
3. Vérifiez que vous êtes redirigé vers le dashboard

---

## 🧪 Tests Fonctionnels

### Test 1 : Affichage de la Liste (Admin)
1. Connectez-vous en tant qu'admin
2. Allez sur `http://localhost:4200/admin/coupons`
3. Vérifiez que vous voyez les 5 coupons de test

**Résultat attendu :** ✅ Liste affichée

### Test 2 : Affichage de la Liste (Vendeur)
1. Connectez-vous en tant que vendeur
2. Allez sur `http://localhost:4200/seller/coupons`
3. Vérifiez que vous voyez vos coupons (peut être vide)

**Résultat attendu :** ✅ Page affichée

### Test 3 : Ouverture du Formulaire
1. Cliquez sur **"+ Nouveau Coupon"**
2. Vérifiez que le formulaire s'ouvre en modal

**Résultat attendu :** ✅ Formulaire Material Design affiché

### Test 4 : Validation du Formulaire
1. Laissez tous les champs vides
2. Cliquez sur **"Créer"**
3. Vérifiez que les erreurs s'affichent en rouge

**Résultat attendu :** ✅ Erreurs de validation affichées

### Test 5 : Création d'un Coupon
1. Remplissez le formulaire :
   - Code : `TEST2024`
   - Description : `Coupon de test`
   - Réduction : `10%`
   - Date début : Aujourd'hui
   - Date expiration : Dans 30 jours
2. Cliquez sur **"Créer"**

**Résultat attendu :** ✅ Coupon créé avec succès

### Test 6 : Vérification en Base de Données
```sql
SELECT * FROM coupons WHERE code = 'TEST2024';
```

**Résultat attendu :** ✅ 1 ligne avec votre coupon

---

## 🎯 Résumé de Vérification

| Composant | Vérifications | Statut |
|-----------|---------------|--------|
| **Base de données** | 3 tables + 5 coupons + contrainte | ☐ |
| **Backend** | 11 fichiers + compilation + démarrage | ☐ |
| **Frontend** | 9 fichiers + modules + routes + démarrage | ☐ |
| **Connexion** | CORS + URL + test API | ☐ |
| **Authentification** | Admin + Vendeur + connexion | ☐ |
| **Tests fonctionnels** | 6 tests passés | ☐ |

---

## 🆘 En Cas de Problème

### ❌ Base de données : Tables manquantes
**Solution :** Exécutez `SOLUTION_RAPIDE.md`

### ❌ Backend : Erreur de compilation
**Solution :** Lisez `CORRECTIONS_BACKEND_APPLIQUEES.md`

### ❌ Frontend : Erreur de compilation
**Solution :** Lisez `CORRECTIONS_ERREURS_FRONTEND.md`

### ❌ Connexion : CORS error
**Solution :** Vérifiez `@CrossOrigin` dans `CouponController.java`

### ❌ Authentification : Token expiré
**Solution :** Reconnectez-vous

### ❌ Création : Erreur lors de la sauvegarde
**Solution :** Vérifiez que la base de données est configurée (étape 1)

---

## ✅ Tout est OK ?

Si toutes les vérifications sont ✅, vous pouvez maintenant :

1. **Créer des coupons** (admin/vendeur)
2. **Gérer les coupons** (activer/désactiver/supprimer)
3. **Voir les statistiques** (nombre d'utilisations, montant économisé)
4. **Valider des coupons** (lors du checkout)

---

**🎉 Félicitations ! Votre système de coupons hybrides est opérationnel !**

