# ⚡ Solution Rapide - Créer des Coupons

## 🎯 Problème

Quand vous cliquez sur **"Créer"**, vous obtenez :
```
❌ Erreur lors de la sauvegarde du coupon
```

## 🔑 Cause

La base de données n'est **pas encore configurée**. Les tables `coupons`, `coupon_categories` et `coupon_usages` n'existent pas.

---

## ✅ Solution en 5 Minutes

### 📍 Étape 1 : Ouvrir phpMyAdmin
1. Allez sur `http://localhost/phpmyadmin`
2. Cliquez sur la base de données **`fermedirecte`** dans le menu de gauche
3. Cliquez sur l'onglet **"SQL"** en haut

### 📍 Étape 2 : Trouver la Contrainte
Copiez-collez cette requête et cliquez sur **"Exécuter"** :
```sql
SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE REFERENCED_TABLE_NAME = 'coupons'
AND TABLE_SCHEMA = 'fermedirecte';
```

**Résultat :** Vous verrez une ligne avec un nom de contrainte (ex: `orders_ibfk_1` ou `fk_orders_coupon`)

**📝 NOTEZ CE NOM !** Vous en aurez besoin à l'étape suivante.

---

### 📍 Étape 3 : Supprimer la Contrainte
Remplacez `NOM_CONTRAINTE_ICI` par le nom que vous avez noté :
```sql
ALTER TABLE orders DROP FOREIGN KEY NOM_CONTRAINTE_ICI;
```

**Exemple :**
```sql
ALTER TABLE orders DROP FOREIGN KEY orders_ibfk_1;
```

Cliquez sur **"Exécuter"**

**Résultat attendu :** ✅ Message de succès

---

### 📍 Étape 4 : Nettoyer les Anciennes Tables
Copiez-collez ces 2 requêtes **une par une** :

```sql
DROP TABLE IF EXISTS coupons_old_backup;
```
Cliquez sur **"Exécuter"**

```sql
RENAME TABLE coupons TO coupons_old_backup;
```
Cliquez sur **"Exécuter"**

**Résultat attendu :** ✅ L'ancienne table est renommée

---

### 📍 Étape 5 : Créer les Nouvelles Tables

**Option A : Copier-Coller Tout d'un Coup (Recommandé)**

1. Ouvrez le fichier **`backend/sql/SOLUTION_MYSQL_PHPMYADMIN.sql`**
2. Copiez **TOUT** le contenu à partir de l'étape 5 jusqu'à l'étape 10 (les 3 CREATE TABLE + les INSERT)
3. Collez dans phpMyAdmin
4. Cliquez sur **"Exécuter"**

**Option B : Une par Une**

Copiez-collez chaque requête CREATE TABLE séparément :

**Table 1 : coupons**
```sql
CREATE TABLE coupons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(500) NOT NULL,
    pourcentage_reduction DECIMAL(5, 2),
    montant_fixe_reduction DECIMAL(19, 2),
    livraison_gratuite BOOLEAN NOT NULL DEFAULT FALSE,
    montant_minimum DECIMAL(19, 2),
    montant_maximum_reduction DECIMAL(19, 2),
    scope VARCHAR(20) NOT NULL,
    seller_id BIGINT,
    usages_max_global INT NOT NULL,
    usages_actuels INT NOT NULL DEFAULT 0,
    usages_max_par_utilisateur INT NOT NULL DEFAULT 1,
    date_debut DATETIME NOT NULL,
    date_expiration DATETIME NOT NULL,
    date_creation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    bloque BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_coupons_seller FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Table 2 : coupon_categories**
```sql
CREATE TABLE coupon_categories (
    coupon_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    PRIMARY KEY (coupon_id, category_id),
    CONSTRAINT fk_coupon_categories_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Table 3 : coupon_usages**
```sql
CREATE TABLE coupon_usages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    coupon_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    montant_reduit DECIMAL(19, 2) NOT NULL,
    date_utilisation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_usage (coupon_id, user_id, order_id),
    CONSTRAINT fk_coupon_usages_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    CONSTRAINT fk_coupon_usages_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_coupon_usages_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Résultat attendu :** ✅ 3 tables créées

---

### 📍 Étape 6 : Créer les Index
Copiez-collez ces requêtes **toutes ensemble** :
```sql
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_scope ON coupons(scope);
CREATE INDEX idx_coupons_seller ON coupons(seller_id);
CREATE INDEX idx_coupons_dates ON coupons(date_debut, date_expiration);
CREATE INDEX idx_coupons_actif ON coupons(actif, bloque);
CREATE INDEX idx_coupon_usages_coupon ON coupon_usages(coupon_id);
CREATE INDEX idx_coupon_usages_user ON coupon_usages(user_id);
```

Cliquez sur **"Exécuter"**

**Résultat attendu :** ✅ 7 index créés

---

### 📍 Étape 7 : Recréer la Contrainte dans orders
```sql
ALTER TABLE orders 
ADD CONSTRAINT fk_orders_coupon 
FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL;
```

Cliquez sur **"Exécuter"**

**Résultat attendu :** ✅ Contrainte créée

---

### 📍 Étape 8 : Insérer les Coupons de Test
Copiez-collez ces 5 requêtes **toutes ensemble** :
```sql
INSERT INTO coupons (code, description, pourcentage_reduction, montant_fixe_reduction, livraison_gratuite, montant_minimum, montant_maximum_reduction, scope, seller_id, usages_max_global, usages_actuels, usages_max_par_utilisateur, date_debut, date_expiration) VALUES ('BIENVENUE2024', 'Coupon de bienvenue : -20% + -5 DT + livraison offerte', 20.00, 5.00, TRUE, 50.00, NULL, 'GLOBAL', NULL, 100, 0, 1, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY));

INSERT INTO coupons (code, description, pourcentage_reduction, montant_fixe_reduction, livraison_gratuite, montant_minimum, montant_maximum_reduction, scope, seller_id, usages_max_global, usages_actuels, usages_max_par_utilisateur, date_debut, date_expiration) VALUES ('PROMO15', 'Promotion : -15% sur tout le site', 15.00, NULL, FALSE, 30.00, NULL, 'GLOBAL', NULL, 200, 0, 2, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY));

INSERT INTO coupons (code, description, pourcentage_reduction, montant_fixe_reduction, livraison_gratuite, montant_minimum, montant_maximum_reduction, scope, seller_id, usages_max_global, usages_actuels, usages_max_par_utilisateur, date_debut, date_expiration) VALUES ('REDUC10', 'Réduction de 10 DT sur votre commande', NULL, 10.00, FALSE, 40.00, NULL, 'GLOBAL', NULL, 150, 0, 1, NOW(), DATE_ADD(NOW(), INTERVAL 45 DAY));

INSERT INTO coupons (code, description, pourcentage_reduction, montant_fixe_reduction, livraison_gratuite, montant_minimum, montant_maximum_reduction, scope, seller_id, usages_max_global, usages_actuels, usages_max_par_utilisateur, date_debut, date_expiration) VALUES ('LIVRAISONGRATUITE', 'Livraison offerte sans minimum', NULL, NULL, TRUE, NULL, NULL, 'GLOBAL', NULL, 500, 0, 3, NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY));

INSERT INTO coupons (code, description, pourcentage_reduction, montant_fixe_reduction, livraison_gratuite, montant_minimum, montant_maximum_reduction, scope, seller_id, usages_max_global, usages_actuels, usages_max_par_utilisateur, date_debut, date_expiration) VALUES ('MEGA50', 'Méga promo : -50% (max 30 DT de réduction)', 50.00, NULL, FALSE, 100.00, 30.00, 'GLOBAL', NULL, 50, 0, 1, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY));
```

Cliquez sur **"Exécuter"**

**Résultat attendu :** ✅ 5 lignes insérées

---

### 📍 Étape 9 : Vérifier
```sql
SELECT id, code, description, actif FROM coupons;
```

**Résultat attendu :** Vous devriez voir 5 coupons :
- BIENVENUE2024
- PROMO15
- REDUC10
- LIVRAISONGRATUITE
- MEGA50

---

## 🎉 C'est Terminé !

### Maintenant, testez la création de coupon :

1. **Redémarrez le backend** (si déjà démarré) :
   ```bash
   cd ferme-directe-complete/backend
   mvn spring-boot:run
   ```

2. **Redémarrez le frontend** (si déjà démarré) :
   ```bash
   cd ferme-directe-complete/frontend
   ng serve
   ```

3. **Testez dans l'application** :
   - Connectez-vous (admin ou vendeur)
   - Menu → TRANSACTIONS → Coupons
   - Cliquez sur **"+ Nouveau Coupon"**
   - Remplissez le formulaire
   - Cliquez sur **"Créer"**

**Résultat attendu :** ✅ **Coupon créé avec succès !**

---

## 🆘 Si Ça Ne Marche Toujours Pas

### Vérifiez la Console du Backend
Regardez les logs dans le terminal où vous avez lancé `mvn spring-boot:run`

### Vérifiez la Console du Frontend
Ouvrez les outils de développement (F12) et regardez l'onglet "Console" et "Network"

### Vérifiez que les Tables Existent
Dans phpMyAdmin, cliquez sur la base `fermedirecte` et vérifiez que vous voyez :
- ✅ `coupons`
- ✅ `coupon_categories`
- ✅ `coupon_usages`

---

## 📞 Guides Complets

Si vous voulez plus de détails :
- **`GUIDE_PHPMYADMIN_ETAPE_PAR_ETAPE.md`** - Guide détaillé avec explications
- **`SOLUTION_MYSQL_PHPMYADMIN.sql`** - Toutes les requêtes SQL
- **`PROBLEME_CREATION_COUPON.md`** - Diagnostic complet

---

**🚀 Bonne chance ! La création de coupons va maintenant fonctionner parfaitement !**

