# 🎯 Solution Finale : Problème de Commande avec Coupon

## 📋 Résumé des Problèmes Identifiés

### ✅ Problèmes Résolus
1. **Backend** : Coupon non sauvegardé avant association → ✅ CORRIGÉ (ligne 167 OrderService.java)
2. **Frontend** : Propriété `couponCode` manquante dans Cart → ✅ Déjà présente dans models/index.ts

### ❌ Problèmes Actuels

#### 1. Erreur 500 lors de la validation du coupon
```
POST http://localhost:8080/api/coupons/validate?code=BIENVENUE10 500 (Internal Server Error)
Message: "Code coupon invalide"
```

**Cause** : Le coupon `BIENVENUE10` n'existe pas dans la base de données. Vous utilisez `TEST1` et `TEST2`.

#### 2. Erreur FormControl dans checkout
```
ERROR RuntimeError: NG01203: No value accessor for form control name: 'modePaiement'
```

**Cause** : Le HTML du checkout a probablement un problème de structure de formulaire.

#### 3. Erreur 500 sur /api/addresses
```
Failed to load resource: the server responded with a status of 500
```

**Cause** : Problème backend lors du chargement des adresses.

#### 4. Impossible de supprimer le coupon de test
```
Impossible de supprimer cet élément car il est utilisé ailleurs
```

**Cause** : Le coupon est référencé dans la table `orders` via la clé étrangère `fk_order_coupon`.

---

## 🔧 Solutions à Appliquer

### Solution 1 : Nettoyer les Données de Test dans phpMyAdmin

#### Étape 1 : Supprimer les commandes de test

```sql
-- Voir les commandes avec coupon
SELECT 
    o.id,
    o.numero_commande,
    o.total_ttc,
    c.code as coupon_code
FROM orders o
LEFT JOIN coupons c ON o.coupon_id = c.id
WHERE o.coupon_id IS NOT NULL
ORDER BY o.date_commande DESC;

-- Supprimer les commandes de test (ATTENTION : ajustez les IDs)
-- Remplacez X, Y, Z par les IDs des commandes de test
DELETE FROM orders WHERE id IN (X, Y, Z);

-- OU supprimer TOUTES les commandes (si c'est un environnement de test)
DELETE FROM order_items;
DELETE FROM orders;
```

#### Étape 2 : Nettoyer les utilisations de coupons

```sql
-- Supprimer toutes les utilisations de TEST1 et TEST2
DELETE FROM coupon_usages 
WHERE coupon_id IN (
    SELECT id FROM coupons WHERE code IN ('TEST1', 'TEST2')
);

-- Vérifier
SELECT * FROM coupon_usages;
```

#### Étape 3 : Réinitialiser les compteurs

```sql
-- Réinitialiser les compteurs d'utilisation
UPDATE coupons 
SET usages_actuels = 0 
WHERE code IN ('TEST1', 'TEST2');

-- Vérifier
SELECT 
    code,
    usages_actuels,
    usages_max_global,
    usages_max_par_utilisateur,
    actif,
    bloque
FROM coupons 
WHERE code IN ('TEST1', 'TEST2');
```

**Résultat attendu** :
- `usages_actuels = 0`
- `actif = 1`
- `bloque = 0`

---

### Solution 2 : Corriger le HTML du Checkout

Le problème vient probablement d'une structure de formulaire incorrecte dans `checkout.component.html`.

#### Vérifier la section paiement

Le `formControlName="modePaiement"` doit être sur un élément de formulaire valide (input, select, mat-select, etc.).

**Exemple correct** :
```html
<mat-form-field>
  <mat-label>Mode de paiement</mat-label>
  <mat-select formControlName="modePaiement">
    <mat-option value="ESPECES">Paiement à la livraison</mat-option>
    <mat-option value="CARTE">Carte bancaire</mat-option>
  </mat-select>
</mat-form-field>
```

**Exemple incorrect** :
```html
<!-- ❌ NE PAS FAIRE ÇA -->
<div formControlName="modePaiement">
  <button>Espèces</button>
</div>
```

---

### Solution 3 : Vérifier la Table Addresses

```sql
-- Vérifier la structure de la table
DESCRIBE addresses;

-- Vérifier les données
SELECT * FROM addresses LIMIT 5;

-- Vérifier les adresses de votre utilisateur
SELECT 
    a.id,
    a.prenom,
    a.nom,
    a.ville,
    u.email
FROM addresses a
JOIN users u ON a.user_id = u.id
WHERE u.email = 'votre-email@example.com';  -- Remplacez par votre email
```

Si la table est vide ou a des problèmes, créez une adresse de test :

```sql
-- Trouver votre user_id
SELECT id, email FROM users WHERE email = 'votre-email@example.com';

-- Créer une adresse de test (remplacez USER_ID par votre ID)
INSERT INTO addresses (user_id, prenom, nom, rue, code_postal, ville, pays, telephone, principal)
VALUES (USER_ID, 'Test', 'User', '123 Rue Test', '1000', 'Tunis', 'Tunisie', '12345678', 1);
```

---

### Solution 4 : Tester avec le Bon Code Coupon

Vous avez testé avec `BIENVENUE10` qui n'existe pas. Utilisez `TEST1` ou `TEST2`.

#### Dans la Console du Navigateur (F12)

```javascript
// Test avec TEST1
const token = localStorage.getItem('fd_token');

fetch('http://localhost:8080/api/coupons/validate?code=TEST1&sousTotal=21.45&fraisLivraison=0', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(data => {
  console.log('Réponse:', data);
  if (data.valide) {
    console.log('✅ COUPON VALIDE !');
    console.log('💰 Réduction:', data.reductionTotale, 'DT');
  } else {
    console.log('❌ Invalide:', data.message);
  }
})
.catch(err => {
  console.error('Erreur:', err);
});
```

---

## 🧪 Procédure de Test Complète

### Étape 1 : Nettoyer la Base de Données

1. Ouvrir phpMyAdmin
2. Sélectionner la base `fermedirecte`
3. Exécuter les requêtes SQL de la **Solution 1**
4. Vérifier que `usages_actuels = 0` pour TEST1 et TEST2

### Étape 2 : Redémarrer le Backend

```bash
# Dans le terminal du backend
# 1. Arrêter (Ctrl+C)
# 2. Redémarrer
cd backend
mvn spring-boot:run
```

Attendre le message : `Started FermeDirecteApplication`

### Étape 3 : Rafraîchir le Frontend

1. Appuyer sur **F5** dans le navigateur
2. Se reconnecter si nécessaire

### Étape 4 : Tester la Validation du Coupon

1. Ouvrir la console (F12)
2. Exécuter le test JavaScript de la **Solution 4**
3. Vérifier que le statut est **200** et `valide: true`

### Étape 5 : Tester une Commande Complète

1. **Ajouter des produits au panier**
   - Aller sur `/products`
   - Ajouter 2-3 produits

2. **Aller au checkout**
   - Cliquer sur "Passer la commande"

3. **Étape 1 : Adresse**
   - Remplir l'adresse de livraison
   - Cliquer sur "Suivant"

4. **Étape 2 : Paiement**
   - Sélectionner "Paiement à la livraison"
   - Cliquer sur "Suivant"

5. **Étape 3 : Confirmation**
   - Entrer le code : `TEST1`
   - Cliquer sur "Appliquer"
   - Vérifier que la réduction s'applique
   - Cliquer sur "Confirmer la commande"

6. **Vérifier le résultat**
   - ✅ Message de succès
   - ✅ Numéro de commande affiché
   - ✅ Redirection vers "Mes commandes"

### Étape 6 : Vérifier dans la Base de Données

```sql
-- 1. Vérifier que la commande a été créée
SELECT 
    o.numero_commande,
    o.total_ttc,
    o.statut,
    c.code as coupon_code,
    u.email
FROM orders o
LEFT JOIN coupons c ON o.coupon_id = c.id
JOIN users u ON o.user_id = u.id
ORDER BY o.date_commande DESC
LIMIT 1;

-- 2. Vérifier que le compteur a augmenté
SELECT 
    code,
    usages_actuels,
    usages_max_global
FROM coupons 
WHERE code = 'TEST1';

-- Résultat attendu : usages_actuels = 1

-- 3. Vérifier l'historique d'utilisation
SELECT 
    cu.date_utilisation,
    u.email,
    c.code
FROM coupon_usages cu
JOIN users u ON cu.user_id = u.id
JOIN coupons c ON cu.coupon_id = c.id
ORDER BY cu.date_utilisation DESC
LIMIT 1;
```

---

## 🎯 Checklist de Vérification

### Avant de Tester

- [ ] Les requêtes SQL de nettoyage ont été exécutées
- [ ] `usages_actuels = 0` pour TEST1 et TEST2
- [ ] La table `coupon_usages` est vide (ou nettoyée)
- [ ] Les commandes de test ont été supprimées
- [ ] Le backend a été redémarré
- [ ] Le message "Started FermeDirecteApplication" est visible
- [ ] Le frontend a été rafraîchi (F5)
- [ ] L'utilisateur est connecté

### Pendant le Test

- [ ] Le test JavaScript retourne `status: 200`
- [ ] Le test JavaScript retourne `valide: true`
- [ ] Le coupon s'applique dans le checkout
- [ ] La réduction est visible
- [ ] Aucune erreur dans la console

### Après le Test

- [ ] La commande a été créée
- [ ] Le numéro de commande est affiché
- [ ] Le compteur `usages_actuels` a augmenté
- [ ] Une ligne a été ajoutée dans `coupon_usages`
- [ ] La commande apparaît dans "Mes commandes"

---

## 🐛 Si le Problème Persiste

### Erreur 409 (Conflict)

**Copier les logs du backend** et chercher :
```
ERROR
constraint
duplicate
```

Cela indiquera quelle contrainte pose problème.

### Erreur 500 (Internal Server Error)

**Copier les logs du backend** et chercher :
```
Exception
at com.FermeDirecte
```

Cela montrera la stack trace complète.

### Erreur FormControl

**Vérifier le HTML** :
```bash
# Chercher tous les formControlName dans checkout.component.html
grep -n "formControlName" frontend/src/app/components/checkout/checkout.component.html
```

Chaque `formControlName` doit être sur un élément de formulaire valide.

---

## 📊 Résumé des Coupons de Test

| Code | Type | Réduction | Livraison | Montant Min | Limite |
|------|------|-----------|-----------|-------------|--------|
| TEST1 | GLOBAL | 10% | Non | Aucun | 999 |
| TEST2 | SELLER | Hybride | Oui | Aucun | 999 |

### TEST1 - Coupon Global Simple
- **Réduction** : 10% sur le sous-total
- **Livraison** : Normale (5 DT)
- **Exemple** : Panier 21.45 DT → Réduction 2.15 DT → Total 24.30 DT

### TEST2 - Coupon Vendeur Hybride
- **Réduction** : Pourcentage + Montant fixe + Livraison gratuite
- **Livraison** : Gratuite
- **Exemple** : Panier 36.35 DT → Réduction 35.99 DT → Total 0.36 DT

---

## ✅ Conclusion

Une fois les étapes de nettoyage effectuées et le backend redémarré, le système de coupons devrait fonctionner parfaitement.

**Points clés** :
1. ✅ Le backend sauvegarde le coupon avant association (ligne 167)
2. ✅ Les modèles TypeScript sont corrects
3. ⚠️ Utiliser les bons codes de test (TEST1, TEST2)
4. ⚠️ Nettoyer les données de test avant chaque test
5. ⚠️ Vérifier la structure du formulaire de paiement

---

**Date** : 1er mai 2026  
**Statut** : 🔧 EN COURS DE RÉSOLUTION  
**Prochaine étape** : Exécuter les requêtes SQL de nettoyage
