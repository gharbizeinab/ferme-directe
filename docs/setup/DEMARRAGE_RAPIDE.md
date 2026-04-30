# 🚀 Démarrage Rapide - FermeDirecte

## ⚡ En 4 étapes

### 0️⃣ Configurer le JDK (première fois seulement)

Si vous voyez l'erreur `JDK isn't specified for module 'FermeDirecte'` :

**Solution rapide (IntelliJ) :**
1. `Ctrl + Alt + Shift + S` (Project Structure)
2. SDK → Sélectionnez votre **JDK** (17, 21, 23, etc.)
3. Language level → **17**
4. Apply → Rechargez Maven (clic droit sur pom.xml → Maven → Reload)

📖 **Guide détaillé :** `FIX_JDK_INTELLIJ.md`

> 💡 Le projet nécessite Java 17+ mais fonctionne avec JDK 23

---

### 1️⃣ Démarrer XAMPP
- Ouvrez XAMPP Control Panel
- Démarrez **MySQL** (le voyant doit être vert ✅)
- Démarrez **Apache** (optionnel, pour phpMyAdmin)

### 2️⃣ Démarrer le Backend
```bash
cd ferme-directe-complete/backend
mvn spring-boot:run
```

**✅ Le backend est prêt quand vous voyez :**
```
✅ Utilisateur admin créé avec succès !
   📧 Email: admin@fermedirecte.com
   🔑 Mot de passe: Admin123!
```

### 3️⃣ Démarrer le Frontend
```bash
cd ferme-directe-complete/frontend
npm start
```

**✅ Le frontend est prêt quand vous voyez :**
```
** Angular Live Development Server is listening on localhost:4200 **
```

---

## 🔐 Se connecter

Ouvrez votre navigateur : **http://localhost:4200**

### Compte Administrateur (créé automatiquement)
- **Email :** `admin@fermedirecte.com`
- **Mot de passe :** `Admin123!`
- **Accès :** Toutes les fonctionnalités (dashboard, gestion des catégories, etc.)

### Comptes de test (optionnels)
Pour créer des comptes vendeur et client de test, importez le fichier SQL :
```
backend/sql/SIMPLE_TEST_DATA.sql
```

**Vendeur :**
- Email : `vendeur@test.com`
- Mot de passe : `password123`

**Client :**
- Email : `client@test.com`
- Mot de passe : `password123`

---

## 🎯 Que faire ensuite ?

### En tant qu'Admin
1. ✅ Gérer les catégories de produits
2. ✅ Voir le dashboard de tous les vendeurs
3. ✅ Gérer les commandes de tous les vendeurs

### En tant que Vendeur
1. ✅ Créer des produits
2. ✅ Voir son dashboard personnel
3. ✅ Gérer ses commandes

### En tant que Client
1. ✅ Parcourir les produits
2. ✅ Ajouter au panier
3. ✅ Passer des commandes

---

## 🐛 Problèmes courants

### Le backend ne démarre pas
- ✅ Vérifiez que MySQL est démarré dans XAMPP
- ✅ Vérifiez que le port 8080 est libre
- ✅ Vérifiez que la base de données `fermedirecte` existe

### Le frontend ne démarre pas
- ✅ Vérifiez que Node.js est installé : `node --version`
- ✅ Installez les dépendances : `npm install`
- ✅ Vérifiez que le port 4200 est libre

### Je ne peux pas me connecter avec l'admin
- ✅ Vérifiez que le backend a bien créé l'admin (voir les logs)
- ✅ Utilisez exactement : `admin@fermedirecte.com` / `Admin123!`
- ✅ Si le problème persiste, consultez `CREER_ADMIN.md`

---

## 📚 Documentation complète

- **README.md** - Vue d'ensemble du projet
- **CREER_ADMIN.md** - Guide détaillé pour créer un admin
- **WORKFLOW_QUOTIDIEN.md** - Workflow de développement
- **docs/** - Documentation technique complète

---

## 🆘 Besoin d'aide ?

1. Consultez les logs du backend (terminal)
2. Consultez la console du navigateur (F12)
3. Vérifiez phpMyAdmin : http://localhost/phpmyadmin
4. Lisez la documentation dans le dossier `docs/`
