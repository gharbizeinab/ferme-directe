# 🧪 Test Rapide - Système de Coupons

## ✅ Étape 1 : Compiler le Backend

```bash
cd ferme-directe-complete/backend
mvn clean compile
```

**Résultat attendu :** `BUILD SUCCESS`

---

## ✅ Étape 2 : Créer les Tables (Base de Données)

### Dans phpMyAdmin :

1. **Sélectionnez** la base `fermedirecte`
2. **Cliquez** sur l'onglet "SQL"
3. **Exécutez** cette requête pour trouver la contrainte :

```sql
SELECT TABLE_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE REFERENCED_TABLE_NAME = 'coupons'
AND TABLE_SCHEMA = 'fermedirecte';
```

4. **Notez** le nom de la contrainte (ex: `orders_ibfk_1`)

5. **Supprimez** la contrainte (remplacez `NOM_CONTRAINTE`) :

```sql
ALTER TABLE orders DROP FOREIGN KEY NOM_CONTRAINTE;
```

6. **Continuez** avec les requêtes du fichier `SOLUTION_MYSQL_PHPMYADMIN.sql`

**Guide détaillé :** `GUIDE_PHPMYADMIN_ETAPE_PAR_ETAPE.md`

---

## ✅ Étape 3 : Démarrer le Backend

```bash
cd ferme-directe-complete/backend
mvn spring-boot:run
```

**Résultat attendu :**
```
Started FermeDirecteApplication in X.XXX seconds
```

Le serveur tourne sur `http://localhost:8080`

---

## ✅ Étape 4 : Tester l'API avec Postman

### Test 1 : Récupérer tous les coupons (Admin)

```http
GET http://localhost:8080/api/coupons/admin/all
Authorization: Bearer <votre_token_admin>
```

**Résultat attendu :** Liste de 5 coupons

---

### Test 2 : Valider un coupon (Client)

```http
POST http://localhost:8080/api/coupons/validate?code=BIENVENUE2024&sousTotal=100&fraisLivraison=7
Authorization: Bearer <votre_token_client>
```

**Résultat attendu :**
```json
{
  "valide": true,
  "message": "Coupon valide",
  "reductionPourcentage": 20.00,
  "reductionMontantFixe": 5.00,
  "reductionLivraison": 7.00,
  "reductionTotale": 32.00,
  "montantFinal": 75.00,
  "codeApplique": "BIENVENUE2024"
}
```

---

### Test 3 : Créer un coupon (Vendeur)

```http
POST http://localhost:8080/api/coupons/seller
Authorization: Bearer <votre_token_seller>
Content-Type: application/json

{
  "code": "PROMO10",
  "description": "10% de réduction",
  "pourcentageReduction": 10,
  "livraisonGratuite": false,
  "scope": "SELLER",
  "usagesMaxGlobal": 50,
  "usagesMaxParUtilisateur": 1,
  "dateDebut": "2026-05-01T00:00:00",
  "dateExpiration": "2026-12-31T23:59:59"
}
```

**Résultat attendu :** Code 201 + détails du coupon créé

---

## ✅ Étape 5 : Intégrer le Frontend

### 5.1 Modifier `app.module.ts`

Ajoutez en haut :
```typescript
import { AdminCouponsComponent } from './components/admin-coupons/admin-coupons.component';
import { SellerCouponsComponent } from './components/seller-coupons/seller-coupons.component';
import { CouponFormComponent } from './components/coupon-form/coupon-form.component';
```

Dans `declarations`:
```typescript
declarations: [
  // ... vos composants existants
  AdminCouponsComponent,
  SellerCouponsComponent,
  CouponFormComponent
]
```

---

### 5.2 Modifier le fichier de routing

Ajoutez en haut :
```typescript
import { AdminCouponsComponent } from './components/admin-coupons/admin-coupons.component';
import { SellerCouponsComponent } from './components/seller-coupons/seller-coupons.component';
```

Dans `routes`:
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

---

### 5.3 Modifier `models/index.ts`

Ajoutez :
```typescript
export * from './coupon.model';
```

---

### 5.4 Démarrer le Frontend

```bash
cd ferme-directe-complete/frontend
ng serve
```

---

## ✅ Étape 6 : Tester l'Interface

### Admin
1. Connectez-vous en tant qu'admin
2. Allez sur `http://localhost:4200/admin/coupons`
3. Vous devriez voir la liste des 5 coupons
4. Testez la création d'un nouveau coupon

### Vendeur
1. Connectez-vous en tant que vendeur
2. Allez sur `http://localhost:4200/seller/coupons`
3. Vous devriez voir vos coupons
4. Testez la création d'un coupon vendeur

---

## 🎉 Résultat Final

Si tout fonctionne :
- ✅ Backend opérationnel
- ✅ Base de données créée
- ✅ API fonctionnelle
- ✅ Interface admin/vendeur accessible
- ✅ Création/modification/suppression de coupons
- ✅ Validation de coupons

---

## 🆘 En Cas de Problème

| Problème | Solution |
|----------|----------|
| Erreur compilation backend | Voir `CORRECTION_FINALE_USERID.md` |
| Erreur base de données | Voir `GUIDE_PHPMYADMIN_ETAPE_PAR_ETAPE.md` |
| Erreur frontend | Voir `INTEGRATION_COUPONS_HYBRIDES.md` |
| API ne répond pas | Vérifier que le backend tourne sur port 8080 |
| 401 Unauthorized | Vérifier le token JWT |

---

## 📚 Documentation Complète

- **Démarrage rapide :** `DEMARRAGE_RAPIDE.md`
- **Guide complet :** `INTEGRATION_COUPONS_HYBRIDES.md`
- **Tests API :** `TESTS_API_COUPONS.md`
- **Checklist :** `CHECKLIST_INTEGRATION.md`

---

**Temps total estimé :** 30-45 minutes
