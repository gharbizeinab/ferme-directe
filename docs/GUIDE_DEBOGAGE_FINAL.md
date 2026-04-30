# 🔍 Guide de débogage final - Erreur de commande

## ✅ Modifications appliquées

J'ai ajouté des logs détaillés pour identifier exactement où le problème se produit.

### Fichiers modifiés :
1. **OrderService.java** - Ajout de logs détaillés
2. **GlobalExceptionHandler.java** - Amélioration des messages d'erreur

## 🚀 ÉTAPES OBLIGATOIRES

### Étape 1 : REDÉMARRER LE BACKEND (OBLIGATOIRE !)

**Sans redémarrage, les modifications ne prendront PAS effet !**

```bash
# 1. Arrêtez le serveur backend actuel (Ctrl+C dans le terminal)

# 2. Allez dans le dossier backend
cd ferme-directe-complete/backend

# 3. Recompilez le projet
mvn clean package -DskipTests

# 4. Redémarrez le serveur
mvn spring-boot:run
```

**Attendez le message** : `Started FermeDirecte in X seconds`

### Étape 2 : Tester la commande et COPIER LES LOGS

1. **Ouvrez le terminal où le backend tourne**
2. **Gardez-le visible** pendant que vous testez
3. **Essayez de passer une commande** dans l'application
4. **Regardez immédiatement les logs** dans le terminal

Vous devriez voir des messages comme :
```
INFO  ... : Début de la commande pour l'utilisateur: votre@email.com
DEBUG ... : Utilisateur trouvé: ID=1
DEBUG ... : Panier trouvé avec 1 articles
DEBUG ... : Création d'une nouvelle adresse
DEBUG ... : Sauvegarde de l'adresse en base de données
DEBUG ... : Adresse sauvegardée avec ID=5
```

**Si vous voyez une erreur, COPIEZ TOUTE LA TRACE** (toutes les lignes rouges)

### Étape 3 : Vérifier la console du navigateur

1. Ouvrez le navigateur (Chrome/Edge)
2. Appuyez sur **F12** pour ouvrir les outils de développement
3. Allez dans l'onglet **Network** (Réseau)
4. Essayez de passer la commande
5. Cherchez la requête **POST** vers `/api/orders`
6. Cliquez dessus et regardez :
   - **Headers** : Vérifiez que le token est présent
   - **Payload** : Vérifiez les données envoyées
   - **Response** : **COPIEZ LE MESSAGE D'ERREUR COMPLET**

### Étape 4 : Vérifier la base de données

Ouvrez phpMyAdmin : http://localhost/phpmyadmin

#### A. Vérifier la table `addresses`

1. Sélectionnez la base `fermedirecte`
2. Cliquez sur la table `addresses`
3. Allez dans "Structure"

**Colonnes requises** :
```
✅ id (bigint, PRIMARY KEY, AUTO_INCREMENT)
✅ user_id (bigint, NOT NULL)
✅ rue (varchar(255), NOT NULL)
✅ ville (varchar(255), NOT NULL)
✅ code_postal (varchar(255), NOT NULL)
✅ pays (varchar(255), NOT NULL)
✅ prenom (varchar(255))
✅ nom (varchar(255))
✅ gouvernorat (varchar(255))
✅ telephone (varchar(255))
✅ instructions (text)
✅ principal (tinyint(1), NOT NULL, DEFAULT 0)
```

**Si des colonnes manquent**, exécutez dans l'onglet SQL :
```sql
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS prenom VARCHAR(255);
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS nom VARCHAR(255);
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS gouvernorat VARCHAR(255);
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS telephone VARCHAR(255);
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS instructions TEXT;
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS principal TINYINT(1) NOT NULL DEFAULT 0;
```

#### B. Vérifier que vous avez des produits avec du stock

```sql
SELECT id, nom, prix, stock FROM products WHERE stock > 0;
```

Si aucun produit n'a de stock, ajoutez-en :
```sql
UPDATE products SET stock = 10 WHERE stock = 0 OR stock IS NULL;
```

#### C. Vérifier votre panier

```sql
SELECT ci.*, p.nom, p.stock 
FROM cart_items ci 
JOIN products p ON ci.product_id = p.id 
JOIN carts c ON ci.cart_id = c.id 
JOIN users u ON c.user_id = u.id 
WHERE u.email = 'VOTRE_EMAIL_ICI';
```

Remplacez `VOTRE_EMAIL_ICI` par votre email de connexion.

## 🐛 Erreurs courantes et solutions

### Erreur 1 : "Panier vide"
**Cause** : Votre panier est vide
**Solution** : Ajoutez des produits au panier avant de commander

### Erreur 2 : "Stock insuffisant pour : [nom produit]"
**Cause** : Le produit n'a plus de stock
**Solution** : Mettez à jour le stock dans phpMyAdmin (voir ci-dessus)

### Erreur 3 : "Column 'prenom' not found" ou "Unknown column"
**Cause** : Les colonnes n'existent pas dans la table addresses
**Solution** : Exécutez le script SQL dans phpMyAdmin (voir Étape 4.A)

### Erreur 4 : "object references an unsaved transient instance"
**Cause** : Le backend n'a pas été redémarré avec le nouveau code
**Solution** : Redémarrez le backend (voir Étape 1)

### Erreur 5 : "Connection refused" ou "Unable to connect"
**Cause** : MySQL n'est pas démarré
**Solution** : 
- Ouvrez XAMPP Control Panel
- Démarrez MySQL (bouton Start)
- Vérifiez qu'il affiche "Running" en vert

### Erreur 6 : "Unauthorized" ou "401"
**Cause** : Vous n'êtes pas connecté ou votre session a expiré
**Solution** : Reconnectez-vous à l'application

### Erreur 7 : "Veuillez fournir une adresse de livraison"
**Cause** : Les données d'adresse ne sont pas envoyées correctement
**Solution** : Vérifiez que tous les champs obligatoires sont remplis (prénom, nom, rue, ville, code postal, pays)

## 📋 Checklist avant de me contacter

Avant de me renvoyer un message, vérifiez que vous avez fait :

- [ ] ✅ Redémarré le backend avec `mvn clean package -DskipTests` puis `mvn spring-boot:run`
- [ ] ✅ Attendu le message "Started FermeDirecte"
- [ ] ✅ Vérifié que MySQL est démarré dans XAMPP
- [ ] ✅ Vérifié que la table `addresses` a toutes les colonnes
- [ ] ✅ Vérifié que vous avez des produits dans votre panier
- [ ] ✅ Vérifié que les produits ont du stock
- [ ] ✅ Copié les logs du backend (terminal)
- [ ] ✅ Copié la réponse d'erreur du navigateur (onglet Network > Response)

## 📤 Que m'envoyer ?

Si le problème persiste, envoyez-moi :

### 1. Les logs du backend
Copiez TOUTE la trace d'erreur du terminal, par exemple :
```
ERROR ... : Erreur inattendue - Type: java.lang.NullPointerException, Message: ...
java.lang.NullPointerException: ...
    at com.FermeDirecte.FermeDirecte.service.OrderService.passerCommande(...)
    ...
```

### 2. La réponse de l'API
Dans le navigateur (F12 > Network > POST /api/orders > Response) :
```json
{
  "status": 500,
  "error": "Erreur serveur",
  "message": "...",
  "timestamp": "..."
}
```

### 3. Les données envoyées
Dans le navigateur (F12 > Network > POST /api/orders > Payload) :
```json
{
  "adresse": { ... },
  "modePaiement": "...",
  ...
}
```

### 4. Capture d'écran
- Structure de la table `addresses` dans phpMyAdmin
- Le message d'erreur dans l'application

Avec ces informations, je pourrai identifier le problème exact ! 🎯
