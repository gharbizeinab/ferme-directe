# 🐛 Problème : "Erreur lors de la sauvegarde du coupon"

## 📍 Situation Actuelle

Lorsque vous cliquez sur le bouton **"Créer"** dans le formulaire de coupon, vous obtenez l'erreur :
```
Erreur lors de la sauvegarde du coupon
```

---

## 🔍 Diagnostic

### 1. **Frontend ✅ CORRECT**

Le formulaire frontend est correctement configuré :
- ✅ Le champ `usagesMaxGlobal` est optionnel (valeur par défaut 999999)
- ✅ Tous les modules Material sont importés
- ✅ Le service `CouponService` est correctement configuré
- ✅ Les requêtes HTTP sont bien formées

**Code dans `coupon-form.component.ts` (ligne 119) :**
```typescript
usagesMaxGlobal: formValue.usagesMaxGlobal || 999999, // ✅ Valeur par défaut si vide
```

### 2. **Backend ✅ CORRECT**

Le backend Java est correctement configuré :
- ✅ `CouponController` utilise `UserDetails` (pas `UserPrincipal`)
- ✅ `CouponService` utilise `email` (pas `userId`)
- ✅ Toutes les validations sont en place
- ✅ Les endpoints sont correctement mappés

### 3. **Base de Données 🔴 PROBLÈME**

**C'est ici que se trouve le problème !**

La base de données n'est **PAS encore configurée** :
- ❌ Les tables `coupons`, `coupon_categories`, `coupon_usages` n'existent pas
- ❌ L'ancienne table `coupons` existe mais avec une structure différente
- ❌ Une contrainte externe empêche la suppression de l'ancienne table

**Erreur MySQL :**
```
#1451 - Impossible de supprimer un enregistrement père : une constrainte externe l'empêche
```

---

## 🎯 Solution

### Étape 1 : Résoudre le Problème de Base de Données

Vous devez **ABSOLUMENT** exécuter les requêtes SQL avant de pouvoir créer des coupons.

**📖 Suivez ce guide :**
👉 **`GUIDE_PHPMYADMIN_ETAPE_PAR_ETAPE.md`**

**📄 Fichier SQL à exécuter :**
👉 **`backend/sql/SOLUTION_MYSQL_PHPMYADMIN.sql`**

---

## 📋 Checklist de Résolution

### ☐ 1. Ouvrir phpMyAdmin
- Allez sur `http://localhost/phpmyadmin`
- Sélectionnez la base de données `fermedirecte`

### ☐ 2. Identifier la contrainte externe
Exécutez cette requête :
```sql
SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE REFERENCED_TABLE_NAME = 'coupons'
AND TABLE_SCHEMA = 'fermedirecte';
```

**Notez le nom de la contrainte** (ex: `fk_orders_coupon` ou `orders_ibfk_1`)

### ☐ 3. Supprimer la contrainte
Remplacez `NOM_CONTRAINTE_ICI` par le nom trouvé :
```sql
ALTER TABLE orders DROP FOREIGN KEY NOM_CONTRAINTE_ICI;
```

### ☐ 4. Supprimer l'ancienne backup
```sql
DROP TABLE IF EXISTS coupons_old_backup;
```

### ☐ 5. Renommer la table actuelle
```sql
RENAME TABLE coupons TO coupons_old_backup;
```

### ☐ 6. Créer les 3 nouvelles tables
Exécutez les requêtes de création dans `SOLUTION_MYSQL_PHPMYADMIN.sql` :
- `CREATE TABLE coupons (...)`
- `CREATE TABLE coupon_categories (...)`
- `CREATE TABLE coupon_usages (...)`

### ☐ 7. Créer les index
Exécutez les requêtes `CREATE INDEX ...`

### ☐ 8. Recréer la contrainte dans orders
```sql
ALTER TABLE orders 
ADD CONSTRAINT fk_orders_coupon 
FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL;
```

### ☐ 9. Insérer les 5 coupons de test
Exécutez les 5 requêtes `INSERT INTO coupons ...`

### ☐ 10. Vérifier
```sql
SELECT id, code, description, actif FROM coupons;
```

**Résultat attendu :** 5 coupons affichés

---

## 🚀 Après la Résolution

Une fois la base de données configurée :

### 1. Redémarrer le Backend
```bash
cd ferme-directe-complete/backend
mvn spring-boot:run
```

### 2. Redémarrer le Frontend
```bash
cd ferme-directe-complete/frontend
ng serve
```

### 3. Tester la Création de Coupon
1. Connectez-vous (admin ou vendeur)
2. Menu → TRANSACTIONS → Coupons
3. Cliquez sur **"+ Nouveau Coupon"**
4. Remplissez le formulaire
5. Cliquez sur **"Créer"**

**Résultat attendu :** ✅ Coupon créé avec succès !

---

## 🆘 Erreurs Possibles

### Erreur : "Utilisateur non trouvé"
**Cause :** Vous n'êtes pas connecté ou le token JWT a expiré  
**Solution :** Reconnectez-vous

### Erreur : "Ce code coupon existe déjà"
**Cause :** Un coupon avec ce code existe déjà  
**Solution :** Utilisez un autre code

### Erreur : "Au moins une réduction doit être définie"
**Cause :** Aucune réduction n'est définie  
**Solution :** Définissez au moins une réduction (%, fixe ou livraison)

### Erreur : "La date d'expiration doit être après la date de début"
**Cause :** Les dates sont invalides  
**Solution :** Vérifiez les dates

### Erreur : "Seuls les admins peuvent créer des coupons globaux"
**Cause :** Vous êtes vendeur et essayez de créer un coupon global  
**Solution :** Créez un coupon vendeur ou connectez-vous en tant qu'admin

---

## 📊 Résumé

| Composant | État | Action Requise |
|-----------|------|----------------|
| Frontend | ✅ OK | Aucune |
| Backend | ✅ OK | Aucune |
| Base de données | 🔴 BLOQUÉ | **Exécuter les requêtes SQL** |

---

## 🎯 Prochaine Action

**👉 Exécutez les requêtes SQL dans phpMyAdmin**

Suivez le guide : **`GUIDE_PHPMYADMIN_ETAPE_PAR_ETAPE.md`**

Une fois la base de données configurée, la création de coupons fonctionnera parfaitement !

---

## 📞 Fichiers de Support

| Problème | Fichier à Consulter |
|----------|---------------------|
| Guide SQL étape par étape | `GUIDE_PHPMYADMIN_ETAPE_PAR_ETAPE.md` |
| Requêtes SQL à exécuter | `backend/sql/SOLUTION_MYSQL_PHPMYADMIN.sql` |
| État du projet | `ETAT_ACTUEL_PROJET.md` |
| Démarrage rapide | `DEMARRAGE_RAPIDE.md` |

---

**🔑 Point Clé :** Le problème n'est PAS dans le code (frontend ou backend), mais dans la **configuration de la base de données** qui n'a pas encore été faite.

