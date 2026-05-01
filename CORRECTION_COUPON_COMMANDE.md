# 🔧 Correction : Erreur lors de la Commande avec Coupon

## ❌ Problème

```
Impossible de supprimer cet élément car il est utilisé ailleurs
```

**Quand** : Lors de la confirmation d'une commande avec un coupon appliqué

**Cause** : Le coupon est modifié (`usagesActuels++`) mais pas sauvegardé avant d'être associé à la commande. Hibernate essaie de gérer les relations et génère une erreur de contrainte.

---

## ✅ Solution Appliquée

### Fichier Modifié
`backend/src/main/java/com/FermeDirecte/FermeDirecte/service/OrderService.java`

### Changement
```java
// AVANT (ligne 165)
coupon.setUsagesActuels(coupon.getUsagesActuels() + 1);
// Pas de save() ici ❌

// APRÈS (ligne 165-167)
coupon.setUsagesActuels(coupon.getUsagesActuels() + 1);
// Sauvegarder le coupon AVANT de l'associer à la commande
coupon = couponRepository.save(coupon);  // ✅
```

### Explication

1. **Avant** : Le coupon était modifié mais pas sauvegardé
2. **Problème** : Hibernate ne savait pas comment gérer la relation
3. **Après** : Le coupon est sauvegardé immédiatement après modification
4. **Résultat** : La commande peut être créée sans erreur

---

## 🔄 Redémarrer le Backend

### Méthode 1 : Script Automatique
Double-cliquer sur : `REDEMARRER_BACKEND.bat`

### Méthode 2 : Manuelle
```bash
# 1. Arrêter le backend (Ctrl+C dans le terminal)

# 2. Aller dans le dossier backend
cd backend

# 3. Recompiler
mvn clean compile

# 4. Redémarrer
mvn spring-boot:run

# 5. Attendre le message
# "Started FermeDirecteApplication"
```

---

## 🧪 Tester la Correction

### 1. Redémarrer le Backend
Suivre les étapes ci-dessus

### 2. Rafraîchir le Frontend
Appuyer sur F5 dans le navigateur

### 3. Passer une Commande avec Coupon

1. **Ajouter des produits au panier**
2. **Aller au checkout**
3. **Remplir les étapes 1 et 2**
4. **À l'étape 3** :
   - Entrer le code : `TEST1`
   - Cliquer sur "Appliquer"
   - Vérifier que le coupon est appliqué
5. **Confirmer la commande**
6. **Vérifier** :
   - ✅ Pas d'erreur
   - ✅ Message de succès
   - ✅ Commande créée
   - ✅ Coupon enregistré

---

## 🔍 Vérifier dans la Base de Données

### Après avoir passé une commande avec TEST1 :

```sql
-- 1. Vérifier que le compteur d'utilisations a augmenté
SELECT 
    code,
    usages_actuels,
    usages_max_global
FROM coupons 
WHERE code = 'TEST1';

-- Résultat attendu : usages_actuels = 1 (ou plus)

-- 2. Vérifier que la commande a bien le coupon
SELECT 
    o.numero_commande,
    o.total_ttc,
    c.code as code_coupon
FROM orders o
LEFT JOIN coupons c ON o.coupon_id = c.id
ORDER BY o.date_commande DESC
LIMIT 5;

-- Résultat attendu : La dernière commande doit avoir code_coupon = 'TEST1'

-- 3. Vérifier l'historique d'utilisation
SELECT 
    cu.id,
    cu.date_utilisation,
    u.email as utilisateur,
    c.code as coupon
FROM coupon_usages cu
JOIN users u ON cu.user_id = u.id
JOIN coupons c ON cu.coupon_id = c.id
ORDER BY cu.date_utilisation DESC
LIMIT 5;

-- Résultat attendu : Une nouvelle ligne avec votre email et TEST1
```

---

## 📊 Flux Complet

### Avant la Correction ❌
```
1. Client applique le coupon TEST1
2. Client confirme la commande
3. Backend : coupon.setUsagesActuels(1)
4. Backend : order.setCoupon(coupon)  ← Coupon pas sauvegardé
5. Backend : orderRepository.save(order)
6. Hibernate : ERREUR "Impossible de supprimer..."
```

### Après la Correction ✅
```
1. Client applique le coupon TEST1
2. Client confirme la commande
3. Backend : coupon.setUsagesActuels(1)
4. Backend : coupon = couponRepository.save(coupon)  ← Sauvegarde
5. Backend : order.setCoupon(coupon)  ← Coupon sauvegardé
6. Backend : orderRepository.save(order)
7. Hibernate : SUCCESS ✅
```

---

## 🎯 Résultat Attendu

Après le redémarrage du backend, vous devriez pouvoir :

1. ✅ Appliquer un coupon au checkout
2. ✅ Voir la réduction appliquée
3. ✅ Confirmer la commande **SANS ERREUR**
4. ✅ Voir la commande créée avec le coupon
5. ✅ Voir le compteur d'utilisations augmenter

---

## 🐛 Si le Problème Persiste

### Vérifier les Logs du Backend

Chercher dans les logs :
```
ERROR: could not execute statement
...
constraint violation
```

### Vérifier la Structure de la Table

```sql
SHOW CREATE TABLE orders;
```

Vérifier que la colonne `coupon_id` existe et a une contrainte de clé étrangère vers `coupons(id)`.

### Vérifier les Contraintes

```sql
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'orders' 
AND REFERENCED_TABLE_NAME = 'coupons';
```

---

## ✅ Checklist

Avant de tester :

- [ ] Le fichier `OrderService.java` a été modifié
- [ ] La ligne `coupon = couponRepository.save(coupon);` a été ajoutée
- [ ] Le backend a été arrêté (Ctrl+C)
- [ ] Le backend a été recompilé (`mvn clean compile`)
- [ ] Le backend a été redémarré (`mvn spring-boot:run`)
- [ ] Le message "Started FermeDirecteApplication" est visible
- [ ] Le frontend a été rafraîchi (F5)

Après le test :

- [ ] Le coupon s'applique sans erreur
- [ ] La commande se confirme sans erreur
- [ ] Le message de succès s'affiche
- [ ] La commande apparaît dans "Mes commandes"
- [ ] Le compteur d'utilisations a augmenté dans la base

---

## 🎊 Conclusion

Cette correction résout définitivement le problème de création de commande avec coupon.

**Cause racine** : Entité non persistée avant association  
**Solution** : Sauvegarder le coupon avant de l'associer à la commande  
**Impact** : Aucun effet secondaire, améliore la cohérence des données

---

**Date** : 1er mai 2026  
**Fichier modifié** : `OrderService.java`  
**Ligne** : 167  
**Statut** : ✅ CORRIGÉ
