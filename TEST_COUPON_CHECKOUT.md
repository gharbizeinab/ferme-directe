# 🔍 Diagnostic du Problème de Coupon

## Étape 1 : Vérifier le Backend

### Ouvrir la console du navigateur (F12) et exécuter :

```javascript
// 1. Vérifier le token
const token = localStorage.getItem('fd_token');
console.log('Token présent:', token ? 'OUI' : 'NON');

// 2. Tester l'endpoint de validation
fetch('http://localhost:8080/api/coupons/validate?code=BIENVENUE10&sousTotal=21.45&fraisLivraison=0', {
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
})
.catch(err => {
  console.error('Erreur:', err);
});
```

## Étape 2 : Analyser la Réponse

### Si Status = 403 (Forbidden)
**Problème** : Le backend n'a pas été redémarré avec les nouvelles autorisations

**Solution** :
1. Arrêter le backend (Ctrl+C dans le terminal)
2. Recompiler : `mvn clean compile`
3. Redémarrer : `mvn spring-boot:run`

### Si Status = 404 (Not Found)
**Problème** : L'endpoint n'existe pas ou le chemin est incorrect

**Solution** :
1. Vérifier que le backend est démarré
2. Vérifier l'URL : `http://localhost:8080/api/coupons/validate`

### Si Status = 500 (Internal Server Error)
**Problème** : Erreur dans le code backend

**Solution** :
1. Regarder les logs du backend
2. Vérifier que le coupon existe dans la base de données

### Si "No static resource"
**Problème** : Spring Security bloque la requête

**Solution** :
1. Le backend doit être redémarré avec le code corrigé
2. Vérifier `CouponController.java` ligne 163

## Étape 3 : Vérifier le Coupon dans la Base de Données

### Ouvrir phpMyAdmin et exécuter :

```sql
-- Vérifier que le coupon existe
SELECT * FROM coupons WHERE code = 'BIENVENUE10';

-- Vérifier qu'il est actif
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

**Le coupon doit avoir** :
- `actif = 1` (true)
- `bloque = 0` (false)
- `date_debut` <= aujourd'hui
- `date_expiration` >= aujourd'hui
- `usages_actuels` < `usages_max_global`

## Étape 4 : Vérifier le Rôle de l'Utilisateur

```sql
-- Vérifier votre rôle
SELECT email, role FROM users WHERE email = 'votre-email@example.com';
```

**Le rôle doit être** : `CUSTOMER` ou `CLIENT`

## Étape 5 : Solution Rapide

### Si le backend n'a pas été redémarré :

1. **Arrêter le backend** (Ctrl+C)

2. **Naviguer vers le dossier backend** :
```bash
cd backend
```

3. **Recompiler** :
```bash
mvn clean compile
```

4. **Redémarrer** :
```bash
mvn spring-boot:run
```

5. **Attendre le message** : "Started FermeDirecteApplication"

6. **Retester dans le navigateur**

## Étape 6 : Test Complet dans la Console

```javascript
// Script de test complet
(async function testCoupon() {
  const token = localStorage.getItem('fd_token');
  
  if (!token) {
    console.error('❌ Pas de token. Connectez-vous d\'abord.');
    return;
  }
  
  console.log('✅ Token trouvé');
  
  try {
    const response = await fetch('http://localhost:8080/api/coupons/validate?code=BIENVENUE10&sousTotal=21.45&fraisLivraison=0', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Status:', response.status);
    
    if (response.status === 403) {
      console.error('❌ ERREUR 403: Le backend doit être redémarré');
      console.log('👉 Solution: Arrêter le backend, recompiler avec mvn clean compile, puis redémarrer');
      return;
    }
    
    if (response.status === 404) {
      console.error('❌ ERREUR 404: Endpoint introuvable');
      console.log('👉 Vérifier que le backend est démarré sur le port 8080');
      return;
    }
    
    const data = await response.json();
    console.log('📦 Réponse:', data);
    
    if (data.valide) {
      console.log('✅ COUPON VALIDE !');
      console.log('💰 Réduction:', data.reductionTotale, 'DT');
      console.log('💵 Total après coupon:', data.totalApresCoupon, 'DT');
    } else {
      console.log('❌ Coupon invalide:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Erreur réseau:', error);
  }
})();
```

## Étape 7 : Vérifier les Logs du Backend

Dans le terminal du backend, chercher :

```
ERROR: No static resource api/coupons/validate
```

**Si vous voyez cette erreur** : Le backend n'a PAS été redémarré avec le code corrigé.

**Solution** : REDÉMARRER LE BACKEND (étape 5)

## Étape 8 : Vérifier le Frontend

### Dans checkout.component.ts, vérifier :

```typescript
// La méthode doit utiliser POST
this.couponService.validateCoupon(
  this.couponCode.toUpperCase(),
  this.cart.sousTotal || 0,
  this.cart.fraisLivraison || 0,
  []
)
```

### Dans coupon.service.ts, vérifier :

```typescript
validateCoupon(...): Observable<CouponValidation> {
  let params = new HttpParams()
    .set('code', code)
    .set('sousTotal', sousTotal.toString())
    .set('fraisLivraison', fraisLivraison.toString());

  return this.http.post<CouponValidation>(
    `${this.apiUrl}/validate`, 
    null,  // ← Important : body null
    { params }
  );
}
```

## ✅ Checklist de Vérification

- [ ] Le backend est démarré
- [ ] Le backend a été redémarré APRÈS la modification du CouponController
- [ ] Le coupon existe dans la base de données
- [ ] Le coupon est actif (actif=1, bloque=0)
- [ ] Le coupon n'est pas expiré
- [ ] L'utilisateur est connecté (token présent)
- [ ] L'utilisateur a le rôle CUSTOMER
- [ ] Le frontend est démarré
- [ ] La console du navigateur ne montre pas d'erreur CORS

## 🆘 Si Rien ne Fonctionne

Exécutez ce script dans la console pour un diagnostic complet :

```javascript
console.log('=== DIAGNOSTIC COMPLET ===');
console.log('1. Token:', localStorage.getItem('fd_token') ? '✅ Présent' : '❌ Absent');
console.log('2. URL Backend:', 'http://localhost:8080');
console.log('3. Endpoint:', '/api/coupons/validate');

// Test de connexion au backend
fetch('http://localhost:8080/api/products')
  .then(r => console.log('4. Backend accessible:', r.ok ? '✅ OUI' : '❌ NON'))
  .catch(() => console.log('4. Backend accessible: ❌ NON'));
```

---

**IMPORTANT** : La cause la plus probable est que le backend n'a PAS été redémarré après la modification du `CouponController.java`. 

**SOLUTION** : Arrêter le backend, recompiler, et redémarrer.
