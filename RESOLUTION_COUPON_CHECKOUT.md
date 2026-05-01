# 🚨 RÉSOLUTION : Impossible d'Appliquer un Coupon

## ❌ Symptôme

Quand vous essayez d'appliquer un coupon dans le checkout :
- Message d'erreur : "Une erreur inattendue s'est produite"
- Détail : "No static resource"
- Le coupon ne s'applique pas

---

## ✅ SOLUTION RAPIDE (90% des cas)

### Le backend doit être redémarré !

Le fichier `CouponController.java` a été modifié pour accepter le rôle `CUSTOMER`, mais le backend tourne encore avec l'ancienne version qui n'accepte que `CLIENT`.

### Étapes :

1. **Arrêter le backend**
   - Aller dans le terminal où le backend tourne
   - Appuyer sur `Ctrl+C`
   - Attendre que le processus s'arrête

2. **Utiliser le script de redémarrage**
   - Double-cliquer sur `REDEMARRER_BACKEND.bat`
   - OU exécuter manuellement :
   ```bash
   cd backend
   mvn clean compile
   mvn spring-boot:run
   ```

3. **Attendre le démarrage complet**
   - Chercher dans les logs : `Started FermeDirecteApplication`
   - Cela prend environ 30-60 secondes

4. **Retester dans le navigateur**
   - Rafraîchir la page du checkout (F5)
   - Essayer d'appliquer le coupon

---

## 🔍 Vérification Rapide

### Dans la console du navigateur (F12), exécuter :

```javascript
const token = localStorage.getItem('fd_token');
fetch('http://localhost:8080/api/coupons/validate?code=BIENVENUE10&sousTotal=21.45&fraisLivraison=0', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => console.log('Status:', r.status, r.ok ? '✅ OK' : '❌ ERREUR'))
.catch(e => console.error('❌ Erreur:', e));
```

**Résultat attendu** : `Status: 200 ✅ OK`

**Si vous voyez** :
- `Status: 403` → Backend pas redémarré
- `Status: 404` → Backend pas démarré du tout
- `Status: 500` → Erreur dans le code ou base de données

---

## 🗄️ Vérifier la Base de Données

### Dans phpMyAdmin, exécuter :

```sql
-- Vérifier que le coupon existe et est actif
SELECT 
    code,
    actif,
    bloque,
    date_debut,
    date_expiration,
    usages_actuels,
    usages_max_global
FROM coupons 
WHERE code = 'BIENVENUE10';
```

**Résultat attendu** :
```
code          | actif | bloque | date_debut | date_expiration | usages_actuels | usages_max_global
BIENVENUE10   | 1     | 0      | 2026-01-01 | 2026-12-31      | 0              | 100
```

**Si le coupon n'existe pas**, créer un coupon de test :

```sql
INSERT INTO coupons (
    code, description, pourcentage_reduction, 
    livraison_gratuite, scope, usages_max_global, 
    usages_actuels, usages_max_par_utilisateur,
    date_debut, date_expiration, actif, bloque
) VALUES (
    'BIENVENUE10', 'Réduction de 10% pour les nouveaux clients', 10.0,
    0, 'GLOBAL', 100,
    0, 5,
    '2026-01-01', '2026-12-31', 1, 0
);
```

---

## 👤 Vérifier le Rôle de l'Utilisateur

### Dans phpMyAdmin :

```sql
-- Remplacer par votre email
SELECT email, role FROM users WHERE email = 'votre-email@example.com';
```

**Le rôle doit être** : `CUSTOMER`

**Si le rôle est différent**, le corriger :

```sql
UPDATE users SET role = 'CUSTOMER' WHERE email = 'votre-email@example.com';
```

---

## 🔧 Autres Causes Possibles

### 1. Le Frontend n'est pas à jour

**Solution** :
```bash
cd frontend
# Arrêter le serveur (Ctrl+C)
ng serve
```

### 2. Problème de CORS

**Vérifier dans la console** : Erreur "CORS policy"

**Solution** : Vérifier que `@CrossOrigin(origins = "*")` est présent dans `CouponController.java`

### 3. Token expiré

**Symptôme** : Erreur 401 Unauthorized

**Solution** :
1. Se déconnecter
2. Se reconnecter
3. Retester

### 4. Le panier est vide

**Symptôme** : `cart.sousTotal` est 0

**Solution** :
1. Ajouter des produits au panier
2. Retourner au checkout
3. Appliquer le coupon

---

## 📋 Checklist Complète

Avant de demander de l'aide, vérifier :

- [ ] ✅ Le backend est démarré
- [ ] ✅ Le backend a été **REDÉMARRÉ** après la modification
- [ ] ✅ Le message "Started FermeDirecteApplication" est visible
- [ ] ✅ Le frontend est démarré (ng serve)
- [ ] ✅ Je suis connecté (token présent)
- [ ] ✅ Mon rôle est CUSTOMER
- [ ] ✅ Le coupon existe dans la base de données
- [ ] ✅ Le coupon est actif (actif=1, bloque=0)
- [ ] ✅ Le coupon n'est pas expiré
- [ ] ✅ Mon panier contient des produits
- [ ] ✅ Pas d'erreur CORS dans la console

---

## 🎯 Test Final

Une fois tout vérifié, tester avec ce script :

```javascript
// Test complet
(async () => {
  console.log('🔍 Test du système de coupons...\n');
  
  // 1. Token
  const token = localStorage.getItem('fd_token');
  console.log('1. Token:', token ? '✅' : '❌');
  if (!token) {
    console.log('   → Connectez-vous d\'abord');
    return;
  }
  
  // 2. Backend
  try {
    const ping = await fetch('http://localhost:8080/api/products');
    console.log('2. Backend:', ping.ok ? '✅' : '❌');
  } catch {
    console.log('2. Backend: ❌ (pas démarré)');
    return;
  }
  
  // 3. Validation coupon
  try {
    const res = await fetch('http://localhost:8080/api/coupons/validate?code=BIENVENUE10&sousTotal=21.45&fraisLivraison=0', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('3. Validation:', res.ok ? '✅' : '❌');
    
    if (res.ok) {
      const data = await res.json();
      console.log('\n✅ TOUT FONCTIONNE !');
      console.log('Réduction:', data.reductionTotale, 'DT');
      console.log('Total après coupon:', data.totalApresCoupon, 'DT');
    } else {
      console.log('   Status:', res.status);
      if (res.status === 403) {
        console.log('   → REDÉMARRER LE BACKEND');
      }
    }
  } catch (e) {
    console.log('3. Validation: ❌', e.message);
  }
})();
```

---

## 📞 Support

Si le problème persiste après avoir suivi toutes ces étapes :

1. **Copier les logs du backend** (dernières 50 lignes)
2. **Copier les erreurs de la console du navigateur**
3. **Copier le résultat du test final**
4. **Indiquer les étapes déjà effectuées**

---

## ⚡ Résumé en 3 Étapes

```
1. Arrêter le backend (Ctrl+C)
2. Double-cliquer sur REDEMARRER_BACKEND.bat
3. Attendre "Started FermeDirecteApplication"
```

**C'est tout !** 🎉

---

**Date** : 1er mai 2026  
**Problème** : Coupon non applicable  
**Cause** : Backend pas redémarré  
**Solution** : Redémarrer le backend
