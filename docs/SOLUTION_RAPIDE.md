# ⚡ Solution Rapide - Tableau de Bord Vide

## 🎯 Problème

Votre tableau de bord affiche :
- ✅ 2 produits
- ✅ 1 commande en attente
- ✅ 1.35 DT de revenus
- ❌ Graphique vide
- ❌ Commandes récentes vides
- ❌ Stock faible vide

## 💡 Cause

Vos données existantes ne correspondent pas aux critères :
- Tous vos produits ont probablement un stock >= 10
- Vos commandes sont probablement trop anciennes (> 7 jours)

## ✅ Solution en 3 Minutes

### Étape 1 : Trouver votre ID de vendeur

Ouvrez votre client PostgreSQL (pgAdmin, DBeaver, psql, etc.) et exécutez :

```sql
SELECT 
    u.id as user_id,
    u.email,
    sp.id as seller_profile_id,
    sp.nom_entreprise
FROM users u
JOIN seller_profiles sp ON sp.user_id = u.id
WHERE u.role = 'SELLER'
ORDER BY u.id DESC;
```

**Notez votre `seller_profile_id`** : __________

---

### Étape 2 : Exécuter le script de correction

Ouvrez le fichier `backend/FIX_DASHBOARD_DATA.sql` et :

1. **Remplacez** tous les `<SELLER_PROFILE_ID>` par votre ID
2. **Exécutez** le script complet dans votre base de données

Ou copiez-collez ces commandes (en remplaçant `<SELLER_PROFILE_ID>`) :

```sql
-- Mettre 2 produits en stock faible
UPDATE products SET stock = 3
WHERE id = (SELECT id FROM products WHERE seller_profile_id = <SELLER_PROFILE_ID> AND actif = true ORDER BY id LIMIT 1);

UPDATE products SET stock = 7
WHERE id = (SELECT id FROM products WHERE seller_profile_id = <SELLER_PROFILE_ID> AND actif = true ORDER BY id LIMIT 1 OFFSET 1);

-- Mettre les commandes dans les 7 derniers jours
UPDATE orders SET date_commande = NOW()
WHERE id IN (
    SELECT DISTINCT o.id FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON oi.product_id = p.id
    WHERE p.seller_profile_id = <SELLER_PROFILE_ID>
    ORDER BY o.date_commande DESC LIMIT 1
);

UPDATE orders SET date_commande = NOW() - INTERVAL '1 day'
WHERE id IN (
    SELECT DISTINCT o.id FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON oi.product_id = p.id
    WHERE p.seller_profile_id = <SELLER_PROFILE_ID>
    ORDER BY o.date_commande DESC LIMIT 1 OFFSET 1
);
```

---

### Étape 3 : Recharger le tableau de bord

1. Retournez dans votre navigateur
2. Appuyez sur `Ctrl+Shift+R` (ou `Cmd+Shift+R` sur Mac) pour forcer le rechargement
3. Ou videz le cache et rechargez

---

## ✅ Résultat Attendu

Après avoir exécuté le script, vous devriez voir :

```
┌─────────────────────────────────────────────────────┐
│  📦 2 Produits  │  📋 1 En Attente  │  💰 1.35 DT   │
├─────────────────────────────────────────────────────┤
│              📊 Graphique avec barres               │
├──────────────────────┬──────────────────────────────┤
│  📋 Commandes (1+)   │  📦 Stock Faible (2)         │
├─────────────────────────────────────────────────────┤
│         📈 Statistiques (1 total, 1 attente)        │
└─────────────────────────────────────────────────────┘
```

---

## 🔍 Vérification

Pour vérifier que tout est OK, exécutez :

```sql
-- Remplacez <SELLER_PROFILE_ID>
SELECT 
    'Total Produits' as stat, COUNT(*) as val
FROM products WHERE seller_profile_id = <SELLER_PROFILE_ID> AND actif = true
UNION ALL
SELECT 'Stock Faible', COUNT(*)
FROM products WHERE seller_profile_id = <SELLER_PROFILE_ID> AND actif = true AND stock < 10
UNION ALL
SELECT 'Commandes 7j', COUNT(DISTINCT o.id)
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON oi.product_id = p.id
WHERE p.seller_profile_id = <SELLER_PROFILE_ID>
AND o.date_commande >= NOW() - INTERVAL '7 days';
```

**Résultat attendu** :
- Total Produits : 2 ou plus
- Stock Faible : 2
- Commandes 7j : 1 ou plus

---

## 🆘 Toujours Vide ?

### Vérification 1 : Console du navigateur

1. Ouvrez la console (F12)
2. Rechargez la page
3. Cherchez : `Données du dashboard vendeur:`
4. Vérifiez que les tableaux ne sont pas vides

### Vérification 2 : Logs du backend

Dans le terminal où tourne Spring Boot, cherchez des erreurs.

### Vérification 3 : Redémarrer le backend

```bash
# Arrêter (Ctrl+C)
cd backend
mvn spring-boot:run
```

---

## 📚 Plus d'Aide ?

Consultez : [GUIDE_DEBOGAGE.md](./GUIDE_DEBOGAGE.md)

---

**Bonne chance ! 🚀**
