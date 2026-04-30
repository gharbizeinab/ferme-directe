# 🔐 Guide de Connexion Administrateur

## 🎯 Objectif
Se connecter à l'application FermeDirecte avec un compte administrateur.

---

## 📋 Prérequis

### 1. XAMPP MySQL démarré
- ✅ Ouvrez XAMPP Control Panel
- ✅ Cliquez sur **Start** à côté de MySQL
- ✅ Le voyant doit être **vert**

### 2. Backend démarré
```bash
cd ferme-directe-complete/backend
mvn spring-boot:run
```

**OU** double-cliquez sur : `DEMARRER_BACKEND.bat`

### 3. Frontend démarré
```bash
cd ferme-directe-complete/frontend
npm start
```

**OU** double-cliquez sur : `DEMARRER_FRONTEND.bat`

---

## 🚀 Méthode Rapide (Tout en un)

Double-cliquez sur : **`DEMARRER_TOUT.bat`**

Ce script démarre automatiquement le backend et le frontend !

---

## 🔑 Credentials Admin

### Compte créé automatiquement

Dès le premier démarrage du backend, un compte admin est créé automatiquement.

**Email :** `admin@fermedirecte.com`  
**Mot de passe :** `Admin123!`

> ⚠️ **Attention :** Le mot de passe est sensible à la casse !
> - ✅ `Admin123!` (correct)
> - ❌ `admin123!` (incorrect)
> - ❌ `Admin123` (incorrect - manque le !)

---

## 📝 Étapes de connexion

### 1. Ouvrir l'application
Ouvrez votre navigateur et allez sur :
```
http://localhost:4200
```

### 2. Cliquer sur "Connexion"
- Cherchez le bouton "Connexion" ou "Se connecter" dans le menu
- Cliquez dessus

### 3. Entrer les credentials
- **Email :** `admin@fermedirecte.com`
- **Mot de passe :** `Admin123!`

### 4. Cliquer sur "Se connecter"
Vous devriez être redirigé vers le dashboard admin.

---

## ✅ Vérification de la connexion

### Dans les logs du backend

Lors du démarrage, vous devriez voir :
```
🔧 Création de l'utilisateur admin par défaut...
✅ Utilisateur admin créé avec succès !
   📧 Email: admin@fermedirecte.com
   🔑 Mot de passe: Admin123!
```

### Dans l'application

Après connexion, vous devriez voir :
- ✅ Votre nom "Admin FermeDirecte" dans le menu
- ✅ Un badge "Administrateur" sur votre profil
- ✅ Accès au menu "Gestion des catégories"
- ✅ Accès au dashboard complet

---

## 🐛 Problèmes courants

### ❌ "Email ou mot de passe incorrect"

**Causes possibles :**
1. Le backend n'a pas créé l'admin
2. Vous avez fait une faute de frappe
3. La base de données n'est pas accessible

**Solutions :**
1. ✅ Vérifiez les logs du backend (voir ci-dessus)
2. ✅ Copiez-collez les credentials exactement :
   - Email : `admin@fermedirecte.com`
   - Mot de passe : `Admin123!`
3. ✅ Vérifiez que MySQL est démarré dans XAMPP
4. ✅ Consultez `CREER_ADMIN.md` pour créer l'admin manuellement

### ❌ "Cannot connect to backend"

**Causes possibles :**
1. Le backend n'est pas démarré
2. Le backend a planté
3. Le port 8080 est utilisé par une autre application

**Solutions :**
1. ✅ Vérifiez que le backend tourne (terminal ouvert)
2. ✅ Vérifiez les logs du backend pour des erreurs
3. ✅ Redémarrez le backend
4. ✅ Vérifiez que http://localhost:8080 répond

### ❌ L'admin n'a pas été créé automatiquement

**Solution :**
Consultez le guide détaillé : **`CREER_ADMIN.md`**

Ce guide propose 3 méthodes alternatives :
1. Via l'API REST (Postman/curl)
2. Via phpMyAdmin (SQL)
3. Vérification du DataInitializer

---

## 🎯 Fonctionnalités Admin

Une fois connecté en tant qu'admin, vous avez accès à :

### Dashboard
- ✅ Statistiques globales de tous les vendeurs
- ✅ Vue d'ensemble des commandes
- ✅ Revenus totaux

### Gestion des catégories
- ✅ Créer des catégories
- ✅ Modifier des catégories
- ✅ Supprimer des catégories
- ✅ Gérer la hiérarchie (catégories parentes)

### Gestion des commandes
- ✅ Voir toutes les commandes
- ✅ Modifier le statut des commandes
- ✅ Filtrer par vendeur

### Gestion des produits
- ✅ Voir tous les produits
- ✅ Créer des produits (en tant que boutique admin)
- ✅ Modifier/supprimer des produits

---

## 📚 Documentation complémentaire

- **DEMARRAGE_RAPIDE.md** - Guide de démarrage en 3 étapes
- **CREER_ADMIN.md** - Guide détaillé de création d'admin
- **SOLUTION_ADMIN.md** - Explication technique de la solution
- **README.md** - Vue d'ensemble du projet

---

## 🆘 Besoin d'aide ?

Si vous rencontrez toujours des problèmes :

1. ✅ Consultez les logs du backend (terminal)
2. ✅ Consultez la console du navigateur (F12)
3. ✅ Vérifiez phpMyAdmin : http://localhost/phpmyadmin
4. ✅ Lisez `CREER_ADMIN.md` pour les solutions alternatives
5. ✅ Vérifiez que la base de données `fermedirecte` existe

---

## 🎉 Bon développement !

Vous êtes maintenant prêt à utiliser FermeDirecte en tant qu'administrateur ! 🚀
