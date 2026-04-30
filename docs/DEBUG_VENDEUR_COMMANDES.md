# 🔍 Débogage : Commandes du vendeur non affichées

## Étapes de vérification

### 1. Vérifier que le backend a bien redémarré

Assurez-vous d'avoir redémarré le backend après les modifications :

```bash
cd ferme-directe-complete/backend
mvn clean package -DskipTests
mvn spring-boot:run
```

Attendez le message : `Started FermeDirecte in X seconds`

### 2. Vérifier les logs du backend

Quand vous vous connectez en tant que vendeur et allez sur la page "Commandes", regardez les logs du backend.

Vous devriez voir :
```
INFO  ... : Récupération des commandes pour le vendeur: email@vendeur.com
DEBUG ... : Vendeur trouvé: ID=X, Email=email@vendeur.com
DEBUG ... : Nombre total de commandes: Y
INFO  ... : Nombre de commandes trouvées pour le vendeur email@vendeur.com: Z
```

**Si vous voyez `Z = 0`**, cela signifie qu'aucune commande ne contient vos produits.

### 3. Vérifier dans la base de données

Ouvrez phpMyAdmin : http://localhost/phpmyadmin

#### A. Vérifier que le vendeur a un SellerProfile

```sql
SELECT u.id, u.email, u.role, sp.id as seller_profile_id, sp.nom_boutique
FROM users u
LEFT JOIN seller_profiles sp ON sp.user_id = u.id
WHERE u.email = 'VOTRE_EMAIL_VENDEUR';
```

**Résultat attendu** : Vous devez avoir un `seller_profile_id` (pas NULL)

**Si NULL** : Le vendeur n'a pas de profil vendeur. Il faut en créer un.

#### B. Vérifier que le vendeur a des produits

```sql
SELECT p.id, p.nom, p.prix, sp.nom_boutique
FROM products p
JOIN seller_profiles sp ON p.seller_profile_id = sp.id
JOIN users u ON sp.user_id = u.id
WHERE u.email = 'VOTRE_EMAIL_VENDEUR';
```

**Résultat attendu** : Liste de vos produits

**Si vide** : Le vendeur n'a pas de produits. Créez-en via l'interface.

#### C. Vérifier les commandes

```sql
SELECT 
    o.id,
    o.numero_commande,
    o.date_commande,
    p.nom as produit,
    sp.nom_boutique as vendeur
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON oi.product_id = p.id
LEFT JOIN seller_profiles sp ON p.seller_profile_id = sp.id
ORDER BY o.date_commande DESC;
```

**Vérifiez** : Est-ce que vos produits apparaissent dans les commandes ?

### 4. Vérifier la console du navigateur

Ouvrez la console du navigateur (F12) et regardez s'il y a des erreurs :

- Onglet **Console** : Erreurs JavaScript ?
- Onglet **Network** : Cherchez la requête `GET /api/orders/seller-orders`
  - Status : 200 OK ?
  - Response : Contient des données ?

### 5. Problèmes courants

#### Problème 1 : Le vendeur n'a pas de SellerProfile

**Solution** : Créer un SellerProfile pour le vendeur

```sql
-- Remplacez USER_ID par l'ID du vendeur
INSERT INTO seller_profiles (user_id, nom_boutique, description, note)
VALUES (USER_ID, 'Ma Boutique', 'Description de ma boutique', 0.0);
```

#### Problème 2 : Les produits n'ont pas de seller_profile_id

**Solution** : Associer les produits au SellerProfile

```sql
-- Remplacez SELLER_PROFILE_ID par l'ID du profil vendeur
UPDATE products 
SET seller_profile_id = SELLER_PROFILE_ID 
WHERE seller_profile_id IS NULL;
```

#### Problème 3 : Le rôle n'est pas SELLER

**Solution** : Vérifier le rôle de l'utilisateur

```sql
SELECT id, email, role FROM users WHERE email = 'VOTRE_EMAIL';
```

Si le rôle n'est pas `SELLER`, modifiez-le :

```sql
UPDATE users SET role = 'SELLER' WHERE email = 'VOTRE_EMAIL';
```

#### Problème 4 : L'endpoint n'est pas appelé

Vérifiez dans la console du navigateur (Network) si la requête est bien envoyée.

**Si la requête n'est pas envoyée** : Vérifiez que `authService.isSeller()` retourne `true`.

### 6. Test complet

Pour tester complètement :

1. **Créez un produit** en tant que vendeur
2. **Passez une commande** avec ce produit (depuis un compte client)
3. **Reconnectez-vous** en tant que vendeur
4. **Allez sur "Commandes"**
5. **Vous devriez voir la commande** !

### 7. Logs détaillés

Si le problème persiste, envoyez-moi :

1. Les logs du backend (terminal) quand vous chargez la page Commandes
2. La réponse de l'API dans le navigateur (Network > seller-orders > Response)
3. Le résultat des requêtes SQL ci-dessus

## 🆘 Besoin d'aide ?

Si après toutes ces vérifications le problème persiste, envoyez-moi :
- Les logs du backend
- Les résultats des requêtes SQL
- Des captures d'écran de la console du navigateur
