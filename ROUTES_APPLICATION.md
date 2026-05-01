# 🗺️ Routes de l'Application - Ferme Directe

## ✅ Route avec la NOUVELLE CHARTE Appliquée

### 🎨 `/products` - Page des Produits
**URL** : `http://localhost:4200/products`

**Charte appliquée** : ✅ OUI (Exemple de référence)

**Ce que vous verrez** :
- ✅ Nouvelle couleur verte lumineuse (#4CAF50)
- ✅ Police Roboto
- ✅ Cartes avec effet hover (montent)
- ✅ Badges redessinés
- ✅ Icônes Material
- ✅ Animations fluides
- ✅ Espacements cohérents

---

## 📍 Toutes les Routes Disponibles

### Routes Publiques (Sans connexion)

| Route | URL | Charte Appliquée | Description |
|-------|-----|------------------|-------------|
| **Products** | `/products` | ✅ **OUI** | Liste des produits |
| **Product Details** | `/products/:id` | ❌ Non | Détails d'un produit |
| **Login** | `/login` | ❌ Non | Connexion |
| **Register** | `/register` | ❌ Non | Inscription |

---

### Routes Utilisateur (Connexion requise)

| Route | URL | Charte Appliquée | Description |
|-------|-----|------------------|-------------|
| **Cart** | `/cart` | ❌ Non | Panier |
| **Checkout** | `/checkout` | ❌ Non | Paiement |
| **Orders** | `/orders` | ❌ Non | Mes commandes |
| **Profile** | `/profile` | ❌ Non | Mon profil |

---

### Routes Vendeur (SELLER)

| Route | URL | Charte Appliquée | Description |
|-------|-----|------------------|-------------|
| **Dashboard** | `/dashboard` | ❌ Non | Tableau de bord vendeur |
| **Manage Products** | `/manage-products` | ❌ Non | Gérer mes produits |
| **Seller Coupons** | `/seller/coupons` | ❌ Non | Mes coupons |

---

### Routes Admin (ADMIN)

| Route | URL | Charte Appliquée | Description |
|-------|-----|------------------|-------------|
| **Dashboard** | `/dashboard` | ❌ Non | Tableau de bord admin |
| **Users** | `/users` | ❌ Non | Gestion utilisateurs |
| **All Orders** | `/all-orders` | ❌ Non | Toutes les commandes |
| **Manage Categories** | `/manage-categories` | ❌ Non | Gestion catégories |
| **Admin Coupons** | `/admin/coupons` | ❌ Non | Gestion coupons |

---

## 🎯 Pour Voir la Nouvelle Charte

### Étape 1 : Lancer l'Application

**Option A - Script automatique** :
```bash
# Double-cliquez sur :
DEMARRAGE_RAPIDE.bat
```

**Option B - Manuel** :
```bash
# Terminal 1 - Backend
cd backend
mvn spring-boot:run

# Terminal 2 - Frontend
cd frontend
npm start
```

### Étape 2 : Ouvrir dans le Navigateur

```
http://localhost:4200/products
```

### Étape 3 : Vérifier les Changements

✅ **Couleur des boutons** → Vert lumineux (#4CAF50)  
✅ **Hover sur carte** → La carte monte  
✅ **Police** → Roboto  
✅ **Icônes** → Material Icons  
✅ **Badges** → Plus visibles  

---

## 📊 Résumé

| Statut | Nombre | Routes |
|--------|--------|--------|
| ✅ **Charte appliquée** | **1** | `/products` |
| ❌ **À faire** | **13** | Toutes les autres |

---

## 🚀 Prochaines Routes à Mettre à Jour

### Priorité Haute
1. ✅ `/products` - **FAIT**
2. ⏳ `/products/:id` - Product Details
3. ⏳ `/cart` - Panier
4. ⏳ `/checkout` - Paiement

### Priorité Moyenne
5. ⏳ `/dashboard` - Dashboard
6. ⏳ `/manage-products` - Gestion produits
7. ⏳ `/orders` - Commandes
8. ⏳ `/profile` - Profil

### Priorité Basse
9. ⏳ `/login` - Connexion
10. ⏳ `/register` - Inscription
11. ⏳ `/users` - Gestion utilisateurs
12. ⏳ `/manage-categories` - Catégories
13. ⏳ `/admin/coupons` - Coupons admin
14. ⏳ `/seller/coupons` - Coupons vendeur

---

## 💡 Comment Appliquer la Charte aux Autres Routes

Pour chaque composant, suivez le guide :
👉 **APPLIQUER_CHARTE_AUTRES_COMPOSANTS.md**

Utilisez le composant Products comme référence :
👉 **frontend/src/app/components/products/**

---

## 🎨 Aperçu Visuel Sans Lancer l'App

Si vous voulez voir les styles sans lancer l'application :
👉 **Double-cliquez sur : APERCU_CHARTE.html**

---

## ✅ Checklist de Vérification

Quand vous ouvrez `/products`, vérifiez :

- [ ] URL : `http://localhost:4200/products`
- [ ] Couleur primaire : Vert lumineux (#4CAF50)
- [ ] Hover sur carte : La carte monte
- [ ] Police : Roboto (pas Nunito)
- [ ] Icônes : Material Icons présentes
- [ ] Badges : Plus visibles et arrondis
- [ ] Animations : Fluides et cohérentes

---

## 🆘 Problèmes Courants

### Je ne vois pas la page Products
**Solution** : Vérifiez que l'URL est bien `http://localhost:4200/products`

### Les styles ne sont pas appliqués
**Solution** :
1. Vider le cache du navigateur (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Vérifier que le frontend est bien compilé

### Erreur 404
**Solution** : Vérifiez que le backend et le frontend sont lancés

---

**Version** : 1.0.0  
**Date** : 2026-05-01  
**Route principale** : `/products` ✅
