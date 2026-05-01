# 🧪 Test du Coupon TEST1

## Étape 1 : Vérifier les Détails du Coupon

Dans **phpMyAdmin**, exécutez :

```sql
SELECT 
    id,
    code,
    description,
    pourcentage_reduction,
    montant_fixe_reduction,
    livraison_gratuite,
    montant_minimum,
    montant_maximum_reduction,
    actif,
    bloque,
    DATE_FORMAT(date_debut, '%Y-%m-%d %H:%i:%s') as debut,
    DATE_FORMAT(date_expiration, '%Y-%m-%d %H:%i:%s') as expiration,
    usages_actuels,
    usages_max_global
FROM coupons 
WHERE code = 'TEST1';
```

**Vérifiez que** :
- `actif = 1`
- `bloque = 0`
- `date_debut` <= aujourd'hui (2026-05-01)
- `date_expiration` >= aujourd'hui (2026-05-01)
- Au moins une réduction est définie (pourcentage OU montant fixe OU livraison gratuite)

---

## Étape 2 : Tester dans la Console du Navigateur

Ouvrez la console (F12) et exécutez :

```javascript
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
  console.log('Réponse complète:', data);
  if (data.valide) {
    console.log('✅ COUPON VALIDE !');
    console.log('💰 Réduction totale:', data.reductionTotale, 'DT');
    console.log('💵 Total après coupon:', data.totalApresCoupon, 'DT');
  } else {
    console.log('❌ Coupon invalide:', data.message);
  }
})
.catch(err => {
  console.error('❌ Erreur:', err);
});
```

---

## Étape 3 : Analyser le Résultat

### Si Status = 200 et valide = true
✅ **PARFAIT !** Le coupon fonctionne.

**Prochaine étape** : Tester dans l'application
1. Aller au checkout
2. Entrer `TEST1` dans le champ coupon
3. Cliquer sur "Appliquer"

### Si Status = 500 et message = "Code coupon invalide"
❌ **Problème** : Le coupon existe mais n'est pas valide

**Causes possibles** :
1. Le coupon est inactif (`actif = 0`)
2. Le coupon est bloqué (`bloque = 1`)
3. Le coupon est expiré
4. Le coupon n'a pas encore commencé
5. Aucune réduction n'est définie

**Solution** : Corriger dans phpMyAdmin :

```sql
UPDATE coupons 
SET 
    actif = 1,
    bloque = 0,
    date_debut = '2026-01-01 00:00:00',
    date_expiration = '2026-12-31 23:59:59',
    pourcentage_reduction = 10.0  -- Ajouter une réduction de 10%
WHERE code = 'TEST1';
```

### Si Status = 500 et message différent
❌ **Problème** : Erreur dans le backend

**Solution** : Regarder les logs du backend pour voir l'erreur exacte

---

## Étape 4 : Si le Coupon TEST1 n'a Pas de Réduction

Vérifiez avec :

```sql
SELECT 
    code,
    pourcentage_reduction,
    montant_fixe_reduction,
    livraison_gratuite
FROM coupons 
WHERE code = 'TEST1';
```

**Si tous sont NULL ou 0**, ajoutez une réduction :

```sql
-- Option 1 : Ajouter 10% de réduction
UPDATE coupons 
SET pourcentage_reduction = 10.0
WHERE code = 'TEST1';

-- OU Option 2 : Ajouter 5 DT de réduction
UPDATE coupons 
SET montant_fixe_reduction = 5.0
WHERE code = 'TEST1';

-- OU Option 3 : Ajouter livraison gratuite
UPDATE coupons 
SET livraison_gratuite = 1
WHERE code = 'TEST1';
```

---

## Étape 5 : Tester dans l'Application

1. **Rafraîchir la page du checkout** (F5)

2. **Aller à l'étape 3 (Confirmation)**

3. **Dans la section "Code promo"** :
   - Entrer : `TEST1`
   - Cliquer sur "Appliquer"

4. **Vérifier** :
   - Badge vert de confirmation
   - Ligne de réduction dans le récapitulatif
   - Total mis à jour

---

## 🔍 Diagnostic Complet

Si ça ne fonctionne toujours pas, exécutez ce script complet :

```javascript
(async () => {
  console.log('🔍 DIAGNOSTIC COMPLET DU COUPON TEST1\n');
  
  // 1. Token
  const token = localStorage.getItem('fd_token');
  console.log('1. Token:', token ? '✅ Présent' : '❌ Absent');
  if (!token) return;
  
  // 2. Backend accessible
  try {
    const ping = await fetch('http://localhost:8080/api/products');
    console.log('2. Backend:', ping.ok ? '✅ Accessible' : '❌ Erreur');
  } catch {
    console.log('2. Backend: ❌ Non accessible');
    return;
  }
  
  // 3. Test du coupon TEST1
  try {
    const res = await fetch('http://localhost:8080/api/coupons/validate?code=TEST1&sousTotal=21.45&fraisLivraison=0', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('3. Validation TEST1:');
    console.log('   Status:', res.status);
    
    const data = await res.json();
    console.log('   Réponse:', data);
    
    if (res.ok && data.valide) {
      console.log('\n✅ LE COUPON TEST1 FONCTIONNE !');
      console.log('💰 Réduction:', data.reductionTotale, 'DT');
      console.log('💵 Total après:', data.totalApresCoupon, 'DT');
      console.log('\n👉 Vous pouvez maintenant l\'utiliser dans l\'application');
    } else {
      console.log('\n❌ PROBLÈME DÉTECTÉ');
      console.log('Message:', data.message || data.error);
      console.log('\n👉 Vérifiez les détails du coupon dans phpMyAdmin');
    }
  } catch (e) {
    console.log('3. Validation: ❌ Erreur', e.message);
  }
})();
```

---

## 📋 Checklist

- [ ] Le coupon TEST1 existe dans la base de données
- [ ] `actif = 1`
- [ ] `bloque = 0`
- [ ] Les dates sont valides
- [ ] Au moins une réduction est définie
- [ ] Le test dans la console retourne `valide: true`
- [ ] Le backend est démarré
- [ ] Je suis connecté avec le rôle CUSTOMER

---

## 🎯 Résultat Attendu

Après avoir tout vérifié, vous devriez voir dans la console :

```
✅ LE COUPON TEST1 FONCTIONNE !
💰 Réduction: 2.145 DT
💵 Total après: 19.305 DT
```

Et dans l'application :
- Badge vert : "TEST1 - Réduction de X DT appliquée"
- Ligne : "Réduction coupon (TEST1): -X DT"
- Total mis à jour

---

**Date** : 1er mai 2026  
**Coupon testé** : TEST1
