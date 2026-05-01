# 🔍 Diagnostic Erreur 409 - Conflit lors de la Commande

## ❌ Erreurs Détectées

### 1. Erreur Backend : 409 Conflict
```
POST http://localhost:8080/api/orders 409 (Conflict)
```

### 2. Erreur Frontend : FormControl
```
ERROR RuntimeError: NG01203: No value accessor for form control name: 'modePaiement'
```

### 3. Erreur Backend : 500 sur /api/addresses
```
Failed to load resource: the server responded with a status of 500
```

---

## 🎯 Solutions

### Solution 1 : Erreur 409 (Conflit de Données)

L'erreur 409 signifie généralement un conflit de contrainte unique ou de clé étrangère.

#### Vérifier les Logs du Backend

Dans le terminal du backend, cherchez :
```
ERROR
...
constraint
...
duplicate
```

#### Causes Possibles

1. **Numéro de commande en double**
2. **Coupon déjà utilisé par cet utilisateur** (limite atteinte)
3. **Produit en rupture de stock**
4. **Adresse invalide**

#### Test dans phpMyAdmin

```sql
-- 1. Vérifier les dernières commandes
SELECT 
    numero_commande,
    COUNT(*) as nb
FROM orders
GROUP BY numero_commande
HAVING COUNT(*) > 1;

-- Si des doublons existent, c'est le problème !

-- 2. Vérifier les utilisations du coupon TEST1 par votre utilisateur
SELECT 
    cu.id,
    cu.date_utilisation,
    u.email,
    c.code
FROM coupon_usages cu
JOIN users u ON cu.user_id = u.id
JOIN coupons c ON cu.coupon_id = c.id
WHERE u.email = 'votre-email@example.com'  -- Remplacer par votre email
AND c.code = 'TEST1';

-- 3. Vérifier la limite d'utilisation du coupon
SELECT 
    code,
    usages_actuels,
    usages_max_global,
    usages_max_par_utilisateur
FROM coupons
WHERE code = 'TEST1';
```

---

### Solution 2 : Erreur FormControl (modePaiement)

Cette erreur vient du HTML du checkout qui a un problème avec le formulaire de paiement.

#### Vérifier checkout.component.html

Le problème est probablement dans la section paiement. Le `formControlName="modePaiement"` doit être sur un élément de formulaire valide (input, select, etc.), pas sur un div.

#### Correction Rapide

Rafraîchir la page (F5) devrait résoudre temporairement le problème.

---

### Solution 3 : Erreur 500 sur /api/addresses

Le backend ne peut pas charger les adresses sauvegardées.

#### Vérifier dans phpMyAdmin

```sql
-- Vérifier la table addresses
SELECT * FROM addresses LIMIT 5;

-- Vérifier les adresses de votre utilisateur
SELECT 
    a.*
FROM addresses a
JOIN users u ON a.user_id = u.id
WHERE u.email = 'votre-email@example.com';  -- Remplacer
```

---

## 🔧 Solution Complète

### Étape 1 : Nettoyer les Données de Test

```sql
-- Supprimer les utilisations de coupon de test
DELETE FROM coupon_usages 
WHERE coupon_id IN (SELECT id FROM coupons WHERE code = 'TEST1');

-- Réinitialiser le compteur du coupon
UPDATE coupons 
SET usages_actuels = 0 
WHERE code = 'TEST1';

-- Vérifier
SELECT code, usages_actuels, usages_max_global 
FROM coupons 
WHERE code = 'TEST1';
```

### Étape 2 : Vérifier la Configuration du Coupon

```sql
SELECT 
    code,
    actif,
    bloque,
    usages_actuels,
    usages_max_global,
    usages_max_par_utilisateur,
    DATE_FORMAT(date_debut, '%Y-%m-%d') as debut,
    DATE_FORMAT(date_expiration, '%Y-%m-%d') as expiration
FROM coupons 
WHERE code = 'TEST1';
```

**Résultat attendu** :
- `actif = 1`
- `bloque = 0`
- `usages_actuels = 0`
- `usages_max_global > 0`
- `usages_max_par_utilisateur > 0`
- Dates valides

### Étape 3 : Tester Sans Coupon

1. Aller au checkout
2. **NE PAS** appliquer de coupon
3. Confirmer la commande
4. Si ça fonctionne → Le problème vient du coupon
5. Si ça ne fonctionne pas → Le problème est ailleurs

### Étape 4 : Regarder les Logs du Backend

Dans le terminal du backend, copiez les 20 dernières lignes après avoir essayé de passer la commande.

Cherchez :
```
ERROR
Exception
constraint
duplicate
```

---

## 🧪 Test de Diagnostic Complet

### Dans la Console du Navigateur (F12)

```javascript
// Test 1 : Vérifier le token
const token = localStorage.getItem('fd_token');
console.log('Token:', token ? 'OK' : 'ABSENT');

// Test 2 : Vérifier le panier
fetch('http://localhost:8080/api/cart', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(cart => {
  console.log('Panier:', cart);
  console.log('Nombre d\'articles:', cart.lignes?.length || 0);
  console.log('Total:', cart.total);
});

// Test 3 : Tester la création de commande SANS coupon
const testOrder = {
  adresse: {
    prenom: 'Test',
    nom: 'User',
    rue: '123 Rue Test',
    codePostal: '1000',
    ville: 'Tunis',
    pays: 'Tunisie',
    telephone: '12345678'
  },
  modePaiement: 'ESPECES',
  notes: 'Test sans coupon'
};

fetch('http://localhost:8080/api/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testOrder)
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(data => {
  console.log('Réponse:', data);
})
.catch(err => {
  console.error('Erreur:', err);
});
```

---

## 📋 Checklist de Diagnostic

- [ ] La colonne `coupon_id` existe dans `orders` ✅
- [ ] Le coupon TEST1 existe et est actif
- [ ] Le compteur `usages_actuels` n'a pas atteint la limite
- [ ] Pas de doublons dans `numero_commande`
- [ ] Le panier contient des produits
- [ ] Les produits ont du stock
- [ ] L'utilisateur est connecté
- [ ] Le backend est démarré
- [ ] Les logs du backend ne montrent pas d'erreur SQL

---

## 🎯 Prochaines Étapes

1. **Exécuter le nettoyage SQL** (Étape 1)
2. **Tester sans coupon** (Étape 3)
3. **Copier les logs du backend** et me les envoyer
4. **Exécuter le test de diagnostic** dans la console

---

**Une fois que vous aurez fait ces étapes, nous saurons exactement d'où vient le problème !**
