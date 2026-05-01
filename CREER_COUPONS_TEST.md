# 🎫 Créer des Coupons de Test

## ❌ Problème Actuel

```
Status: 500
Message: "Code coupon invalide"
```

**Cause** : Le coupon `BIENVENUE10` n'existe pas dans la base de données.

---

## ✅ Solution : Créer les Coupons

### Méthode 1 : Via phpMyAdmin (RECOMMANDÉ)

1. **Ouvrir phpMyAdmin**
   - Aller sur : http://localhost/phpmyadmin
   - Sélectionner la base de données `fermedirecte`

2. **Ouvrir l'onglet SQL**

3. **Copier-coller ce code** :

```sql
-- Créer le coupon BIENVENUE10
INSERT INTO coupons (
    code, description, pourcentage_reduction, montant_fixe_reduction,
    livraison_gratuite, montant_minimum, montant_maximum_reduction,
    scope, vendeur_id, usages_max_global, usages_actuels, 
    usages_max_par_utilisateur, date_debut, date_expiration, 
    date_creation, actif, bloque
) VALUES (
    'BIENVENUE10', 
    'Réduction de 10% pour tous', 
    10.0, NULL, 0, 0.0, NULL,
    'GLOBAL', NULL, 1000, 0, 10,
    '2026-01-01 00:00:00', '2026-12-31 23:59:59', 
    NOW(), 1, 0
);
```

4. **Cliquer sur "Exécuter"**

5. **Vérifier** :

```sql
SELECT * FROM coupons WHERE code = 'BIENVENUE10';
```

Vous devriez voir :
- `actif = 1`
- `bloque = 0`
- `date_debut = 2026-01-01`
- `date_expiration = 2026-12-31`

---

### Méthode 2 : Via le Fichier SQL

1. **Ouvrir le fichier** : `backend/sql/CREER_COUPON_TEST.sql`

2. **Dans phpMyAdmin** :
   - Onglet "Importer"
   - Choisir le fichier `CREER_COUPON_TEST.sql`
   - Cliquer sur "Exécuter"

3. **Résultat** : 5 coupons créés automatiquement

---

## 🎫 Coupons de Test Créés

| Code | Type | Réduction | Minimum | Description |
|------|------|-----------|---------|-------------|
| **BIENVENUE10** | Pourcentage | 10% | 0 DT | Pour tous |
| **FIXE5DT** | Montant fixe | 5 DT | 20 DT | Réduction fixe |
| **LIVRAISONGRATUITE** | Livraison | Gratuite | 30 DT | Livraison offerte |
| **SUPER20** | Hybride | 10% + 5 DT + Livraison | 50 DT | Super promo |
| **PROMO20** | Pourcentage | 20% | 15 DT | Grande réduction |

---

## 🧪 Tester Immédiatement

### Dans la console du navigateur (F12) :

```javascript
const token = localStorage.getItem('fd_token');
fetch('http://localhost:8080/api/coupons/validate?code=BIENVENUE10&sousTotal=21.45&fraisLivraison=0', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => {
  if (data.valide) {
    console.log('✅ COUPON VALIDE !');
    console.log('💰 Réduction:', data.reductionTotale, 'DT');
    console.log('💵 Total après:', data.totalApresCoupon, 'DT');
  } else {
    console.log('❌ Erreur:', data.message);
  }
});
```

**Résultat attendu** :
```
✅ COUPON VALIDE !
💰 Réduction: 2.145 DT
💵 Total après: 19.305 DT
```

---

## 🎯 Tester dans l'Application

1. **Aller au checkout**
   - Ajouter des produits au panier
   - Cliquer sur "Commander"
   - Aller jusqu'à l'étape 3 (Confirmation)

2. **Appliquer le coupon**
   - Dans la section "Code promo"
   - Entrer : `BIENVENUE10`
   - Cliquer sur "Appliquer"

3. **Vérifier**
   - Badge vert de confirmation
   - Ligne "Réduction coupon (BIENVENUE10): -2.15 DT"
   - Total mis à jour

---

## 🔍 Vérification dans la Base de Données

### Vérifier que le coupon est actif :

```sql
SELECT 
    code,
    actif,
    bloque,
    DATE_FORMAT(date_debut, '%Y-%m-%d') as debut,
    DATE_FORMAT(date_expiration, '%Y-%m-%d') as expiration,
    usages_actuels,
    usages_max_global
FROM coupons 
WHERE code = 'BIENVENUE10';
```

**Résultat attendu** :
```
code         | actif | bloque | debut      | expiration | usages_actuels | usages_max_global
BIENVENUE10  | 1     | 0      | 2026-01-01 | 2026-12-31 | 0              | 1000
```

---

## 🚨 Si le Coupon Existe Déjà mais ne Fonctionne Pas

### Vérifier les dates :

```sql
SELECT 
    code,
    date_debut,
    date_expiration,
    NOW() as maintenant,
    CASE 
        WHEN date_debut > NOW() THEN '❌ Pas encore commencé'
        WHEN date_expiration < NOW() THEN '❌ Expiré'
        ELSE '✅ Valide'
    END as statut_date
FROM coupons 
WHERE code = 'BIENVENUE10';
```

### Corriger les dates si nécessaire :

```sql
UPDATE coupons 
SET 
    date_debut = '2026-01-01 00:00:00',
    date_expiration = '2026-12-31 23:59:59',
    actif = 1,
    bloque = 0
WHERE code = 'BIENVENUE10';
```

---

## 📊 Voir Tous les Coupons

```sql
SELECT 
    id,
    code,
    description,
    pourcentage_reduction,
    montant_fixe_reduction,
    livraison_gratuite,
    actif,
    bloque,
    usages_actuels,
    usages_max_global
FROM coupons 
ORDER BY date_creation DESC;
```

---

## 🎨 Créer un Coupon Personnalisé

### Template SQL :

```sql
INSERT INTO coupons (
    code,                           -- Ex: 'NOEL2026'
    description,                    -- Ex: 'Promo de Noël'
    pourcentage_reduction,          -- Ex: 15.0 (pour 15%) ou NULL
    montant_fixe_reduction,         -- Ex: 10.0 (pour 10 DT) ou NULL
    livraison_gratuite,             -- 0 (non) ou 1 (oui)
    montant_minimum,                -- Ex: 25.0 (minimum 25 DT) ou 0.0
    montant_maximum_reduction,      -- Ex: 50.0 (max 50 DT) ou NULL
    scope,                          -- 'GLOBAL' ou 'SELLER'
    vendeur_id,                     -- NULL pour global, ou ID du vendeur
    usages_max_global,              -- Ex: 500
    usages_actuels,                 -- 0 (au début)
    usages_max_par_utilisateur,     -- Ex: 3
    date_debut,                     -- Ex: '2026-12-01 00:00:00'
    date_expiration,                -- Ex: '2026-12-31 23:59:59'
    date_creation,                  -- NOW()
    actif,                          -- 1 (actif)
    bloque                          -- 0 (non bloqué)
) VALUES (
    'VOTRECODECOUPON',
    'Votre description',
    10.0,                           -- 10% de réduction
    NULL,                           -- Pas de réduction fixe
    0,                              -- Pas de livraison gratuite
    0.0,                            -- Pas de minimum
    NULL,                           -- Pas de maximum
    'GLOBAL',
    NULL,
    1000,
    0,
    5,
    '2026-01-01 00:00:00',
    '2026-12-31 23:59:59',
    NOW(),
    1,
    0
);
```

---

## ✅ Checklist Finale

Après avoir créé les coupons :

- [ ] Le coupon existe dans la table `coupons`
- [ ] `actif = 1`
- [ ] `bloque = 0`
- [ ] `date_debut` <= aujourd'hui
- [ ] `date_expiration` >= aujourd'hui
- [ ] Le test dans la console retourne `valide: true`
- [ ] Le coupon s'applique dans l'application

---

## 🎉 Résultat Final

Une fois les coupons créés, vous pourrez :

1. ✅ Appliquer `BIENVENUE10` pour 10% de réduction
2. ✅ Appliquer `FIXE5DT` pour 5 DT de réduction
3. ✅ Appliquer `LIVRAISONGRATUITE` pour la livraison gratuite
4. ✅ Appliquer `SUPER20` pour une réduction hybride
5. ✅ Appliquer `PROMO20` pour 20% de réduction

**Le système de coupons est maintenant pleinement fonctionnel !** 🎊

---

**Date** : 1er mai 2026  
**Statut** : ✅ Prêt à tester
