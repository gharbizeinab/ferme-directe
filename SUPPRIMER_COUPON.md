# 🗑️ Supprimer un Coupon Utilisé

## ❌ Problème

```
Impossible de supprimer cet élément car il est utilisé ailleurs
```

**Cause** : Le coupon est référencé dans d'autres tables (commandes, utilisations, etc.)

---

## ✅ Solution Recommandée : DÉSACTIVER

Au lieu de supprimer, **désactivez** le coupon :

### Dans phpMyAdmin :

```sql
-- Remplacer 'TEST1' par le code de votre coupon
UPDATE coupons 
SET 
    actif = 0,
    bloque = 1
WHERE code = 'TEST1';
```

**Résultat** :
- ✅ Le coupon reste dans l'historique
- ✅ Les commandes passées gardent leur référence
- ✅ Le coupon ne peut plus être utilisé
- ✅ Pas d'erreur de contrainte

---

## 🗑️ Solution Alternative : SUPPRIMER COMPLÈTEMENT

⚠️ **ATTENTION** : À utiliser uniquement pour les coupons de test en développement

### Étape 1 : Trouver l'ID du Coupon

```sql
SELECT id, code FROM coupons WHERE code = 'TEST1';
```

Notez l'ID (par exemple : `6`)

### Étape 2 : Supprimer les Dépendances

```sql
-- Remplacer 6 par l'ID de votre coupon
DELETE FROM coupon_usages WHERE coupon_id = 6;
DELETE FROM coupon_categories WHERE coupon_id = 6;
UPDATE orders SET coupon_id = NULL WHERE coupon_id = 6;
```

### Étape 3 : Supprimer le Coupon

```sql
DELETE FROM coupons WHERE id = 6;
```

### Étape 4 : Vérifier

```sql
SELECT * FROM coupons WHERE code = 'TEST1';
-- Devrait retourner 0 ligne
```

---

## 🧹 Nettoyer TOUS les Coupons de Test

Pour supprimer tous les coupons de test d'un coup :

```sql
-- Désactiver temporairement les contraintes
SET FOREIGN_KEY_CHECKS = 0;

-- Supprimer les dépendances
DELETE FROM coupon_usages 
WHERE coupon_id IN (SELECT id FROM coupons WHERE code LIKE 'TEST%');

DELETE FROM coupon_categories 
WHERE coupon_id IN (SELECT id FROM coupons WHERE code LIKE 'TEST%');

UPDATE orders 
SET coupon_id = NULL 
WHERE coupon_id IN (SELECT id FROM coupons WHERE code LIKE 'TEST%');

-- Supprimer les coupons
DELETE FROM coupons WHERE code LIKE 'TEST%';

-- Réactiver les contraintes
SET FOREIGN_KEY_CHECKS = 1;
```

---

## 🔍 Vérifier les Dépendances

Avant de supprimer, vérifiez où le coupon est utilisé :

```sql
-- Remplacer 6 par l'ID du coupon
SET @coupon_id = 6;

SELECT 
    'Utilisations' as type,
    COUNT(*) as nombre
FROM coupon_usages 
WHERE coupon_id = @coupon_id

UNION ALL

SELECT 
    'Commandes' as type,
    COUNT(*) as nombre
FROM orders 
WHERE coupon_id = @coupon_id

UNION ALL

SELECT 
    'Catégories' as type,
    COUNT(*) as nombre
FROM coupon_categories 
WHERE coupon_id = @coupon_id;
```

---

## 📋 Comparaison des Méthodes

| Méthode | Avantages | Inconvénients | Recommandé |
|---------|-----------|---------------|------------|
| **Désactiver** | ✅ Garde l'historique<br>✅ Pas d'erreur<br>✅ Réversible | ❌ Le coupon reste en base | ✅ **OUI** |
| **Supprimer** | ✅ Nettoie la base | ❌ Perd l'historique<br>❌ Irréversible | ⚠️ Test uniquement |

---

## 🎯 Cas d'Usage

### Cas 1 : Coupon Expiré
**Action** : Désactiver
```sql
UPDATE coupons SET actif = 0 WHERE code = 'PROMO2025';
```

### Cas 2 : Coupon de Test
**Action** : Supprimer (si jamais utilisé)
```sql
-- Vérifier d'abord
SELECT COUNT(*) FROM coupon_usages WHERE coupon_id = 6;
-- Si 0, supprimer
DELETE FROM coupons WHERE id = 6;
```

### Cas 3 : Coupon Frauduleux
**Action** : Bloquer
```sql
UPDATE coupons SET bloque = 1, actif = 0 WHERE code = 'FRAUD123';
```

### Cas 4 : Nettoyer les Tests
**Action** : Supprimer tous les TEST*
```sql
-- Utiliser le script de nettoyage complet
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM coupon_usages WHERE coupon_id IN (SELECT id FROM coupons WHERE code LIKE 'TEST%');
DELETE FROM coupons WHERE code LIKE 'TEST%';
SET FOREIGN_KEY_CHECKS = 1;
```

---

## 💡 Bonnes Pratiques

### ✅ À FAIRE

1. **Désactiver** au lieu de supprimer en production
2. **Vérifier** les dépendances avant de supprimer
3. **Faire un backup** avant toute suppression
4. **Utiliser des codes préfixés** (TEST*, DEMO*) pour les tests

### ❌ À NE PAS FAIRE

1. ❌ Supprimer des coupons en production
2. ❌ Supprimer sans vérifier les dépendances
3. ❌ Désactiver `FOREIGN_KEY_CHECKS` en production
4. ❌ Supprimer des coupons avec un historique d'utilisation

---

## 🔧 Dans l'Application

### Interface Admin

Pour désactiver un coupon via l'interface :

1. Aller sur `/admin/coupons`
2. Trouver le coupon
3. Cliquer sur le bouton "Bloquer" (🚫)
4. Le coupon sera désactivé automatiquement

**Note** : La suppression via l'interface devrait être désactivée pour les coupons utilisés.

---

## 🛡️ Sécurité

### Contraintes de Clés Étrangères

Les contraintes empêchent la suppression accidentelle :

```sql
-- Voir les contraintes
SHOW CREATE TABLE coupon_usages;
SHOW CREATE TABLE orders;
```

**C'est une bonne chose !** Cela protège l'intégrité des données.

---

## 📝 Script Complet

Pour supprimer un coupon spécifique en toute sécurité :

```sql
-- 1. Définir le code du coupon
SET @code_to_delete = 'TEST1';

-- 2. Trouver l'ID
SET @coupon_id = (SELECT id FROM coupons WHERE code = @code_to_delete);

-- 3. Afficher les dépendances
SELECT 
    @coupon_id as id,
    @code_to_delete as code,
    (SELECT COUNT(*) FROM coupon_usages WHERE coupon_id = @coupon_id) as usages,
    (SELECT COUNT(*) FROM orders WHERE coupon_id = @coupon_id) as commandes;

-- 4. Si vous voulez vraiment supprimer :
DELETE FROM coupon_usages WHERE coupon_id = @coupon_id;
DELETE FROM coupon_categories WHERE coupon_id = @coupon_id;
UPDATE orders SET coupon_id = NULL WHERE coupon_id = @coupon_id;
DELETE FROM coupons WHERE id = @coupon_id;

-- 5. Vérifier
SELECT * FROM coupons WHERE code = @code_to_delete;
```

---

## 🎯 Résumé

| Situation | Action | Commande |
|-----------|--------|----------|
| Coupon expiré | Désactiver | `UPDATE coupons SET actif = 0 WHERE code = 'X'` |
| Coupon de test jamais utilisé | Supprimer | `DELETE FROM coupons WHERE code = 'X'` |
| Coupon de test utilisé | Supprimer avec dépendances | Voir script complet |
| Coupon frauduleux | Bloquer | `UPDATE coupons SET bloque = 1 WHERE code = 'X'` |
| Nettoyer tous les tests | Script de nettoyage | Voir section "Nettoyer TOUS" |

---

**Recommandation finale** : En production, **toujours désactiver** au lieu de supprimer ! 🛡️

---

**Date** : 1er mai 2026  
**Fichier SQL** : `backend/sql/SUPPRIMER_COUPON_UTILISE.sql`
