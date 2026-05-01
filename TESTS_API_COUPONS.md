# 🧪 Tests API - Coupons Hybrides

## Configuration

**Base URL**: `http://localhost:8080/api/coupons`

**Headers requis**:
```
Authorization: Bearer <votre_token_jwt>
Content-Type: application/json
```

---

## 🛡️ Tests Admin

### 1. Créer un coupon global hybride complet

```http
POST /api/coupons/admin
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "code": "BIENVENUE2024",
  "description": "Coupon de bienvenue : -20% + -5 DT + livraison offerte",
  "pourcentageReduction": 20.00,
  "montantFixeReduction": 5.00,
  "livraisonGratuite": true,
  "montantMinimum": 50.00,
  "montantMaximumReduction": null,
  "categoriesApplicables": [],
  "scope": "GLOBAL",
  "usagesMaxGlobal": 100,
  "usagesMaxParUtilisateur": 1,
  "dateDebut": "2024-01-01T00:00:00",
  "dateExpiration": "2024-12-31T23:59:59"
}
```

**Réponse attendue**: `201 Created`
```json
{
  "id": 1,
  "code": "BIENVENUE2024",
  "description": "Coupon de bienvenue : -20% + -5 DT + livraison offerte",
  "pourcentageReduction": 20.00,
  "montantFixeReduction": 5.00,
  "livraisonGratuite": true,
  "montantMinimum": 50.00,
  "scope": "GLOBAL",
  "vendeurId": null,
  "usagesMaxGlobal": 100,
  "usagesActuels": 0,
  "usagesMaxParUtilisateur": 1,
  "actif": true,
  "bloque": false,
  "valide": true,
  "montantTotalEconomise": 0
}
```

### 2. Créer un coupon pourcentage seul

```http
POST /api/coupons/admin

{
  "code": "PROMO15",
  "description": "Promotion : -15% sur tout",
  "pourcentageReduction": 15.00,
  "montantFixeReduction": null,
  "livraisonGratuite": false,
  "montantMinimum": 30.00,
  "scope": "GLOBAL",
  "usagesMaxGlobal": 200,
  "usagesMaxParUtilisateur": 2,
  "dateDebut": "2024-01-01T00:00:00",
  "dateExpiration": "2024-06-30T23:59:59"
}
```

### 3. Créer un coupon avec plafond de réduction

```http
POST /api/coupons/admin

{
  "code": "MEGA50",
  "description": "Méga promo : -50% (max 30 DT de réduction)",
  "pourcentageReduction": 50.00,
  "montantFixeReduction": null,
  "livraisonGratuite": false,
  "montantMinimum": 100.00,
  "montantMaximumReduction": 30.00,
  "scope": "GLOBAL",
  "usagesMaxGlobal": 50,
  "usagesMaxParUtilisateur": 1,
  "dateDebut": "2024-01-01T00:00:00",
  "dateExpiration": "2024-03-31T23:59:59"
}
```

### 4. Créer un coupon pour catégories spécifiques

```http
POST /api/coupons/admin

{
  "code": "FRUITS20",
  "description": "20% sur les fruits et légumes",
  "pourcentageReduction": 20.00,
  "livraisonGratuite": false,
  "categoriesApplicables": [1, 2],
  "scope": "GLOBAL",
  "usagesMaxGlobal": 150,
  "usagesMaxParUtilisateur": 3,
  "dateDebut": "2024-01-01T00:00:00",
  "dateExpiration": "2024-12-31T23:59:59"
}
```

### 5. Lister tous les coupons

```http
GET /api/coupons/admin/all
Authorization: Bearer <admin_token>
```

**Réponse**: `200 OK` avec tableau de coupons

### 6. Lister uniquement les coupons globaux

```http
GET /api/coupons/admin/global
Authorization: Bearer <admin_token>
```

### 7. Bloquer un coupon

```http
PUT /api/coupons/admin/1/block
Authorization: Bearer <admin_token>
```

**Réponse**: `200 OK`

### 8. Débloquer un coupon

```http
PUT /api/coupons/admin/1/unblock
Authorization: Bearer <admin_token>
```

---

## 🛒 Tests Vendeur

### 1. Créer un coupon vendeur

```http
POST /api/coupons/seller
Authorization: Bearer <seller_token>

{
  "code": "MABOUTIQUE10",
  "description": "10% sur tous mes produits",
  "pourcentageReduction": 10.00,
  "livraisonGratuite": false,
  "montantMinimum": 20.00,
  "scope": "SELLER",
  "usagesMaxGlobal": 100,
  "usagesMaxParUtilisateur": 2,
  "dateDebut": "2024-01-01T00:00:00",
  "dateExpiration": "2024-12-31T23:59:59"
}
```

### 2. Créer un coupon vendeur hybride

```http
POST /api/coupons/seller
Authorization: Bearer <seller_token>

{
  "code": "SHOP2024",
  "description": "Offre spéciale : -15% + livraison offerte",
  "pourcentageReduction": 15.00,
  "livraisonGratuite": true,
  "montantMinimum": 40.00,
  "scope": "SELLER",
  "usagesMaxGlobal": 50,
  "usagesMaxParUtilisateur": 1,
  "dateDebut": "2024-01-01T00:00:00",
  "dateExpiration": "2024-06-30T23:59:59"
}
```

### 3. Lister mes coupons

```http
GET /api/coupons/seller/my-coupons
Authorization: Bearer <seller_token>
```

### 4. Modifier un de mes coupons

```http
PUT /api/coupons/seller/1
Authorization: Bearer <seller_token>

{
  "code": "MABOUTIQUE10",
  "description": "10% sur tous mes produits - PROLONGÉ",
  "pourcentageReduction": 10.00,
  "livraisonGratuite": false,
  "montantMinimum": 20.00,
  "scope": "SELLER",
  "usagesMaxGlobal": 150,
  "usagesMaxParUtilisateur": 2,
  "dateDebut": "2024-01-01T00:00:00",
  "dateExpiration": "2025-12-31T23:59:59"
}
```

### 5. Activer/Désactiver un coupon

```http
PUT /api/coupons/seller/1/toggle
Authorization: Bearer <seller_token>
```

### 6. Supprimer un coupon

```http
DELETE /api/coupons/seller/1
Authorization: Bearer <seller_token>
```

**Note**: Échoue si le coupon a déjà été utilisé

### 7. Voir les statistiques d'un coupon

```http
GET /api/coupons/seller/1/stats
Authorization: Bearer <seller_token>
```

**Réponse**: `200 OK`
```json
{
  "couponId": 1,
  "code": "MABOUTIQUE10",
  "nombreUtilisations": 25,
  "montantTotalEconomise": 125.50,
  "tauxUtilisation": 25.00,
  "nombreUtilisateursUniques": 20
}
```

---

## 👤 Tests Client

### 1. Valider un coupon simple

```http
POST /api/coupons/validate?code=PROMO15&sousTotal=100&fraisLivraison=10
Authorization: Bearer <client_token>
```

**Réponse**: `200 OK`
```json
{
  "valide": true,
  "message": "Coupon appliqué avec succès",
  "reductionPourcentage": 15.00,
  "reductionMontantFixe": 0,
  "reductionLivraison": 0,
  "reductionTotale": 15.00,
  "sousTotal": 100.00,
  "fraisLivraison": 10.00,
  "totalAvantCoupon": 110.00,
  "totalApresCoupon": 95.00,
  "codeApplique": "PROMO15"
}
```

### 2. Valider un coupon hybride

```http
POST /api/coupons/validate?code=BIENVENUE2024&sousTotal=100&fraisLivraison=10
Authorization: Bearer <client_token>
```

**Réponse**: `200 OK`
```json
{
  "valide": true,
  "message": "Coupon appliqué avec succès",
  "reductionPourcentage": 20.00,
  "reductionMontantFixe": 5.00,
  "reductionLivraison": 10.00,
  "reductionTotale": 35.00,
  "sousTotal": 100.00,
  "fraisLivraison": 0,
  "totalAvantCoupon": 110.00,
  "totalApresCoupon": 75.00,
  "codeApplique": "BIENVENUE2024"
}
```

### 3. Valider avec catégories

```http
POST /api/coupons/validate?code=FRUITS20&sousTotal=50&fraisLivraison=10&categoryIds=1&categoryIds=3
Authorization: Bearer <client_token>
```

### 4. Coupon invalide - Montant minimum non atteint

```http
POST /api/coupons/validate?code=BIENVENUE2024&sousTotal=30&fraisLivraison=10
Authorization: Bearer <client_token>
```

**Réponse**: `200 OK`
```json
{
  "valide": false,
  "message": "Montant minimum de 50.00 DT requis"
}
```

### 5. Coupon invalide - Déjà utilisé

```http
POST /api/coupons/validate?code=BIENVENUE2024&sousTotal=100&fraisLivraison=10
Authorization: Bearer <client_token>
```

**Réponse**: `200 OK`
```json
{
  "valide": false,
  "message": "Vous avez déjà utilisé ce coupon le nombre maximum de fois"
}
```

### 6. Coupon invalide - Code inexistant

```http
POST /api/coupons/validate?code=INVALID&sousTotal=100&fraisLivraison=10
Authorization: Bearer <client_token>
```

**Réponse**: `500 Internal Server Error`
```json
{
  "message": "Code coupon invalide"
}
```

---

## 🧮 Tests de calcul hybride

### Scénario 1: Coupon -20% + -5 DT + Livraison offerte

**Panier**: 100 DT  
**Livraison**: 10 DT  
**Total avant coupon**: 110 DT

**Calcul**:
1. Réduction 20%: 100 × 0.20 = 20 DT → Reste 80 DT
2. Réduction fixe: 80 - 5 = 75 DT
3. Livraison offerte: 10 DT économisés
4. **Total après coupon**: 75 DT
5. **Économie totale**: 35 DT

### Scénario 2: Coupon -50% avec plafond 30 DT

**Panier**: 100 DT  
**Livraison**: 10 DT  
**Plafond**: 30 DT

**Calcul**:
1. Réduction 50%: 100 × 0.50 = 50 DT
2. Plafond appliqué: 30 DT (max)
3. Montant final: 100 - 30 = 70 DT
4. **Total après coupon**: 80 DT (70 + 10 livraison)
5. **Économie totale**: 30 DT

### Scénario 3: Réduction supérieure au montant

**Panier**: 10 DT  
**Coupon**: -20% + -5 DT

**Calcul**:
1. Réduction 20%: 10 × 0.20 = 2 DT → Reste 8 DT
2. Réduction fixe: 8 - 5 = 3 DT
3. **Total après coupon**: 3 DT (ne peut pas être négatif)

---

## 🔍 Tests de validation

### Test 1: Créer un coupon sans réduction

```http
POST /api/coupons/admin

{
  "code": "INVALID",
  "description": "Coupon invalide",
  "pourcentageReduction": null,
  "montantFixeReduction": null,
  "livraisonGratuite": false,
  "scope": "GLOBAL",
  "usagesMaxGlobal": 100,
  "usagesMaxParUtilisateur": 1,
  "dateDebut": "2024-01-01T00:00:00",
  "dateExpiration": "2024-12-31T23:59:59"
}
```

**Réponse**: `500 Internal Server Error`
```json
{
  "message": "Au moins une réduction doit être définie"
}
```

### Test 2: Créer un coupon avec dates invalides

```http
POST /api/coupons/admin

{
  "code": "INVALID",
  "description": "Dates invalides",
  "pourcentageReduction": 10,
  "scope": "GLOBAL",
  "usagesMaxGlobal": 100,
  "usagesMaxParUtilisateur": 1,
  "dateDebut": "2024-12-31T23:59:59",
  "dateExpiration": "2024-01-01T00:00:00"
}
```

**Réponse**: `500 Internal Server Error`
```json
{
  "message": "La date d'expiration doit être après la date de début"
}
```

### Test 3: Code coupon déjà existant

```http
POST /api/coupons/admin

{
  "code": "BIENVENUE2024",
  "description": "Doublon",
  "pourcentageReduction": 10,
  "scope": "GLOBAL",
  "usagesMaxGlobal": 100,
  "usagesMaxParUtilisateur": 1,
  "dateDebut": "2024-01-01T00:00:00",
  "dateExpiration": "2024-12-31T23:59:59"
}
```

**Réponse**: `500 Internal Server Error`
```json
{
  "message": "Ce code coupon existe déjà"
}
```

---

## 📊 Tests de statistiques

### 1. Statistiques d'un coupon

```http
GET /api/coupons/1/stats
Authorization: Bearer <token>
```

### 2. Détails d'un coupon

```http
GET /api/coupons/1
Authorization: Bearer <token>
```

---

## 🔐 Tests de permissions

### Test 1: Vendeur essaie de créer un coupon global

```http
POST /api/coupons/admin
Authorization: Bearer <seller_token>
```

**Réponse**: `403 Forbidden`

### Test 2: Client essaie d'accéder aux coupons admin

```http
GET /api/coupons/admin/all
Authorization: Bearer <client_token>
```

**Réponse**: `403 Forbidden`

### Test 3: Vendeur essaie de modifier le coupon d'un autre vendeur

```http
PUT /api/coupons/seller/999
Authorization: Bearer <seller_token>
```

**Réponse**: `500 Internal Server Error`
```json
{
  "message": "Vous n'avez pas la permission de modifier ce coupon"
}
```

---

## 📝 Collection Postman

Vous pouvez importer cette collection dans Postman :

```json
{
  "info": {
    "name": "Coupons Hybrides API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8080/api/coupons"
    },
    {
      "key": "adminToken",
      "value": "YOUR_ADMIN_TOKEN"
    },
    {
      "key": "sellerToken",
      "value": "YOUR_SELLER_TOKEN"
    },
    {
      "key": "clientToken",
      "value": "YOUR_CLIENT_TOKEN"
    }
  ]
}
```

---

## ✅ Checklist de tests

- [ ] Admin peut créer un coupon global
- [ ] Admin peut voir tous les coupons
- [ ] Admin peut bloquer/débloquer un coupon
- [ ] Vendeur peut créer un coupon boutique
- [ ] Vendeur peut voir uniquement ses coupons
- [ ] Vendeur peut activer/désactiver ses coupons
- [ ] Vendeur ne peut pas modifier les coupons d'autres vendeurs
- [ ] Client peut valider un coupon
- [ ] Calcul hybride fonctionne correctement
- [ ] Plafond de réduction est respecté
- [ ] Montant minimum est vérifié
- [ ] Limites d'utilisation sont respectées
- [ ] Catégories applicables fonctionnent
- [ ] Dates de validité sont vérifiées
- [ ] Statistiques sont correctes
- [ ] Permissions sont respectées

---

Bon test ! 🚀
