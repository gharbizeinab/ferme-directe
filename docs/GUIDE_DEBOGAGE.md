# 🔍 Guide de Débogage - Tableau de Bord Vendeur

## 🎯 Problème Actuel

Le tableau de bord affiche :
- ✅ 2 produits
- ✅ 1 commande en attente  
- ✅ 1.35 DT de revenus
- ❌ Graphique des revenus vide
- ❌ Section "Commandes récentes" vide
- ❌ Section "Stock faible" affiche "Tous vos produits ont un stock suffisant"

---

## 🔍 Étape 1 : Vérifier les Données dans la Base de Données

### 1.1 Trouver votre ID de vendeur

```sql
SELECT u.id as user_id, u.email, sp.id as seller_profile_id, sp.nom_entreprise
FROM users u
LEFT JOIN seller_profiles sp ON sp.user_id = u.id
WHERE u.role = 'SELLER'
ORDER BY u.id DESC;
```

**Notez** : `seller_profile_id` (vous en aurez besoin)

---

### 1.2 Vérifier vos produits

Remplacez `<SELLER_PROFILE_ID>` par votre ID :

```sql
SELECT p.id, p.nom, p.prix, p.stock, p.actif
FROM products p
WHERE p.seller_profile_id = <SELLER_PROFILE_ID>;
```

**Vérifiez** :
- Avez-vous des produits avec `stock < 10` ?
- Tous vos produits ont-ils `actif = true` ?

---

### 1.3 Vérifier vos commandes

```sql
SELECT o.id, o.numero_commande, o.statut, o.total_ttc, o.date_commande
FROM orders o
ORDER BY o.date_commande DESC
LIMIT 10;
```

**Vérifiez** :
- Avez-vous des commandes récentes ?
- Quelle est leur date ?

---

### 1.4 Vérifier les lignes de commande liées à vos produits

Remplacez `<SELLER_PROFILE_ID>` :

```sql
SELECT 
    oi.id, 
    oi.order_id, 
    oi.product_id, 
    oi.nom_produit, 
    oi.quantite, 
    oi.sous_total,
    o.numero_commande,
    o.statut,
    o.date_commande
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
JOIN products p ON oi.product_id = p.id
WHERE p.seller_profile_id = <SELLER_PROFILE_ID>
ORDER BY o.date_commande DESC;
```

**Vérifiez** :
- Avez-vous des lignes de commande ?
- Les `product_id` correspondent-ils à vos produits ?

---

## 🔍 Étape 2 : Vérifier la Réponse de l'API

### 2.1 Ouvrir la Console du Navigateur

1. Ouvrez votre navigateur (Chrome/Firefox)
2. Appuyez sur `F12` pour ouvrir les outils de développement
3. Allez dans l'onglet "Console"
4. Rechargez le tableau de bord

### 2.2 Vérifier les Logs

Vous devriez voir un log :
```
Données du dashboard vendeur: { ... }
```

**Vérifiez** :
- `revenusParJour` : Est-ce un tableau ? Est-il vide ?
- `commandesRecentes` : Est-ce un tableau ? Est-il vide ?
- `stockFaible` : Est-ce un tableau ? Est-il vide ?
- `statistiquesCommandes` : Est-ce un objet ? Contient-il des valeurs ?

---

### 2.3 Vérifier l'Appel API

Dans l'onglet "Network" (Réseau) :
1. Rechargez la page
2. Cherchez la requête `seller` ou `dashboard/seller`
3. Cliquez dessus
4. Allez dans l'onglet "Response"

**Vérifiez** :
- Le statut HTTP (devrait être 200)
- Le contenu de la réponse JSON

---

## 🔍 Étape 3 : Problèmes Courants et Solutions

### Problème 1 : `revenusParJour` est vide

**Cause** : Aucune commande dans les 7 derniers jours

**Solution** : Créez une commande récente

```sql
-- Remplacez <USER_ID>, <SELLER_PROFILE_ID>, <PRODUCT_ID>
INSERT INTO orders (numero_commande, user_id, statut, statut_paiement, sous_total, remise, frais_livraison, total_ttc, mode_paiement, date_commande)
VALUES 
('CMD-TEST-' || LPAD(NEXTVAL('order_seq')::TEXT, 6, '0'), <USER_ID>, 'EN_ATTENTE', 'EN_ATTENTE', 50.00, 0.00, 5.00, 55.00, 'CARTE_BANCAIRE', NOW());

-- Récupérer l'ID de la commande créée
SELECT id FROM orders WHERE numero_commande LIKE 'CMD-TEST-%' ORDER BY id DESC LIMIT 1;

-- Créer une ligne de commande (remplacez <ORDER_ID> et <PRODUCT_ID>)
INSERT INTO order_items (order_id, product_id, nom_produit, prix_unitaire, quantite, sous_total)
VALUES 
(<ORDER_ID>, <PRODUCT_ID>, 'Produit Test', 10.00, 5, 50.00);
```

---

### Problème 2 : `commandesRecentes` est vide

**Cause** : Aucune commande contenant vos produits

**Solution** : Vérifiez que les `order_items` sont bien liés à vos produits

```sql
-- Vérifier les liens
SELECT 
    oi.id,
    oi.order_id,
    oi.product_id,
    p.seller_profile_id,
    o.numero_commande
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN orders o ON oi.order_id = o.id
WHERE p.seller_profile_id = <SELLER_PROFILE_ID>;
```

Si vide, créez des liens (voir Problème 1).

---

### Problème 3 : `stockFaible` est vide

**Cause** : Tous vos produits ont un stock >= 10

**Solution** : Mettez à jour le stock de quelques produits

```sql
-- Mettre à jour le stock de vos produits
UPDATE products
SET stock = 5
WHERE id IN (
    SELECT id FROM products 
    WHERE seller_profile_id = <SELLER_PROFILE_ID> 
    LIMIT 2
);
```

---

### Problème 4 : `statistiquesCommandes` est vide ou null

**Cause** : Problème dans le backend

**Solution** : Vérifiez les logs du backend

```bash
# Dans le terminal où tourne le backend
# Cherchez les erreurs ou exceptions
```

---

## 🔍 Étape 4 : Vérifier le Backend

### 4.1 Vérifier les Logs du Backend

Dans le terminal où tourne Spring Boot, cherchez :
- ❌ Erreurs SQL
- ❌ NullPointerException
- ❌ Erreurs de mapping

### 4.2 Tester l'API Directement

Utilisez Postman ou cURL :

```bash
curl -X GET "http://localhost:8080/api/dashboard/seller" \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -H "Content-Type: application/json"
```

**Vérifiez** :
- Le statut HTTP
- Le contenu de la réponse

---

## 🔍 Étape 5 : Solutions Rapides

### Solution 1 : Créer des Données de Test Complètes

Exécutez ce script SQL :

```sql
-- 1. Trouver votre seller_profile_id
SELECT sp.id FROM seller_profiles sp 
JOIN users u ON sp.user_id = u.id 
WHERE u.email = 'VOTRE_EMAIL';

-- 2. Créer 3 produits avec différents stocks
INSERT INTO products (nom, description, prix, stock, unite, seller_profile_id, category_id, actif, date_creation)
VALUES 
('Tomates Bio', 'Tomates fraîches', 5.50, 3, 'kg', <SELLER_PROFILE_ID>, 1, true, NOW()),
('Carottes', 'Carottes du jardin', 3.20, 8, 'kg', <SELLER_PROFILE_ID>, 1, true, NOW()),
('Salades', 'Salades vertes', 2.00, 25, 'pièce', <SELLER_PROFILE_ID>, 1, true, NOW());

-- 3. Créer 3 commandes à différentes dates
INSERT INTO orders (numero_commande, user_id, statut, statut_paiement, sous_total, remise, frais_livraison, total_ttc, mode_paiement, date_commande)
VALUES 
('CMD-001', <USER_ID>, 'EN_ATTENTE', 'EN_ATTENTE', 50.00, 0.00, 5.00, 55.00, 'CARTE_BANCAIRE', NOW()),
('CMD-002', <USER_ID>, 'CONFIRME', 'PAYE', 75.00, 0.00, 5.00, 80.00, 'CARTE_BANCAIRE', NOW() - INTERVAL '1 day'),
('CMD-003', <USER_ID>, 'LIVRE', 'PAYE', 100.00, 0.00, 5.00, 105.00, 'CARTE_BANCAIRE', NOW() - INTERVAL '2 days');

-- 4. Lier les commandes aux produits
-- Récupérer les IDs des commandes et produits créés
SELECT id, numero_commande FROM orders WHERE numero_commande LIKE 'CMD-%' ORDER BY id DESC LIMIT 3;
SELECT id, nom FROM products WHERE seller_profile_id = <SELLER_PROFILE_ID> ORDER BY id DESC LIMIT 3;

-- Créer les order_items (remplacez les IDs)
INSERT INTO order_items (order_id, product_id, nom_produit, prix_unitaire, quantite, sous_total)
VALUES 
(<ORDER_ID_1>, <PRODUCT_ID_1>, 'Tomates Bio', 5.50, 10, 55.00),
(<ORDER_ID_2>, <PRODUCT_ID_2>, 'Carottes', 3.20, 25, 80.00),
(<ORDER_ID_3>, <PRODUCT_ID_3>, 'Salades', 2.00, 50, 100.00);
```

---

### Solution 2 : Redémarrer le Backend

Parfois, un simple redémarrage résout le problème :

```bash
# Arrêter le backend (Ctrl+C)
# Relancer
cd backend
mvn spring-boot:run
```

---

### Solution 3 : Vider le Cache du Navigateur

1. Ouvrez les outils de développement (F12)
2. Clic droit sur le bouton de rafraîchissement
3. Choisissez "Vider le cache et actualiser"

---

## 📊 Checklist de Vérification

- [ ] J'ai trouvé mon `seller_profile_id`
- [ ] J'ai au moins 2 produits actifs
- [ ] J'ai au moins 1 produit avec stock < 10
- [ ] J'ai au moins 1 commande récente (< 7 jours)
- [ ] Les `order_items` sont liés à mes produits
- [ ] L'API retourne des données (vérifiées dans la console)
- [ ] Les tableaux ne sont pas vides dans la réponse API
- [ ] Le backend ne montre pas d'erreurs

---

## 🆘 Besoin d'Aide Supplémentaire ?

### Informations à Fournir

Si le problème persiste, fournissez :

1. **Résultat de cette requête** :
```sql
SELECT 
    u.email,
    sp.id as seller_profile_id,
    COUNT(DISTINCT p.id) as nb_produits,
    COUNT(DISTINCT CASE WHEN p.stock < 10 THEN p.id END) as nb_stock_faible,
    COUNT(DISTINCT o.id) as nb_commandes
FROM users u
JOIN seller_profiles sp ON sp.user_id = u.id
LEFT JOIN products p ON p.seller_profile_id = sp.id AND p.actif = true
LEFT JOIN order_items oi ON oi.product_id = p.id
LEFT JOIN orders o ON o.id = oi.order_id
WHERE u.email = 'VOTRE_EMAIL'
GROUP BY u.email, sp.id;
```

2. **Logs de la console du navigateur** (copier-coller)

3. **Réponse de l'API** (onglet Network > Response)

4. **Logs du backend** (erreurs éventuelles)

---

**Bon débogage ! 🔍**
