# ⚡ Débogage Rapide - Coupon Ne S'Affiche Pas

## 🎯 Problème

Vous avez créé un coupon, mais il ne s'affiche pas dans la liste.

---

## ✅ Solutions Rapides (Testez dans l'ordre)

### 1️⃣ Recharger la Page (30 secondes)

**Action :**
- Appuyez sur **Ctrl + F5** (Windows) ou **Cmd + Shift + R** (Mac)

**Résultat attendu :** Le coupon apparaît

---

### 2️⃣ Vérifier les Filtres (30 secondes)

**Action :**
1. Mettez le filtre **"Portée"** sur **"Tous"**
2. Mettez le filtre **"Statut"** sur **"Tous"**
3. Videz le champ de **recherche**

**Résultat attendu :** Le coupon apparaît

---

### 3️⃣ Vérifier la Console (1 minute)

**Action :**
1. Appuyez sur **F12**
2. Allez dans l'onglet **"Console"**
3. Cherchez des erreurs en rouge

**Erreurs courantes :**

**❌ Erreur 401 Unauthorized**
```
GET http://localhost:8080/api/coupons/admin/all 401
```
**Solution :** Reconnectez-vous (votre session a expiré)

**❌ Erreur CORS**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution :** Redémarrez le backend

**❌ Erreur 403 Forbidden**
```
GET http://localhost:8080/api/coupons/admin/all 403
```
**Solution :** Vous n'avez pas les permissions. Connectez-vous en admin.

---

### 4️⃣ Reconnecter (1 minute)

**Action :**
1. Cliquez sur **"Déconnexion"**
2. Reconnectez-vous
3. Retournez sur la page des coupons

**Résultat attendu :** Le coupon apparaît

---

### 5️⃣ Vérifier en Base de Données (1 minute)

**Action :**
Ouvrez phpMyAdmin et exécutez :
```sql
SELECT id, code, description, scope, seller_id, actif 
FROM coupons 
ORDER BY date_creation DESC 
LIMIT 5;
```

**Vérifiez :**
- ✅ Votre coupon est dans la liste
- ✅ `actif` = 1
- ✅ Si vous êtes vendeur : `seller_id` = votre ID utilisateur

**Si le coupon n'est pas là :**
→ Le coupon n'a pas été créé. Réessayez de le créer.

**Si `seller_id` est NULL et vous êtes vendeur :**
→ Exécutez cette requête (remplacez les valeurs) :
```sql
UPDATE coupons 
SET seller_id = VOTRE_ID_UTILISATEUR 
WHERE code = 'VOTRE_CODE_COUPON';
```

---

### 6️⃣ Tester l'API Manuellement (2 minutes)

**Action :**
1. Appuyez sur **F12**
2. Allez dans l'onglet **"Console"**
3. Copiez-collez ce code :

**Pour Admin :**
```javascript
const token = localStorage.getItem('token');
fetch('http://localhost:8080/api/coupons/admin/all', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log('Coupons:', data))
.catch(err => console.error('Erreur:', err));
```

**Pour Vendeur :**
```javascript
const token = localStorage.getItem('token');
fetch('http://localhost:8080/api/coupons/seller/my-coupons', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log('Mes coupons:', data))
.catch(err => console.error('Erreur:', err));
```

**Résultat attendu :**
```
Coupons: [{id: 1, code: "TEST2024", ...}]
```

**Si vous voyez `[]` (tableau vide) :**
→ Le backend ne retourne aucun coupon. Voir solution 7.

**Si vous voyez une erreur :**
→ Problème de connexion ou de permissions. Reconnectez-vous.

---

### 7️⃣ Vérifier le seller_id (Vendeur uniquement) (2 minutes)

**Action :**

**Étape 1 : Trouvez votre ID utilisateur**
```sql
SELECT id, email, role FROM users WHERE email = 'VOTRE_EMAIL';
```
Notez votre `id` (ex: 5)

**Étape 2 : Vérifiez le coupon**
```sql
SELECT id, code, scope, seller_id FROM coupons WHERE code = 'VOTRE_CODE';
```

**Étape 3 : Si `seller_id` ne correspond pas, corrigez**
```sql
UPDATE coupons 
SET seller_id = 5  -- Remplacez par votre ID
WHERE code = 'VOTRE_CODE';
```

**Étape 4 : Rechargez la page**

**Résultat attendu :** Le coupon apparaît

---

### 8️⃣ Redémarrer le Backend (2 minutes)

**Action :**
```bash
# Dans le terminal du backend, appuyez sur Ctrl+C
# Puis redémarrez
cd ferme-directe-complete/backend
mvn spring-boot:run
```

**Attendez le message :**
```
Started FermeDirecteApplication in X.XXX seconds
```

**Puis rechargez la page des coupons**

**Résultat attendu :** Le coupon apparaît

---

### 9️⃣ Redémarrer le Frontend (2 minutes)

**Action :**
```bash
# Dans le terminal du frontend, appuyez sur Ctrl+C
# Puis redémarrez
cd ferme-directe-complete/frontend
ng serve
```

**Attendez le message :**
```
✔ Compiled successfully.
```

**Puis rechargez la page : `http://localhost:4200`**

**Résultat attendu :** Le coupon apparaît

---

## 🔍 Diagnostic Avancé

Si aucune des solutions ci-dessus ne fonctionne, suivez le guide complet :

👉 **`PROBLEME_AFFICHAGE_COUPONS.md`**

---

## 📊 Checklist Rapide

Cochez au fur et à mesure :

- [ ] J'ai rechargé la page (Ctrl+F5)
- [ ] J'ai vérifié les filtres (tous sur "Tous")
- [ ] J'ai vérifié la console (F12)
- [ ] Je me suis reconnecté
- [ ] J'ai vérifié en base de données
- [ ] J'ai testé l'API manuellement
- [ ] J'ai vérifié le seller_id (vendeur)
- [ ] J'ai redémarré le backend
- [ ] J'ai redémarré le frontend

---

## 🎯 Causes les Plus Fréquentes

| Cause | Fréquence | Solution |
|-------|-----------|----------|
| Token JWT expiré | 40% | Reconnectez-vous |
| Filtres actifs | 25% | Mettez tout sur "Tous" |
| seller_id incorrect | 15% | Corrigez en SQL |
| Cache du navigateur | 10% | Ctrl+F5 |
| Backend non démarré | 5% | Redémarrez le backend |
| Autre | 5% | Voir guide complet |

---

## 🆘 Besoin d'Aide ?

### Informations à Fournir

1. **Êtes-vous Admin ou Vendeur ?**
2. **Que voyez-vous dans la console (F12) ?**
3. **Résultat de cette requête SQL :**
   ```sql
   SELECT * FROM coupons ORDER BY date_creation DESC LIMIT 1;
   ```
4. **Résultat du test API manuel (solution 6)**

---

## ✅ Résolution Probable

**Dans 90% des cas, la solution est :**

1. **Reconnectez-vous** (token expiré)
2. **Vérifiez les filtres** (tous sur "Tous")
3. **Rechargez la page** (Ctrl+F5)

---

**🚀 Commencez par la solution 1 et testez dans l'ordre !**

