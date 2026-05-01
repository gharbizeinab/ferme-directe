# 🐛 Problème : Le Coupon Créé Ne S'Affiche Pas

## 🎯 Situation

Vous avez créé un coupon avec succès, mais il ne s'affiche pas dans la liste.

---

## 🔍 Diagnostic Étape par Étape

### Étape 1 : Vérifier que le Coupon Existe en Base de Données

Ouvrez phpMyAdmin et exécutez :
```sql
SELECT * FROM coupons ORDER BY date_creation DESC LIMIT 5;
```

**✅ Si vous voyez votre coupon :** Le problème est dans le frontend  
**❌ Si vous ne voyez pas votre coupon :** Le problème est dans le backend

---

### Étape 2 : Vérifier la Console du Navigateur

1. Ouvrez votre application : `http://localhost:4200`
2. Appuyez sur **F12** pour ouvrir les outils de développement
3. Allez dans l'onglet **"Console"**
4. Rechargez la page des coupons

**Cherchez des erreurs en rouge.**

#### Erreurs Possibles :

**A) Erreur CORS**
```
Access to XMLHttpRequest at 'http://localhost:8080/api/coupons/...' 
from origin 'http://localhost:4200' has been blocked by CORS policy
```

**Solution :** Vérifiez que `@CrossOrigin(origins = "*")` est présent dans `CouponController.java`

**B) Erreur 401 Unauthorized**
```
GET http://localhost:8080/api/coupons/admin/all 401 (Unauthorized)
```

**Solution :** Votre token JWT a expiré. Reconnectez-vous.

**C) Erreur 403 Forbidden**
```
GET http://localhost:8080/api/coupons/admin/all 403 (Forbidden)
```

**Solution :** Vous n'avez pas les permissions. Connectez-vous avec un compte admin.

**D) Erreur 500 Internal Server Error**
```
GET http://localhost:8080/api/coupons/admin/all 500 (Internal Server Error)
```

**Solution :** Erreur backend. Regardez les logs du backend.

---

### Étape 3 : Vérifier l'Onglet Network

1. Dans les outils de développement (F12)
2. Allez dans l'onglet **"Network"** (Réseau)
3. Rechargez la page des coupons
4. Cherchez la requête vers `/api/coupons/admin/all` ou `/api/coupons/seller/my-coupons`
5. Cliquez dessus

**Vérifiez :**
- **Status :** Doit être `200 OK`
- **Response :** Doit contenir un tableau JSON avec vos coupons

#### Si Status = 200 mais Response vide `[]`

**Cause :** Le backend ne retourne aucun coupon

**Solutions possibles :**

**Pour Admin :**
- Vérifiez que vous êtes bien connecté en tant qu'admin
- Le coupon existe mais n'est pas retourné par l'API

**Pour Vendeur :**
- Vérifiez que le coupon a bien `seller_id` = votre ID utilisateur
- Exécutez cette requête SQL :
```sql
SELECT id, code, scope, seller_id FROM coupons WHERE scope = 'SELLER';
```

---

### Étape 4 : Vérifier les Logs du Backend

Dans le terminal où vous avez lancé `mvn spring-boot:run`, cherchez des erreurs.

**Erreurs possibles :**

**A) Erreur de mapping**
```
No converter found for return value of type: class java.util.ArrayList
```

**Solution :** Problème de sérialisation JSON. Vérifiez que Jackson est configuré.

**B) Erreur SQL**
```
SQLSyntaxErrorException: Unknown column 'xxx' in 'field list'
```

**Solution :** La structure de la table ne correspond pas à l'entité Java.

---

## 🔧 Solutions Rapides

### Solution 1 : Recharger la Page

Parfois, il suffit de recharger la page :
1. Appuyez sur **Ctrl + F5** (rechargement forcé)
2. Ou fermez et rouvrez l'onglet

---

### Solution 2 : Vider le Cache

1. Ouvrez les outils de développement (F12)
2. Clic droit sur le bouton de rechargement
3. Sélectionnez **"Vider le cache et effectuer une actualisation forcée"**

---

### Solution 3 : Vérifier le Filtre

Si vous êtes sur la page admin :
1. Vérifiez que le filtre **"Portée"** est sur **"Tous"**
2. Vérifiez que le filtre **"Statut"** est sur **"Tous"**
3. Videz le champ de recherche

---

### Solution 4 : Reconnecter

Votre token JWT a peut-être expiré :
1. Déconnectez-vous
2. Reconnectez-vous
3. Retournez sur la page des coupons

---

### Solution 5 : Redémarrer le Backend

```bash
# Arrêtez le backend (Ctrl+C)
# Puis redémarrez
cd ferme-directe-complete/backend
mvn spring-boot:run
```

---

### Solution 6 : Redémarrer le Frontend

```bash
# Arrêtez le frontend (Ctrl+C)
# Puis redémarrez
cd ferme-directe-complete/frontend
ng serve
```

---

## 🧪 Test Manuel de l'API

### Test avec la Console du Navigateur

Ouvrez la console (F12) et exécutez :

**Pour Admin :**
```javascript
// Récupérez votre token JWT (dans localStorage)
const token = localStorage.getItem('token');

// Testez l'API
fetch('http://localhost:8080/api/coupons/admin/all', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => {
  console.log('Coupons:', data);
  console.log('Nombre de coupons:', data.length);
})
.catch(err => console.error('Erreur:', err));
```

**Pour Vendeur :**
```javascript
// Récupérez votre token JWT (dans localStorage)
const token = localStorage.getItem('token');

// Testez l'API
fetch('http://localhost:8080/api/coupons/seller/my-coupons', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => {
  console.log('Mes coupons:', data);
  console.log('Nombre de coupons:', data.length);
})
.catch(err => console.error('Erreur:', err));
```

**Résultat attendu :**
```javascript
Coupons: [{id: 1, code: "TEST2024", ...}, ...]
Nombre de coupons: 1
```

---

## 🔍 Vérifications Spécifiques

### Si vous êtes ADMIN

**Vérifiez que vous avez le rôle ADMIN :**
```javascript
// Dans la console du navigateur
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Role:', payload.role);
// Doit afficher: Role: ADMIN
```

**Vérifiez l'endpoint :**
```
GET http://localhost:8080/api/coupons/admin/all
```

---

### Si vous êtes VENDEUR

**Vérifiez que le coupon a votre seller_id :**
```sql
-- Trouvez votre ID utilisateur
SELECT id, email, role FROM users WHERE email = 'VOTRE_EMAIL';

-- Vérifiez le coupon
SELECT id, code, scope, seller_id FROM coupons WHERE code = 'VOTRE_CODE';
```

**Le `seller_id` doit correspondre à votre `id` utilisateur.**

**Vérifiez l'endpoint :**
```
GET http://localhost:8080/api/coupons/seller/my-coupons
```

---

## 📊 Checklist de Débogage

### Base de Données
- [ ] Le coupon existe dans la table `coupons`
- [ ] Le coupon a les bonnes valeurs (code, description, etc.)
- [ ] Pour vendeur : `seller_id` correspond à votre ID utilisateur
- [ ] Pour vendeur : `scope` = 'SELLER'
- [ ] Pour admin : `scope` peut être 'GLOBAL' ou 'SELLER'

### Backend
- [ ] Le backend est démarré (`mvn spring-boot:run`)
- [ ] Aucune erreur dans les logs
- [ ] L'endpoint est accessible
- [ ] CORS est configuré (`@CrossOrigin`)

### Frontend
- [ ] Le frontend est démarré (`ng serve`)
- [ ] Aucune erreur dans la console (F12)
- [ ] La requête HTTP retourne 200 OK
- [ ] La réponse contient des données
- [ ] Vous êtes connecté (token JWT valide)
- [ ] Vous avez les bonnes permissions (ADMIN ou SELLER)

### Interface
- [ ] Les filtres sont sur "Tous"
- [ ] Le champ de recherche est vide
- [ ] La page a été rechargée (Ctrl+F5)
- [ ] Le cache a été vidé

---

## 🎯 Scénarios Courants

### Scénario 1 : Admin ne voit aucun coupon

**Cause probable :** Token expiré ou permissions incorrectes

**Solution :**
1. Déconnectez-vous
2. Reconnectez-vous avec un compte admin
3. Retournez sur `/admin/coupons`

---

### Scénario 2 : Vendeur ne voit pas son coupon

**Cause probable :** Le `seller_id` ne correspond pas

**Solution :**
```sql
-- Trouvez votre ID
SELECT id FROM users WHERE email = 'VOTRE_EMAIL';

-- Mettez à jour le coupon
UPDATE coupons 
SET seller_id = VOTRE_ID 
WHERE code = 'VOTRE_CODE';
```

---

### Scénario 3 : Le coupon apparaît puis disparaît

**Cause probable :** Les filtres masquent le coupon

**Solution :**
1. Mettez tous les filtres sur "Tous"
2. Videz le champ de recherche
3. Rechargez la page

---

### Scénario 4 : Erreur 401 Unauthorized

**Cause :** Token JWT expiré

**Solution :**
1. Déconnectez-vous
2. Reconnectez-vous
3. Retournez sur la page des coupons

---

## 🆘 Si Rien Ne Fonctionne

### Étape 1 : Vérification Complète

Exécutez ces commandes SQL dans phpMyAdmin :

```sql
-- 1. Vérifier que le coupon existe
SELECT * FROM coupons ORDER BY date_creation DESC LIMIT 1;

-- 2. Vérifier votre utilisateur
SELECT id, email, role FROM users WHERE email = 'VOTRE_EMAIL';

-- 3. Vérifier le seller_id du coupon (si vendeur)
SELECT id, code, scope, seller_id FROM coupons WHERE code = 'VOTRE_CODE';
```

### Étape 2 : Test API Direct

Utilisez Postman ou curl :

```bash
# Remplacez VOTRE_TOKEN par votre token JWT
curl -H "Authorization: Bearer VOTRE_TOKEN" \
     http://localhost:8080/api/coupons/admin/all
```

### Étape 3 : Logs Détaillés

Activez les logs détaillés dans `application.properties` :

```properties
logging.level.com.FermeDirecte.FermeDirecte=DEBUG
logging.level.org.springframework.web=DEBUG
```

Redémarrez le backend et regardez les logs.

---

## 📞 Informations à Fournir

Si le problème persiste, fournissez ces informations :

1. **Rôle de l'utilisateur :** Admin ou Vendeur ?
2. **Console du navigateur :** Copier les erreurs (F12 → Console)
3. **Onglet Network :** Status et Response de la requête
4. **Logs du backend :** Copier les erreurs du terminal
5. **Requête SQL :** Résultat de `SELECT * FROM coupons LIMIT 5;`
6. **Token JWT :** Est-il présent dans localStorage ?

---

## ✅ Résolution Probable

Dans 90% des cas, le problème vient de :

1. **Token JWT expiré** → Reconnectez-vous
2. **Filtres actifs** → Mettez tout sur "Tous"
3. **Cache du navigateur** → Videz le cache (Ctrl+F5)
4. **seller_id incorrect** → Mettez à jour en SQL
5. **Backend non démarré** → Redémarrez le backend

---

**🔍 Commencez par vérifier la console du navigateur (F12) et l'onglet Network !**

